import React from 'react'
import Quill from 'quill'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './index.less'

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = e => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    img.src = url
  })
}

/**
 * 浏览器端压缩图片（等比缩放 + 质量压缩）
 * - gif 不压缩（避免丢失动图）
 * - 默认输出 jpeg（体积更小）；如果原图是 png 且你希望保留 png，可在 options.forceJpeg=false
 */
async function compressImageFile(
  file,
  {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    forceJpeg = true,
    maxSizeMB, // 可选：目标上限（尽力而为），比如 1 表示 1MB
  } = {}
) {
  if (!(file instanceof File)) return file
  if (/image\/gif/i.test(file.type)) return file

  const img = await loadImageFromFile(file)
  const sw = img.naturalWidth || img.width
  const sh = img.naturalHeight || img.height
  if (!sw || !sh) return file

  const ratio = Math.min(1, maxWidth / sw, maxHeight / sh)
  const tw = Math.max(1, Math.round(sw * ratio))
  const th = Math.max(1, Math.round(sh * ratio))

  const canvas = document.createElement('canvas')
  canvas.width = tw
  canvas.height = th
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(img, 0, 0, tw, th)

  const mime =
    forceJpeg === true
      ? 'image/jpeg'
      : file.type && /^image\//.test(file.type)
        ? file.type
        : 'image/jpeg'

  const toBlob = q =>
    new Promise(resolve => {
      canvas.toBlob(b => resolve(b), mime, mime === 'image/jpeg' ? q : undefined)
    })

  let q = quality
  let blob = await toBlob(q)
  if (!blob) return file

  // 尽力控制体积：逐步降低质量
  if (typeof maxSizeMB === 'number' && maxSizeMB > 0 && mime === 'image/jpeg') {
    const limit = maxSizeMB * 1024 * 1024
    while (blob.size > limit && q > 0.4) {
      q = Math.max(0.4, q - 0.08)
      // eslint-disable-next-line no-await-in-loop
      blob = await toBlob(q)
      if (!blob) break
    }
  }

  const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg'
  const name = (file.name || 'image').replace(/\.\w+$/, '') + `-c.${ext}`
  return new File([blob], name, { type: mime, lastModified: Date.now() })
}

export class RichTextContent extends React.Component {
  constructor(props) {
    super(props)
    this.ckEditor = null
    this.containerRef = React.createRef()
  }

  componentDidMount() {
    this.warpContent()
  }

  warpContent() {
    if (!this.containerRef.current) {
      return
    }
    const container = this.containerRef.current
    const anchorList = container.getElementsByTagName('a')
    for (let index = 0; index < anchorList.length; index++) {
      anchorList[index].target = '_blank'
    }
  }

  render() {
    const { content } = this.props
    return (
      <div
        className='ck-content ql-editor'
        ref={this.containerRef}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    )
  }
}

export default class RichEditor extends React.Component {
  constructor(props) {
    super(props)
    this.ckEditor = null
    this.containerRef = React.createRef()
    this.state = {
      wordCount: 0,
    }
    this.changeText = this.changeText.bind(this)
    this.handleToolbarImage = this.handleToolbarImage.bind(this)
  }

  componentDidMount() {
    this.initEditor()
  }

  componentWillUnmount() {
    this.destoryEditor()
  }

  getContent() {
    return this.ckEditor.getSemanticHTML()
  }

  changeText() {
    const breakLen = this.ckEditor
      .getContents()
      .ops?.reduce(
        (pre, temp) =>
          pre + (temp?.insert?.split?.('\n')?.length ? temp.insert.split('\n').length - 1 : 0),
        0
      )
    this.setState({
      wordCount: this.ckEditor.getLength() - breakLen,
    })
  }

  async initEditor() {
    const { onReady, onError } = this.props
    const container = this.containerRef.current
    try {
      const options = {
        debug: 'warn',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['link', 'image'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ['clean'],
            ],
            handlers: {
              image: this.handleToolbarImage,
            },
          },
        },
        clipboard: {
          matchers: [
            { tag: 'br', replaceWith: 'br' }, // 将 <br/> 替换回换行符
          ],
        },
        placeholder: '此处填写内容',
        theme: 'snow',
      }
      this.ckEditor = new Quill(container, options)
      this.ckEditor.on('text-change', this.changeText)
      onReady?.()
    } catch (e) {
      console.error(e)
      onError?.()
    }
  }

  async handleToolbarImage() {
    const { onUploadImage, compressOptions } = this.props

    // 选择图片
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = false

    const file = await new Promise(resolve => {
      input.onchange = () => resolve(input.files?.[0])
      input.click()
    })
    if (!file) return

    // 压缩（失败则回退原图）
    let uploadFile = file
    try {
      uploadFile = await compressImageFile(file, compressOptions)
    } catch (e) {
      console.warn('[RichEditor] compress image failed, fallback to original file', e)
      uploadFile = file
    }

    if (typeof onUploadImage !== 'function') {
      console.error('[RichEditor] 缺少 onUploadImage(file) 回调，无法上传图片')
      return
    }

    // 上传并插入
    try {
      let url = await onUploadImage(uploadFile)
      if (!url) return
      const range = this.ckEditor.getSelection(true) || { index: this.ckEditor.getLength() }
      this.ckEditor.insertEmbed(range.index, 'image', url, 'user')
      this.ckEditor.setSelection(range.index + 1, 0, 'silent')
    } catch (e) {
      console.error('[RichEditor] upload image failed', e)
    }
  }

  destoryEditor() {
    if (this.ckEditor) {
      this.ckEditor.off('text-change', this.changeText)
      this.ckEditor = null
    }
  }

  render() {
    const { content, maxCount = 20000 } = this.props
    const leftCount = maxCount - this.state.wordCount
    return (
      <div className='ui-xms-richeditor'>
        <div
          className='editor-view'
          ref={this.containerRef}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        <div className='footer-view'>
          当前已输入{this.state.wordCount}个字符, 您还可以输入{leftCount > 0 ? leftCount : '0'}
          个字符。
        </div>
      </div>
    )
  }
}
