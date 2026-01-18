import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { jumpLoginPage } from '@/store/app'

import './Content.less'

function DesktopContent({ children }) {
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.app.userInfo)
  const pageCfg = useSelector(state => state.app.pageCfg)

  if (pageCfg.auth && !userInfo?.id) {
    dispatch(jumpLoginPage())
    return null
  }

  return <div className='layout-d-content'>{children}</div>
}

export default DesktopContent
