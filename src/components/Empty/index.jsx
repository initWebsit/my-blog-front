import React from 'react'

import './index.less'

function Empty({ text = '暂无数据', desc = '抱歉，没有找到相关内容' }) {
  return (
    <div className='empty'>
      <svg
        className='empty-icon'
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
      <div className='empty-text'>{text}</div>
      <div className='empty-desc'>{desc}</div>
    </div>
  )
}

export default Empty
