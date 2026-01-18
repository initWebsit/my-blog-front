import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'

import { CloseSvg } from '@/library/icons'
import Mask from '@/library/ui/components/mask'
import { renderToContainer } from '@/library/ui/utils/render-to-container'
import { useInitialized } from '@/library/ui/utils/use-initialized'

import './index.less'

const classPrefix = 'b-search-modal'

const defaultProps = {
  visible: false,
  title: '搜索',
  placeholder: '输入关键字搜索',
  tags: [],
  onClose: () => {},
  onSearch: () => {},
  onTagClick: () => {},
  getContainer: () => document.body,
  maskClosable: true,
}

const SearchModal = p => {
  const props = { ...defaultProps, ...p }

  const [hidden, setHidden] = useState(!props.visible)
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (props.visible) {
      setHidden(false)
      // 聚焦输入框
      setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
    }
  }, [props.visible])

  const afterClose = () => {
    setHidden(true)
    setSearchValue('')
    props.afterClose?.()
  }

  const handleClose = () => {
    props.onClose()
  }

  const handleMaskClick = () => {
    if (props.maskClosable) {
      handleClose()
    }
  }

  const handleSearch = e => {
    if (e.key === 'Enter' || e.type === 'click') {
      props.onSearch(searchValue)
    }
  }

  const handleTagClick = tag => {
    props.onTagClick(tag)
  }

  const cls = classNames(classPrefix, {
    [`${classPrefix}-hidden`]: hidden,
  })

  const bodyCls = classNames(`${classPrefix}-body`, {
    [`${classPrefix}-body-hidden`]: !props.visible,
  })

  const initialized = useInitialized(props.visible || props.forceRender)

  const node = (
    <div className={cls} style={props.style}>
      <Mask
        visible={props.visible}
        onMaskClick={handleMaskClick}
        className={props.maskClassName}
        style={props.maskStyle}
        disableBodyScroll={false}
      />
      <CSSTransition
        classNames={`${classPrefix}-body`}
        in={props.visible}
        timeout={200}
        onEntered={props.afterShow}
        onExited={afterClose}
        unmountOnExit={props.destroyOnClose}
      >
        <div className={bodyCls} style={props.bodyStyle}>
          {initialized && (
            <div className={`${classPrefix}-content`} onClick={e => e.stopPropagation()}>
              {/* 头部 */}
              <div className={`${classPrefix}-header`}>
                <h3 className={`${classPrefix}-title`}>{props.title}</h3>
                <button className={`${classPrefix}-close`} onClick={handleClose} aria-label='关闭'>
                  <CloseSvg />
                </button>
              </div>

              {/* 搜索输入框 */}
              <div className={`${classPrefix}-input-wrapper`}>
                <input
                  ref={inputRef}
                  type='text'
                  className={`${classPrefix}-input`}
                  placeholder={props.placeholder}
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyPress={handleSearch}
                />
                <button
                  className={`${classPrefix}-search-btn`}
                  onClick={handleSearch}
                  aria-label='搜索'
                >
                  搜索
                </button>
              </div>

              {/* 标签列表 */}
              {props.tags && props.tags.length > 0 && (
                <div className={`${classPrefix}-tags`}>
                  <div className={`${classPrefix}-tags-title`}>
                    <svg
                      role='img'
                      className={`${classPrefix}-tags-title-icon`}
                      width='20px'
                      height='20px'
                      preserveAspectRatio='xMidYMid meet'
                      viewBox='0 0 24 24'
                      data-icon='mdi:tag'
                    >
                      <path
                        fill='currentColor'
                        d='M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59c.55 0 1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42Z'
                      ></path>
                    </svg>
                    <span className={`${classPrefix}-tags-title-text`}>标签</span>
                  </div>
                  <div className={`${classPrefix}-tags-list`}>
                    {props.tags.map((tag, index) => (
                      <span
                        key={tag.id || index}
                        className={`${classPrefix}-tag`}
                        onClick={() => handleTagClick(tag)}
                      >
                        #{tag.name || tag}
                        {tag.count !== undefined && ` (${tag.count})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 自定义内容 */}
              {props.children}
            </div>
          )}
        </div>
      </CSSTransition>
    </div>
  )

  return renderToContainer(props.getContainer, node)
}

export default SearchModal
