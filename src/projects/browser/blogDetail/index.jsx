import React, { useEffect, useState } from 'react'
import { PhotoSlider } from 'react-photo-view'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

import BlogTitle from '@/components/BlogTitle'
import Comments from '@/components/Comments'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import PreNextBlog from '@/components/PreNextBlog'
import Dialog from '@/library/ui/components/dialog-d'
import Toast from '@/library/ui/components/toast'
import { deleteBlog, getBlogDetail, likeBlog } from '@/network'

import 'react-photo-view/dist/react-photo-view.css'
import './index.less'

function BlogDetail() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [loading, setLoading] = useState(true)
  const [blogDetail, setBlogDetail] = useState(null)
  const [images, setImages] = useState([])
  const [visible, setVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const userInfo = useSelector(state => state.app.userInfo)
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

    // 通过正则匹配截取出富文本中多个图片链接
    const htmlStr = res.data?.content
    const pattern = /<img\s+[^>]*src\s*=\s*(['"]?)(.*?)\1/gi
    const imagesArr = [...htmlStr.matchAll(pattern)]
      .map(temp => temp?.[2]?.trim())
      .filter(item => item)
    setImages(imagesArr.map(item => ({ src: item, key: Math.random() })))

    setTimeout(() => {
      document.getElementsByClassName('layout-d-frame-main-content')[0].scrollTop = 0
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
    navigate(`/tagList?categoryId=${blogDetail.category}&categoryName=${blogDetail.category_name}`)
  }

  const handleTagClick = (tagId, tagName) => {
    navigate(`/tagList?tagId=${tagId}&tagName=${tagName}`)
  }

  const handlePre = () => {
    navigate(`/blogDetail?id=${blogDetail.prevBlog?.id}`)
  }

  const handleNext = () => {
    navigate(`/blogDetail?id=${blogDetail.nextBlog?.id}`)
  }

  const handleEdit = () => {
    navigate(`/editBlog?id=${blogDetail.id}`)
  }

  const handleDelete = () => {
    Dialog.confirm({
      cancelText: '取消',
      okText: '确认',
      title: '删除博客',
      content: '确定要删除这篇博客吗？',
      showCloseIcon: true,
      onOk: async () => {
        Toast.loading()
        const res = await deleteBlog({ id })
        Toast.clear()
        if (!res?.data) return
        Toast.success('删除成功')
        setTimeout(() => {
          navigate('/home', { replace: true })
        }, 1000)
      },
    })
  }

  const imageClickFunc = e => {
    if (e.target?.tagName !== 'IMG') return
    setVisible(true)
    setCurrentIndex(images.findIndex(temp => temp.src === e.target.src))
  }

  useEffect(() => {
    getBlogDetailFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    document
      .getElementsByClassName('blog-detail-content')?.[0]
      ?.addEventListener('click', imageClickFunc)

    return () => {
      document
        .getElementsByClassName('blog-detail-content')?.[0]
        ?.removeEventListener('click', imageClickFunc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images])

  if (loading) return <Loading />
  if (!blogDetail && !loading) return <Empty />
  return (
    <div className='blog-detail'>
      <BlogTitle
        isAdmin={blogDetail.create_person === userInfo.id}
        createTime={blogDetail.createTime}
        title={blogDetail.title}
        look_number={blogDetail.look_number}
        commentCount={blogDetail.commentCount}
        likeCount={blogDetail.likeCount}
        isLiked={blogDetail.isLiked}
        tags={blogDetail.tags}
        categoryName={blogDetail.category_name}
        handleLike={handleLike}
        handleCategoryClick={handleCategoryClick}
        handleTagClick={handleTagClick}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
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
      <Comments blogId={id} blogCreateUserId={blogDetail.create_person} />
      <PhotoSlider
        images={images.map(item => ({ src: item.src, key: item.key }))}
        visible={visible}
        index={currentIndex}
        onClose={() => setVisible(false)}
        onIndexChange={setCurrentIndex} // 切换图片时同步更新索引
      />
    </div>
  )
}

export default BlogDetail
