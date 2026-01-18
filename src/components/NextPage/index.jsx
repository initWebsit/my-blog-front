import React from 'react'

import './index.less'

function NextPage({ index = 1, total = 5, onNext }) {
  return (
    <div className='next-page'>
      <span className='next-page-index'>
        {index} / {total}
      </span>
      <div className='next-page-button' onClick={onNext}>
        下一页
      </div>
    </div>
  )
}

export default NextPage
