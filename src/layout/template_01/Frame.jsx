/*
 + ------------------------------------------------------------------
 | 桌面端 Frame 入口
 + ------------------------------------------------------------------ 
 */
import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from './Header'
import LeftMenu from './LeftMenu'

import './Frame.less'

function DesktopFrame() {
  return (
    <section className='layout-d-frame'>
      <LeftMenu />
      <section className='layout-d-frame-main'>
        <Header />
        <section className='layout-d-frame-main-content'>
          <LeftMenu containerClassName='left-menu-relative' />
          <Outlet />
        </section>
      </section>
    </section>
  )
}

export default DesktopFrame
