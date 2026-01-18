import React from 'react'

import './index.less'

export default function PreNextBlog({ havePre, haveNext, onPre, onNext }) {
  if (!havePre && !haveNext) return null
  return (
    <div className='pre-next-container'>
      {havePre ? (
        <span className='pre-next-container-pre' onClick={onPre}>
          上一篇
        </span>
      ) : (
        <div className='pre-next-container-pre-empty'></div>
      )}
      {haveNext ? (
        <span className='pre-next-container-next' onClick={onNext}>
          下一篇
        </span>
      ) : (
        <div className='pre-next-container-next-empty'></div>
      )}
    </div>
  )
}
