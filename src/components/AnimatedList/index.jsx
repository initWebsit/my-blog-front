import React, { useLayoutEffect, useRef } from 'react'

import './index.less'

export default function AnimatedList({ items = [], renderItem, rootDomId }) {
  const listRef = useRef({})
  const rootRef = useRef()
  const observerRef = useRef()

  const setListRef = (ref, key) => {
    if (!ref) {
      delete listRef.current[key]
      return false
    }
    listRef.current[key] = ref
  }

  useLayoutEffect(() => {
    rootRef.current = rootDomId ? document.getElementById(rootDomId) : document.body
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(temp => {
          if (temp.isIntersecting) {
            if (temp.target.classList.contains('enter-in')) return false
            temp.target.classList.add('enter-in')
            observerRef.current.unobserve(temp.target)
          }
        })
      },
      {
        root: rootRef.current,
        rootMargin: '0px',
        threshold: 0,
      }
    )

    for (let key in listRef.current) {
      if (listRef.current[key] && listRef.current.hasOwnProperty(key))
        observerRef.current.observe(listRef.current[key])
    }

    return () => {
      for (let key in listRef.current) {
        if (listRef.current[key] && listRef.current.hasOwnProperty(key))
          // eslint-disable-next-line react-hooks/exhaustive-deps
          observerRef.current.unobserve(listRef.current[key])
      }
      observerRef.current.disconnect()
      observerRef.current = null
      rootRef.current = null
    }
  }, [items, rootDomId])

  return (
    <>
      {items.map((item, index) => (
        <section key={item.id} ref={ref => setListRef(ref, item.id)}>
          {renderItem(item, index)}
        </section>
      ))}
    </>
  )
}
