import React from 'react'

import Avatar from './Avatar'

import './LeftMenu.less'

function LeftMenu({ containerClassName }) {
  return (
    <div className={`left-menu ${containerClassName}`}>
      <Avatar />
      <div className='left-menu-footer'>
        <a target='_blank' href='#' className='left-menu-footer-words'>
          宁可错误的乐观，也不要正确的悲观。保持一颗勇敢的心。
        </a>
        <a target='_blank' href='#' className='left-menu-footer-links'>
          回忆时刻
        </a>
        <a target='_blank' href='http://beian.miit.gov.cn' className='left-menu-footer-domain'>
          苏ICP备20027520号-1
        </a>
      </div>
    </div>
  )
}

export default LeftMenu
