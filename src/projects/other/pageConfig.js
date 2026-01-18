import Loadable from '@loadable/component'

export default [
  {
    title: '登录注册',
    platform: ['pc', 'h5'],
    path: 'login',
    component: Loadable(() => import('@browser/auth/index')),
    pageConfig: {
      pcNavStatus: 0,
      h5NavStatus: 0,
    },
  },
]
