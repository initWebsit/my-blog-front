import React from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

import PublishBlog from '@/components/PublishBlog'

import './index.less'

function EditBlog() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  if (!id) {
    return <Navigate to='/blog' />
  
  }
  return (
    <PublishBlog isEdit blogId={id} />
  )
}

export default EditBlog