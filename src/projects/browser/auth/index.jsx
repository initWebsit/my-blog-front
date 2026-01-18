import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Toast } from '@/library/ui'
import { login, register, sendCode } from '@/network'
import { setUserInfo } from '@/store/app'

import './index.less'

// 滑块验证组件
const SliderVerify = ({ onVerify, disabled }) => {
  const [sliderLeft, setSliderLeft] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const sliderRef = useRef(null)
  const trackRef = useRef(null)
  const startXRef = useRef(0)
  const maxLeftRef = useRef(0)
  const isDraggingRef = useRef(false)
  const sliderWidth = 40 // 滑块宽度

  // 计算最大滑动距离
  useEffect(() => {
    const updateMaxLeft = () => {
      if (trackRef.current && sliderRef.current) {
        const trackWidth = trackRef.current.offsetWidth
        maxLeftRef.current = trackWidth - sliderWidth
      }
    }
    updateMaxLeft()
    window.addEventListener('resize', updateMaxLeft)
    return () => {
      window.removeEventListener('resize', updateMaxLeft)
    }
  }, [])

  const checkVerify = useCallback(() => {
    // 验证是否滑动到最右端（允许3px误差）
    setSliderLeft(currentLeft => {
      if (currentLeft >= maxLeftRef.current - 3) {
        setIsVerified(true)
        onVerify && onVerify(true)
        return currentLeft
      } else {
        // 验证失败，重置
        onVerify && onVerify(false)
        return 0
      }
    })
  }, [onVerify])

  // 使用ref存储事件处理函数，避免依赖问题
  const handlersRef = useRef({})

  const handleMouseMove = useCallback(e => {
    if (!isDraggingRef.current) return
    e.preventDefault()
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const newLeft = Math.max(
      0,
      Math.min(maxLeftRef.current, e.clientX - rect.left - startXRef.current)
    )
    setSliderLeft(newLeft)
  }, [])

  const handleTouchMove = useCallback(e => {
    if (!isDraggingRef.current) return
    e.preventDefault()
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const newLeft = Math.max(
      0,
      Math.min(maxLeftRef.current, e.touches[0].clientX - rect.left - startXRef.current)
    )
    setSliderLeft(newLeft)
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = '' // 恢复文本选择
    checkVerify()
  }, [handleMouseMove, checkVerify])

  const handleTouchUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchUp)
    checkVerify()
  }, [handleTouchMove, checkVerify])

  // 更新ref
  handlersRef.current = {
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchUp,
  }

  const handleMouseDown = useCallback(
    e => {
      if (disabled || isVerified) return
      e.preventDefault()
      e.stopPropagation()
      isDraggingRef.current = true
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      setSliderLeft(currentLeft => {
        startXRef.current = e.clientX - currentLeft - rect.left
        return currentLeft
      })
      document.addEventListener('mousemove', handlersRef.current.handleMouseMove)
      document.addEventListener('mouseup', handlersRef.current.handleMouseUp)
      document.body.style.userSelect = 'none' // 防止拖拽时选中文本
    },
    [disabled, isVerified]
  )

  const handleTouchStart = useCallback(
    e => {
      if (disabled || isVerified) return
      e.preventDefault()
      e.stopPropagation()
      isDraggingRef.current = true
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      setSliderLeft(currentLeft => {
        startXRef.current = e.touches[0].clientX - currentLeft - rect.left
        return currentLeft
      })
      document.addEventListener('touchmove', handlersRef.current.handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', handlersRef.current.handleTouchUp)
    },
    [disabled, isVerified]
  )

  const reset = () => {
    setSliderLeft(0)
    setIsVerified(false)
    isDraggingRef.current = false
    document.body.style.userSelect = ''
  }

  useEffect(() => {
    if (disabled) {
      reset()
    }
    // 清理事件监听器
    return () => {
      document.removeEventListener('mousemove', handlersRef.current.handleMouseMove)
      document.removeEventListener('mouseup', handlersRef.current.handleMouseUp)
      document.removeEventListener('touchmove', handlersRef.current.handleTouchMove)
      document.removeEventListener('touchend', handlersRef.current.handleTouchUp)
      document.body.style.userSelect = ''
    }
  }, [disabled])

  const verifyText = isVerified ? '验证通过' : '请拖动滑块完成验证'

  return (
    <div className='slider-verify'>
      <div className='slider-verify-track' ref={trackRef}>
        <div
          className='slider-verify-bg'
          style={{ width: sliderLeft > 0 ? `${sliderLeft + sliderWidth - 3}px` : '0px' }}
        >
          <span className='slider-verify-bg-text'>{verifyText}</span>
        </div>
        <div className='slider-verify-text'>{verifyText}</div>
        <div
          className='slider-verify-slider'
          ref={sliderRef}
          style={{ left: `${sliderLeft}px` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M10 2L12.09 7.26L18 8.27L14 12.14L14.82 18.02L10 15.77L5.18 18.02L6 12.14L2 8.27L7.91 7.26L10 2Z'
              fill={isVerified ? '#52c41a' : '#999'}
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

function Auth() {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('login') // 'login' or 'register'
  const navigate = useNavigate()
  const [sendCodeLoading, setSendCodeLoading] = useState(false)
  // 登录表单
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  // 注册表单
  const [registerForm, setRegisterForm] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    verifyCode: '',
  })

  const [sliderVerified, setSliderVerified] = useState(false)
  const [codeCountdown, setCodeCountdown] = useState(0)
  const [errors, setErrors] = useState({})

  // 发送验证码
  const handleSendCode = async () => {
    if (sendCodeLoading) return
    if (!sliderVerified) {
      setErrors({ ...errors, verifyCode: '请先完成滑块验证' })
      return
    }

    if (!registerForm.email) {
      setErrors({ ...errors, email: '请输入邮箱' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerForm.email)) {
      setErrors({ ...errors, email: '请输入有效的邮箱地址' })
      return
    }

    // 这里调用发送验证码的API
    try {
      setSendCodeLoading(true)
      const res = await sendCode({ email: registerForm.email })
      setSendCodeLoading(false)
      if (res.code === 200) {
        Toast.success(res?.message || '发送验证码成功, 请注意查收')
        setErrors({ ...errors, verifyCode: '' })
        // 开始倒计时
        setCodeCountdown(60)
        const timer = setInterval(() => {
          setCodeCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setErrors({ ...errors, verifyCode: res.message })
      }
    } catch (error) {
      console.error('发送验证码失败:', error)
      setErrors({ ...errors, verifyCode: '发送验证码失败，请重试' })
    }
  }

  // 处理登录
  const handleLogin = async e => {
    e.preventDefault()
    const newErrors = {}

    if (!loginForm.email) {
      newErrors.email = '请输入邮箱'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(loginForm.email)) {
        newErrors.email = '请输入有效的邮箱地址'
      }
    }

    if (!loginForm.password) {
      newErrors.password = '请输入密码'
    } else if (loginForm.password.length < 6) {
      newErrors.password = '密码长度至少6位'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 这里调用登录API
    try {
      Toast.loading({ maskClickable: false })
      const res = await login(loginForm)
      Toast.clear()
      if (res.code === 200) {
        setErrors({ ...errors, submit: '' })
        Toast.success(res?.message || '登录成功')
        dispatch(setUserInfo(res.data))
        if (window.location.search.includes('redirect_url=')) {
          window.location.replace(
            decodeURIComponent(window.location.search.replace('?redirect_url=', ''))
          )
        } else {
          navigate('/home', { replace: true })
        }
      } else {
        setErrors({ ...errors, submit: res.message })
      }
    } catch (error) {
      console.error('登录失败:', error)
      setErrors({ ...errors, submit: '登录失败，请检查邮箱和密码' })
    }
  }

  // 处理注册
  const handleRegister = async e => {
    e.preventDefault()
    const newErrors = {}

    if (!registerForm.nickname) {
      newErrors.nickname = '请输入昵称'
    }

    if (!registerForm.email) {
      newErrors.email = '请输入邮箱'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(registerForm.email)) {
        newErrors.email = '请输入有效的邮箱地址'
      }
    }

    if (!registerForm.password) {
      newErrors.password = '请输入密码'
    } else if (registerForm.password.length < 6) {
      newErrors.password = '密码长度至少6位'
    }

    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    if (!sliderVerified) {
      newErrors.slider = '请完成滑块验证'
    }

    if (!registerForm.verifyCode) {
      newErrors.verifyCode = '请输入验证码'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 这里调用注册API
    try {
      Toast.loading({ maskClickable: false })
      const res = await register(registerForm)
      Toast.clear()
      if (res.code === 200) {
        setErrors({ ...errors, submit: '' })
        Toast.success(res?.message || '注册成功')
        setActiveTab('login')
      } else {
        setErrors({ ...errors, submit: res.message })
      }
    } catch (error) {
      setErrors({ ...errors, submit: '注册失败，请重试' })
    }
  }

  const updateLoginForm = (field, value) => {
    setLoginForm({ ...loginForm, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const updateRegisterForm = (field, value) => {
    setRegisterForm({ ...registerForm, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <div className='auth-header'>
          <h1 className='auth-title'>欢迎</h1>
          <p className='auth-subtitle'>登录或注册以继续</p>
        </div>

        <div className='auth-tabs'>
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login')
              setErrors({})
              setSliderVerified(false)
            }}
          >
            登录
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register')
              setErrors({})
              setSliderVerified(false)
            }}
          >
            注册
          </button>
        </div>

        <div className='auth-content'>
          {activeTab === 'login' ? (
            <form className='auth-form' onSubmit={handleLogin}>
              <div className='form-group'>
                <label className='form-label'>邮箱</label>
                <input
                  type='email'
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder='请输入邮箱'
                  value={loginForm.email}
                  onChange={e => updateLoginForm('email', e.target.value)}
                />
                {errors.email && <div className='form-error'>{errors.email}</div>}
              </div>

              <div className='form-group'>
                <label className='form-label'>密码</label>
                <input
                  type='password'
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder='请输入密码'
                  value={loginForm.password}
                  onChange={e => updateLoginForm('password', e.target.value)}
                />
                {errors.password && <div className='form-error'>{errors.password}</div>}
              </div>

              {errors.submit && <div className='form-error form-error-submit'>{errors.submit}</div>}

              <button type='submit' className='auth-button auth-button-primary'>
                登录
              </button>
            </form>
          ) : (
            <form className='auth-form' onSubmit={handleRegister}>
              <div className='form-group'>
                <label className='form-label'>昵称</label>
                <input
                  type='text'
                  className={`form-input ${errors.nickname ? 'error' : ''}`}
                  placeholder='请输入昵称'
                  value={registerForm.nickname}
                  maxLength={20}
                  onChange={e => updateRegisterForm('nickname', e.target.value)}
                />
                {errors.nickname && <div className='form-error'>{errors.nickname}</div>}
              </div>

              <div className='form-group'>
                <label className='form-label'>邮箱</label>
                <input
                  type='email'
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder='请输入邮箱'
                  value={registerForm.email}
                  maxLength={100}
                  onChange={e => updateRegisterForm('email', e.target.value)}
                />
                {errors.email && <div className='form-error'>{errors.email}</div>}
              </div>

              <div className='form-group'>
                <label className='form-label'>密码</label>
                <input
                  type='password'
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder='请输入密码（至少6位）'
                  value={registerForm.password}
                  maxLength={20}
                  onChange={e => updateRegisterForm('password', e.target.value)}
                />
                {errors.password && <div className='form-error'>{errors.password}</div>}
              </div>

              <div className='form-group'>
                <label className='form-label'>确认密码</label>
                <input
                  type='password'
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder='请再次输入密码'
                  value={registerForm.confirmPassword}
                  maxLength={20}
                  onChange={e => updateRegisterForm('confirmPassword', e.target.value)}
                />
                {errors.confirmPassword && (
                  <div className='form-error'>{errors.confirmPassword}</div>
                )}
              </div>

              <div className='form-group'>
                <label className='form-label'>滑块验证</label>
                <SliderVerify
                  onVerify={verified => {
                    setSliderVerified(verified)
                    if (verified && errors.slider) {
                      setErrors({ ...errors, slider: '' })
                    }
                  }}
                  disabled={false}
                />
                {errors.slider && <div className='form-error'>{errors.slider}</div>}
              </div>

              <div className='form-group'>
                <label className='form-label'>验证码</label>
                <div className='form-verify-code'>
                  <input
                    type='text'
                    className={`form-input form-input-code ${errors.verifyCode ? 'error' : ''}`}
                    placeholder='请输入验证码'
                    value={registerForm.verifyCode}
                    onChange={e => updateRegisterForm('verifyCode', e.target.value)}
                    maxLength={6}
                  />
                  <button
                    type='button'
                    className='auth-button auth-button-code'
                    onClick={handleSendCode}
                    disabled={!sliderVerified || codeCountdown > 0}
                  >
                    {codeCountdown > 0 ? `${codeCountdown}秒` : '发送验证码'}
                  </button>
                </div>
                {errors.verifyCode && <div className='form-error'>{errors.verifyCode}</div>}
              </div>

              {errors.submit && <div className='form-error form-error-submit'>{errors.submit}</div>}

              <button type='submit' className='auth-button auth-button-primary'>
                注册
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth
