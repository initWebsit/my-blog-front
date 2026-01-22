import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import BlogList from '@/components/BlogList'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import NavTop from '@/components/NavTop'
import NextPage from '@/components/NextPage'
import { getBlogList } from '@/network'

import './index.less'

function TagList() {
  const [searchParams] = useSearchParams()
  const tagId = searchParams.get('tagId')
  const tagName = searchParams.get('tagName')
  const categoryId = searchParams.get('categoryId')
  const categoryName = searchParams.get('categoryName')
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
      tagId: tagId || undefined,
      category: categoryId || undefined,
    })
    setLoading(false)
    if (!res?.data) return
    setPageInfo(state => ({ ...state, total: res.data.total }))
    setBlogList(res.data?.list || [])
  }

  useEffect(() => {
    getBlogListFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.page, pageInfo.pageSize, tagId])

  if (loading) return <Loading />
  if (!loading && blogList.length === 0) return <Empty />
  return (
    <section className='tag-list-container'>
      <NavTop
        title={`${categoryName ? `分类：${categoryName}` : '标签：' + tagName}`}
        number={pageInfo.total}
      />
      {blogList.map((item, index) => (
        <BlogList
          key={index}
          item={item}
          handleClick={() => navigate(`/blogDetail?id=${item.id}`)}
          handleCategoryClick={() =>
            navigate(`/tagList?categoryId=${item.category}&categoryName=${item.category_name}`, {
              replace: true,
            })
          }
          handleTagClick={(tagIdTemp, tagNameTemp) =>
            navigate(`/tagList?tagId=${tagIdTemp}&tagName=${tagNameTemp}`, { replace: true })
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

export default TagList
