import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import RichEditor from '@/components/richeditor'
import { Picker, Toast } from '@/library/ui'
import { getTags, publishBlog, uploadImage } from '@/network'

import './index.less'

function Publish() {
  const editorRef = useRef(null)
  const [title, setTitle] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [category, setCategory] = useState([1])
  const [pickerVisible, setPickerVisible] = useState(false)
  const navigate = useNavigate()
  const categoryOptions = [
    [
      { label: '博客', value: 1 },
      { label: '旅行', value: 2 },
    ],
  ]
  const [tagList, setTagList] = useState([])

  // 获取标签列表
  const getTagsFunc = async () => {
    const res = await getTags()
    setTagList(res.data || [])
  }

  // 切换标签选择
  const toggleTag = tag => {
    setSelectedTags(prev => {
      if (prev.map(t => t.id).includes(tag.id)) {
        return prev.filter(t => t.id !== tag.id)
      } else {
        return [...prev, { id: tag.id, name: tag.name }]
      }
    })
  }

  const submit = async () => {
    if (!title.trim()) {
      return Toast.error('请输入标题')
    }
    if (!editorRef.current?.getContent()) {
      return Toast.error('请先输入内容')
    }
    if (selectedTags.length === 0) {
      return Toast.error('请至少选择一个标签')
    }

    const publishData = {
      title: title.trim(),
      content: editorRef.current.getContent(),
      tags: selectedTags.map(t => t.id).join(','),
      category: categoryOptions[0].find(item => item.value === category[0])?.value,
      categoryName: categoryOptions[0].find(item => item.value === category[0])?.label,
    }

    let result
    try {
      Toast.loading({ maskClickable: false })
      result = await publishBlog(publishData)
    } catch (error) {}
    Toast.clear()
    if (!result?.data) return

    Toast.success('发布成功！')
    setTimeout(() => {
      navigate('/home')
    }, 1000)
  }

  const onUploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await uploadImage(formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res?.data?.url
  }

  useEffect(() => {
    getTagsFunc()
  }, [])

  return (
    <section className='page-publish'>
      <header className='page-publish-header'>发布专区</header>

      <div className='page-publish-form'>
        {/* 标题输入 */}
        <div className='form-group'>
          <label className='form-label'>标题</label>
          <input
            type='text'
            className='form-input'
            placeholder='请输入文章标题'
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        {/* 分类选择 */}
        <div className='form-group'>
          <label className='form-label'>分类</label>
          <Picker
            visible={pickerVisible}
            columns={categoryOptions}
            value={category}
            onConfirm={val => {
              setCategory(val)
              setPickerVisible(false)
            }}
            onClose={() => setPickerVisible(false)}
          >
            {items => (
              <div className='form-select' onClick={() => setPickerVisible(true)}>
                {categoryOptions[0].find(item => item.value === category[0])?.label ||
                  items[0]?.label}
              </div>
            )}
          </Picker>
        </div>

        {/* 标签选择 */}
        <div className='form-group'>
          <label className='form-label'>标签</label>
          <div className='form-tags'>
            {tagList.map(tag => (
              <span
                key={tag.id}
                className={`form-tag ${
                  selectedTags.map(t => t.id).includes(tag.id) ? 'form-tag-active' : ''
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag.name}
              </span>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className='form-tags-selected'>
              已选择：{selectedTags.map(tag => tag.name).join('、')}
            </div>
          )}
        </div>

        {/* 富文本编辑器 */}
        <div className='form-group'>
          <label className='form-label'>内容</label>
          <RichEditor 
            ref={editorRef}  
            content='' 
            onUploadImage={onUploadImage}
          />
        </div>

        {/* 确认按钮 */}
        <div className='form-actions'>
          <button type='button' className='form-button form-button-primary' onClick={submit}>
            确认发布
          </button>
        </div>
      </div>
    </section>
  )
}

export default Publish
