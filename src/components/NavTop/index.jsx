import React from 'react'

import './index.less'

export default function NavTop({ title, number }) {
  return (
    <div className='nav-top'>
      <span className='nav-top-title'>{title}</span>
      <span className='nav-top-desc'>{number} 篇文章</span>
    </div>
  )
}
