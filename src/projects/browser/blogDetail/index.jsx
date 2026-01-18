import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import BlogTitle from '@/components/BlogTitle'
import PreNextBlog from '@/components/PreNextBlog'
import { getBlogDetail, likeBlog } from '@/network'

import './index.less'

function BlogDetail() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [loading, setLoading] = useState(true)
  const [blogDetail, setBlogDetail] = useState(null)
  const navigate = useNavigate()

  const getBlogDetailFunc = async () => {
    if (!id) {
      setLoading(false)
      return
    }
    setLoading(true)
    const res = await getBlogDetail({ id })
    setLoading(false)
    if (!res?.data) return
    setBlogDetail(res.data)
    setTimeout(() => {
      document.getElementsByClassName('layout-d-content')[0].scrollTop = 0
    }, 100)
  }

  const handleLike = async () => {
    const res = await likeBlog({ id, isLiked: blogDetail.isLiked ? 0 : 1 })
    if (!res?.data) return
    setBlogDetail(state => ({
      ...state,
      likeCount: state.likeCount + (blogDetail.isLiked ? -1 : 1),
      isLiked: blogDetail.isLiked ? 0 : 1,
    }))
  }

  const handleCategoryClick = () => {
    navigate(`/tagList?tagId=${blogDetail.category_id}`)
  }

  const handleTagClick = tagId => {
    navigate(`/tagList?tagId=${tagId}`)
  }

  const handlePre = () => {
    navigate(`/blogDetail?id=${blogDetail.prevBlog?.id}`)
  }

  const handleNext = () => {
    navigate(`/blogDetail?id=${blogDetail.nextBlog?.id}`)
  }

  useEffect(() => {
    getBlogDetailFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!blogDetail && loading)
    return (
      <div className='blog-detail-loading'>
        <div className='blog-detail-loading-spinner'></div>
        <div className='blog-detail-loading-text'>加载中...</div>
      </div>
    )
  if (!blogDetail && !loading)
    return (
      <div className='blog-detail-empty'>
        <svg
          className='blog-detail-empty-icon'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <div className='blog-detail-empty-text'>暂无数据</div>
        <div className='blog-detail-empty-desc'>抱歉，没有找到相关内容</div>
      </div>
    )
  return (
    <div className='blog-detail'>
      <BlogTitle
        createTime={blogDetail.createTime}
        title={blogDetail.title}
        look_number={blogDetail.look_number}
        commentCount={blogDetail.commentCount}
        likeCount={blogDetail.likeCount}
        tags={blogDetail.tags}
        categoryName={blogDetail.category_name}
        handleLike={handleLike}
        handleCategoryClick={handleCategoryClick}
        handleTagClick={handleTagClick}
      />
      <div
        className='blog-detail-content'
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: blogDetail.content }}
      />
      <PreNextBlog
        havePre={blogDetail.prevBlog}
        haveNext={blogDetail.nextBlog}
        onPre={handlePre}
        onNext={handleNext}
      />
    </div>
  )
}

export default BlogDetail
