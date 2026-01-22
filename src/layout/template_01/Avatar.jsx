import React from 'react'
import { useSelector } from 'react-redux'

import './Avatar.less'

function Avatar() {
  const { userInfo } = useSelector(state => state.app)

  return (
    <div className='avatar-content'>
      <div className='avatar-content-avatar'>
        <img
          src='https://i.ibb.co/qMr6ptmD/2026-01-14-160838-393.jpg'
          alt='avatar'
          className='avatar-content-avatar-img'
        />
      </div>
      <div className='avatar-content-name'>{userInfo?.nickname || 'Niu Niu'}</div>
      <div className='avatar-content-contact'>
        <a target='_blank' href='/index.html' title='RSS'>
          <svg
            aria-hidden='true'
            role='img'
            className='avatar-content-contact-icon'
            preserveAspectRatio='xMidYMid meet'
            viewBox='0 0 24 24'
            data-icon='mdi:rss'
          >
            <path
              fill='currentColor'
              d='M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z'
            ></path>
          </svg>
        </a>
        <a target='_blank' href={`mailto:${userInfo?.email || '695750870@qq.com'}`} title='Email'>
          <svg
            aria-hidden='true'
            role='img'
            className='avatar-content-contact-icon'
            preserveAspectRatio='xMidYMid meet'
            viewBox='0 0 24 24'
            data-icon='mdi:email'
          >
            <path
              fill='currentColor'
              d='m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z'
            ></path>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default Avatar
