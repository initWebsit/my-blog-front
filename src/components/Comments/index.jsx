import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { Toast } from '@/library/ui'
import { getBlogComments, publishBlogComment } from '@/network'

import './index.less'

const UploadComment = ({ successCallback, blogId, parentId = null, parentGrandId = null }) => {
  const [content, setContent] = useState('')
  const { userInfo } = useSelector(state => state.app)
  const navigate = useNavigate()

  const onSubmit = async () => {
    if (!userInfo?.id) {
      Toast.error('请先登陆，即将跳转至登陆页...')
      setTimeout(() => {
        navigate('/login?redirect_url=' + encodeURIComponent(window.location.href))
      }, 1000)
      return
    }
    if (!content.trim()) {
      return Toast.error('请输入评论')
    }
    let result
    try {
      Toast.loading({ maskClickable: false })
      result = await publishBlogComment({
        blogId,
        content,
        parentId,
        parentGrandId,
      })
    } catch (error) {}
    Toast.clear()
    if (!result?.data) return
    Toast.success('评论成功')
    setContent('')
    successCallback?.()
  }

  return (
    <section className='comments-upload'>
      <div className='comments-upload-title'>发表评论</div>
      <div className='comments-upload-content'>
        <div className='comments-upload-content-label'>
          评论<span className='comments-upload-content-label-red'>*</span>
        </div>
        <div className='comments-upload-content-textarea'>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className='comments-upload-content-textarea-content'
            rows={4}
            placeholder='请输入评论...'
          />
        </div>
      </div>
      <div className='comments-upload-button'>
        <div className='comments-upload-button-text' onClick={onSubmit}>
          发表评论
        </div>
      </div>
    </section>
  )
}

const CommentItem = ({
  small,
  children,
  successCallback,
  item,
  parentGrandId = null,
  targetUserName = null,
  targetUserContent = null,
  blogCreateUserId,
}) => {
  const [showReply, setShowReply] = useState(false)

  const handleReply = () => {
    setShowReply(true)
  }

  const handleCancelReply = () => {
    setShowReply(false)
  }

  const successCallbackFunc = () => {
    handleCancelReply()
    successCallback?.()
  }

  return (
    <section className={`comments-list-item ${small ? 'comments-list-item-small' : ''}`}>
      <div className='comments-list-item-main'>
        <img
          className={`comments-list-item-main-img ${
            small ? 'comments-list-item-main-img-small' : ''
          }`}
          src='https://i.ibb.co/G4DKw4Rs/image.jpg'
        />
        <div className='comments-list-item-main-right'>
          <div className='comments-list-item-main-right-top'>
            <span className='comments-list-item-main-right-top-text'>{item.user_name}</span>
            {item.user_id === blogCreateUserId && (
              <span className='comments-list-item-main-right-top-admin'>UP</span>
            )}
          </div>
          <div className='comments-list-item-main-right-bottom'>
            {moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      </div>
      <div
        className={`comments-list-item-content ${small ? 'comments-list-item-content-small' : ''}`}
      >
        {targetUserName && (
          <div className='comments-list-item-content-target'>@{targetUserName}</div>
        )}
        {targetUserContent && (
          <div className='comments-list-item-content-target-content'>{targetUserContent}</div>
        )}
        <div className='comments-list-item-content-content'>{item.content}</div>
        <div>
          {showReply ? (
            <div className='comments-list-item-content-button' onClick={handleCancelReply}>
              取消回复
            </div>
          ) : (
            <div className='comments-list-item-content-button' onClick={handleReply}>
              回复
            </div>
          )}
        </div>
        {showReply && (
          <div
            className={`comments-list-item-content-reply ${
              small ? 'comments-list-item-content-reply-small' : ''
            }`}
          >
            <UploadComment
              blogId={item.blog_id}
              parentId={item.id}
              parentGrandId={parentGrandId}
              successCallback={successCallbackFunc}
            />
          </div>
        )}
        <div>{children ? children : null}</div>
      </div>
    </section>
  )
}

export default function Comments({ blogId, blogCreateUserId }) {
  const [comments, setComments] = useState([])
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  })
  const [loading, setLoading] = useState(false)

  const getBlogCommentsFunc = async () => {
    setLoading(true)
    const res = await getBlogComments({ blogId, page: pageInfo.page, pageSize: pageInfo.pageSize })
    setLoading(false)
    if (!res?.data) return
    setComments(
      pageInfo.page === 1
        ? res.data.list?.map(temp => ({
            ...temp,
            child_comments: JSON.parse(temp.child_comments),
          })) || []
        : [
            ...comments,
            ...(res.data.list?.map(temp => ({
              ...temp,
              child_comments: JSON.parse(temp.child_comments),
            })) || []),
          ]
    )
    setPageInfo(state => ({ ...state, total: res.data.total || 0 }))
  }

  const successCallbackFunc = () => {
    if (pageInfo.page === 1) {
      getBlogCommentsFunc()
      return
    }
    setPageInfo(state => ({ ...state, page: 1 }))
  }

  const handleMore = () => {
    setPageInfo(state => ({ ...state, page: state.page + 1 }))
  }

  useEffect(() => {
    getBlogCommentsFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId, pageInfo.page, pageInfo.pageSize])

  return (
    <section className='comments'>
      <div className='comments-num'>{pageInfo.total}条评论</div>
      <div className='comments-list'>
        {loading && <Loading isAbsolute />}
        {!loading && comments.length === 0 && <Empty />}
        {!loading &&
          comments.length > 0 &&
          comments.map((temp, index) => (
            <CommentItem
              key={index}
              item={temp}
              blogCreateUserId={blogCreateUserId}
              successCallback={successCallbackFunc}
            >
              {temp.child_comments?.length
                ? temp.child_comments.map((tempChild, indexChild) => (
                    <CommentItem
                      small
                      key={indexChild}
                      blogCreateUserId={blogCreateUserId}
                      parentGrandId={temp.id}
                      targetUserName={
                        tempChild.parent_id === temp.id
                          ? temp.user_name
                          : temp.child_comments.find(t => t.id === tempChild.parent_id)?.user_name
                      }
                      targetUserContent={
                        tempChild.parent_id === temp.id
                          ? temp.content
                          : temp.child_comments.find(t => t.id === tempChild.parent_id)?.content
                      }
                      item={tempChild}
                      successCallback={successCallbackFunc}
                    />
                  ))
                : null}
            </CommentItem>
          ))}
        {pageInfo.total > pageInfo.pageSize * pageInfo.page && (
          <div className='comments-list-more' onClick={handleMore}>
            查看更多评论
          </div>
        )}
      </div>
      <UploadComment blogId={blogId} successCallback={successCallbackFunc} />
    </section>
  )
}
