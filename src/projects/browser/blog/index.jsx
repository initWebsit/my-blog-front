import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BlogList from '@/components/BlogList'
import NavTop from '@/components/NavTop'
import NextPage from '@/components/NextPage'
import { getBlogList } from '@/network'

import './index.less'

function Blog() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
  })
  const [blogList, setBlogList] = useState([])

  const handleNext = () => {
    if (pageInfo.page >= Math.ceil(pageInfo.total / pageInfo.pageSize)) return
    setPageInfo(state => ({ ...state, page: state.page + 1 }))
  }

  const getBlogListFunc = async () => {
    setLoading(true)
    const res = await getBlogList({
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
      category: 1,
    })
    setLoading(false)
    if (!res?.data) return
    setPageInfo(state => ({ ...state, total: res.data.total }))
    setBlogList(res.data?.list || [])
  }

  useEffect(() => {
    getBlogListFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.page, pageInfo.pageSize])

  if (loading)
    return (
      <div className='blog-loading'>
        <div className='blog-loading-spinner'></div>
        <div className='blog-loading-text'>加载中...</div>
      </div>
    )
  if (!loading && blogList.length === 0)
    return (
      <div className='blog-empty'>
        <svg
          className='blog-empty-icon'
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
        <div className='blog-empty-text'>暂无数据</div>
        <div className='blog-empty-desc'>抱歉，没有找到相关内容</div>
      </div>
    )

  return (
    <section className='blog-container'>
      <NavTop title='分类：博客' number={pageInfo.total} />
      {blogList.map((item, index) => (
        <BlogList
          key={index}
          item={item}
          handleClick={() => navigate(`/blogDetail?id=${item.id}`)}
          handleCategoryClick={() =>
            navigate(`/tagList?categoryId=${item.category}&categoryName=${item.category_name}`)
          }
          handleTagClick={(tagId, tagName) =>
            navigate(`/tagList?tagId=${tagId}&tagName=${tagName}`)
          }
        />
      ))}
      <NextPage
        index={pageInfo.page}
        total={Math.ceil(pageInfo.total / pageInfo.pageSize)}
        onNext={handleNext}
      />
    </section>
  )
}

export default Blog
