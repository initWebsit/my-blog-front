import React from 'react'

import './index.less'

function Loading({ text = '加载中...', isAbsolute = false }) {
  return (
    <div className={`loading ${isAbsolute ? 'loading-absolute' : ''}`}>
      <div className='loading-spinner'></div>
      <div className='loading-text'>{text}</div>
    </div>
  )
}

export default Loading
