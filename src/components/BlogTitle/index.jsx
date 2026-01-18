import React from 'react'
import moment from 'moment'

import './index.less'

export default function BlogTitle({
  createTime,
  title,
  look_number,
  commentCount,
  likeCount,
  tags,
  categoryName,
  handleLike = () => {},
  handleCategoryClick = () => {},
  handleTagClick = () => {},
}) {
  return (
    <div className='blog-title-item'>
      <div className='blog-title-item-title'>{title}</div>
      <div className='blog-title-item-operation'>
        <svg
          aria-hidden='true'
          role='img'
          class='blog-title-item-operation-icon'
          width='12px'
          height='12px'
          preserveAspectRatio='xMidYMid meet'
          viewBox='0 0 24 24'
          data-icon='mdi:calendar-month-outline'
        >
          <path
            fill='currentColor'
            d='M7 12h2v2H7v-2m14-6v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V2h2v2h8V2h2v2h1a2 2 0 0 1 2 2M5 8h14V6H5v2m14 12V10H5v10h14m-4-6v-2h2v2h-2m-4 0v-2h2v2h-2m-4 2h2v2H7v-2m8 2v-2h2v2h-2m-4 0v-2h2v2h-2Z'
          ></path>
        </svg>
        <span className='blog-title-item-operation-span'>
          {moment(createTime).format('YYYY-MM-DD HH:mm')}
        </span>

        <svg
          aria-hidden='true'
          role='img'
          class='blog-title-item-operation-icon'
          width='12px'
          height='12px'
          preserveAspectRatio='xMidYMid meet'
          viewBox='0 0 24 24'
          data-icon='mdi:eye'
        >
          <path
            fill='currentColor'
            d='M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z'
          ></path>
        </svg>
        <span className='blog-title-item-operation-span'>{look_number}</span>

        <svg
          aria-hidden='true'
          role='img'
          class='blog-title-item-operation-icon'
          width='12px'
          height='12px'
          preserveAspectRatio='xMidYMid meet'
          viewBox='0 0 24 24'
          data-icon='mdi:comment-outline'
        >
          <path
            fill='currentColor'
            d='M9 22a1 1 0 0 1-1-1v-3H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.1l-3.7 3.71c-.2.19-.45.29-.7.29H9m1-6v3.08L13.08 16H20V4H4v12h6Z'
          ></path>
        </svg>
        <span className='blog-title-item-operation-span'>{commentCount}</span>

        <svg
          onClick={handleLike}
          aria-hidden='true'
          role='img'
          class='blog-title-item-operation-icon'
          width='12px'
          height='12px'
          preserveAspectRatio='xMidYMid meet'
          viewBox='0 0 24 24'
          x-show='liked(55)'
          data-icon='mdi:heart'
          style={{ cursor: 'pointer', color: likeCount > 0 ? 'rgb(185, 28, 28)' : '#bbb' }}
        >
          <path
            fill='currentColor'
            d='m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z'
          ></path>
        </svg>
        <span
          className='blog-title-item-operation-span'
          style={{ color: likeCount > 0 ? 'rgb(185, 28, 28)' : '#bbb' }}
        >
          {likeCount}
        </span>

        <svg
          aria-hidden='true'
          role='img'
          class='blog-title-item-operation-icon'
          width='12px'
          height='12px'
          preserveAspectRatio='xMidYMid meet'
          viewBox='0 0 24 24'
          data-icon='mdi:folder-outline'
          style={{ cursor: 'pointer' }}
          onClick={handleCategoryClick}
        >
          <path
            fill='currentColor'
            d='M20 18H4V8h16m0-2h-8l-2-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z'
          ></path>
        </svg>
        <span
          className='blog-title-item-operation-span'
          onClick={handleCategoryClick}
          style={{ cursor: 'pointer' }}
        >
          {categoryName}
        </span>

        <svg
          aria-hidden='true'
          role='img'
          class='blog-title-item-operation-icon'
          width='12px'
          height='12px'
          preserveAspectRatio='xMidYMid meet'
          viewBox='0 0 24 24'
          data-icon='mdi:tag'
        >
          <path
            fill='currentColor'
            d='M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59c.55 0 1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42Z'
          ></path>
        </svg>
        {((tags && JSON.parse(tags)) || []).map(tag => (
          <span
            className='blog-title-item-operation-tag'
            key={tag.id}
            onClick={() => handleTagClick(tag.id, tag.name)}
            style={{ cursor: 'pointer' }}
          >
            #{tag.name}
          </span>
        ))}
      </div>
    </div>
  )
}
