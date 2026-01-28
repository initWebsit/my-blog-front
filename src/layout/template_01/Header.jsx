import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import AvatarIcon from '@/assets/avatar.png'
import BlogList from '@/components/BlogList'
import SearchModal from '@/components/SearchModal'
import { Toast } from '@/library/ui'
import { getBlogList, getTags } from '@/network'

import './Header.less'

function Header() {
  const navMenu = useSelector(state => state.app.navMenu)
  const pageCfg = useSelector(state => state.app.pageCfg)
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [blogList, setBlogList] = useState([])
  const [loading, setLoading] = useState(false)

  const getTagsFunc = async () => {
    const res = await getTags({ getBlogNum: true })
    setTags(res.data || [])
  }

  const handleSearch = value => {
    setSearchValue(value)
  }

  const handleTagClick = tag => {
    navigate(`/tagList?tagId=${tag.id}&tagName=${tag.name}`)
    setSearchModalVisible(false)
  }

  const getBlogListFunc = async () => {
    if (!searchValue?.trim() || loading) return
    setLoading(true)
    Toast.loading({ maskClickable: false })
    const res = await getBlogList({
      page: 1,
      pageSize: 10,
      keyword: searchValue,
    })
    Toast.clear()
    setLoading(false)
    if (!res?.data) return
    setBlogList(res.data?.list || [])
  }

  useEffect(() => {
    getBlogListFunc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  useEffect(() => {
    getTagsFunc()
  }, [])

  return (
    <div className='header'>
      <div className='header-left'>
        {navMenu.map(item => (
          <div
            className={
              'header-left-item ' + (pageCfg.path === item.path ? 'header-left-item-active' : '')
            }
            onClick={() => navigate(item.path)}
            key={item.path}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className='header-right'>
        <div className='header-right-search' onClick={() => setSearchModalVisible(true)}>
          <svg
            aria-hidden='true'
            role='img'
            className='header-right-search-icon'
            width='16px'
            height='16px'
            preserveAspectRatio='xMidYMid meet'
            viewBox='0 0 24 24'
            data-icon='mdi:text-box-search'
          >
            <path
              fill='currentColor'
              d='M15.5 12c2.5 0 4.5 2 4.5 4.5c0 .88-.25 1.71-.69 2.4l3.08 3.1L21 23.39l-3.12-3.07c-.69.43-1.51.68-2.38.68c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5m0 2a2.5 2.5 0 0 0-2.5 2.5a2.5 2.5 0 0 0 2.5 2.5a2.5 2.5 0 0 0 2.5-2.5a2.5 2.5 0 0 0-2.5-2.5M7 15v2h2c.14 1.55.8 2.94 1.81 4H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2h14a2 2 0 0 1 2 2v8.03A6.492 6.492 0 0 0 15.5 10c-1.27 0-2.46.37-3.46 1H7v2h3c-.36.6-.66 1.28-.83 2H7m10-6V7H7v2h10Z'
            ></path>
          </svg>
        </div>
        <div className='header-right-avatar'>
          <img
            src={AvatarIcon}
            alt='avatar'
            className='header-right-avatar-img'
          />
        </div>
      </div>

      <SearchModal
        visible={searchModalVisible}
        tags={tags}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        onTagClick={handleTagClick}
      >
        <div className='header-right-search-modal-content'>
          {blogList.map((item, index) => (
            <BlogList
              key={index}
              item={item}
              handleClick={() => {
                setSearchModalVisible(false)
                navigate(`/blogDetail?id=${item.id}`)
              }}
              handleCategoryClick={() => {
                setSearchModalVisible(false)
                navigate(`/tagList?categoryId=${item.category}&categoryName=${item.category_name}`)
              }}
              handleTagClick={(tagIdTemp, tagNameTemp) => {
                setSearchModalVisible(false)
                navigate(`/tagList?tagId=${tagIdTemp}&tagName=${tagNameTemp}`)
              }}
            />
          ))}
        </div>
      </SearchModal>
    </div>
  )
}

export default Header
