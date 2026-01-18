import React from 'react'
import Quill from 'quill'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './index.less'

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
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['link'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
          ],
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
