import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Toast } from '@/library/ui'
import { editInfo, uploadImage } from '@/network'
import { jumpLoginPage } from '@/store/app'

import './index.less'

const EditInfo = () => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.app)
  const [submitForm, setSubmitForm] = useState({
    nickname: userInfo?.userInfo,
    avatar: userInfo?.avatar,
    email: userInfo?.email,
  })

  const [errors, setErrors] = useState({})

  const updateSubmitForm = (field, value) => {
    setSubmitForm({ ...submitForm, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const onUploadImage = async file => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await uploadImage(formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res?.data?.url
  }

  const handleAvatarChange = async e => {
    const file = e.target.files[0]
    if (file) {
      let url = await onUploadImage(file)
      if (!url) return
      setSubmitForm({ ...submitForm, avatar: url })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!userInfo?.id) return dispatch(jumpLoginPage())

    e.preventDefault()
    const newErrors = {}

    if (!submitForm.nickname) {
      newErrors.nickname = '请输入昵称'
    }

    if (!submitForm.avatar) {
      newErrors.avatar = '请上传头像'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 这里调用注册API
    try {
      Toast.loading({ maskClickable: false })
      const res = await editInfo(submitForm)
      Toast.clear()
      if (res.code === 200) {
        setErrors({ ...errors, submit: '' })
        Toast.success(res?.message || '修改成功')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        setErrors({ ...errors, submit: res.message })
      }
    } catch (error) {
      setErrors({ ...errors, submit: '修改失败，请重试' })
    }
  }

  useEffect(() => {
    setSubmitForm({
      nickname: userInfo?.nickname,
      avatar: userInfo?.avatar,
      email: userInfo?.email,
    })
  }, [userInfo])

  return (
    <div className='auth-content'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label className='form-label'>昵称</label>
          <input
            type='text'
            className={`form-input ${errors.nickname ? 'error' : ''}`}
            placeholder='请输入昵称'
            value={submitForm.nickname}
            maxLength={20}
            onChange={e => updateSubmitForm('nickname', e.target.value)}
          />
          {errors.nickname && <div className='form-error'>{errors.nickname}</div>}
        </div>

        <div className='form-group'>
          <label className='form-label'>头像</label>
          <div className='form-avatar'>
            {submitForm.avatar ? (
              <div className='form-avatar-upload-preview'>
                <img
                  className='form-avatar-upload-preview-img'
                  src={submitForm.avatar}
                  alt='头像'
                />
                <span
                  className='form-avatar-upload-preview-icon'
                  onClick={() => updateSubmitForm('avatar', '')}
                >
                  X
                </span>
              </div>
            ) : (
              <div className='form-avatar-upload'>
                <input
                  id='avatar'
                  className='form-avatar-input'
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarChange}
                />
                <div
                  className='form-avatar-upload-icon'
                  onClick={() => document.getElementById('avatar').click()}
                >
                  <span>点击上传头像</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='form-group'>
          <label className='form-label'>邮箱</label>
          <input
            disabled
            style={{ background: 'rgba(239, 239, 239, 0.3)' }}
            type='email'
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder='请输入邮箱'
            value={submitForm.email}
            maxLength={100}
            onChange={e => updateSubmitForm('email', e.target.value)}
          />
          {errors.email && <div className='form-error'>{errors.email}</div>}
        </div>

        {errors.submit && <div className='form-error form-error-submit'>{errors.submit}</div>}

        <button type='submit' className='auth-button auth-button-primary'>
          提交
        </button>
      </form>
    </div>
  )
}

export default EditInfo
