import Loadable from '@loadable/component'

export const defaultPageConfig = {
  auth: false, // 是否需要登录
  pcNavStatus: 0, // 0-非导航、1-显示、2-登录下显示、3-非登录下显示
  pageThemeD: 1, // 1-蓝色主题
  headerThemeD: 1, // 1-黑色实底主题、2-透明主题
  headerPadD: 1, // 0-不填充、1-填充
  footerStatusD: 1, // 0-不显示底部、1-显示底部
  h5NavStatus: 0, // 0-非导航、1-显示、2-登录下显示、3-非登录下显示
  pageThemeM: 1, // 1-蓝色主题
  headerThemeM: 1, // 1-蓝色底返回导航主题、2-黑色底返回导航主题、3-蓝底logo导航主题、4-黑底logo导航主题
  headerPadM: 1, // 0-不填充、1-填充
  headerRechage: 0, // 0-不显示、1-显示
}

export default [
  {
    title: '首页',
    platform: ['pc', 'h5'],
    default: true,
    path: 'home',
    component: Loadable(() => import('./home/index')),
    pageConfig: {
      pcNavStatus: 1,
      h5NavStatus: 1,
    },
  },
  {
    title: '博客',
    platform: ['pc', 'h5'],
    default: true,
    path: 'blog',
    component: Loadable(() => import('./blog/index')),
    pageConfig: {
      pcNavStatus: 1,
      h5NavStatus: 1,
    },
  },
  {
    title: '旅行',
    platform: ['pc', 'h5'],
    default: true,
    path: 'travel',
    component: Loadable(() => import('./travel/index')),
    pageConfig: {
      pcNavStatus: 1,
      h5NavStatus: 1,
    },
  },
  {
    title: '专栏',
    platform: ['pc', 'h5'],
    default: true,
    path: 'column',
    component: Loadable(() => import('./column/index')),
    pageConfig: {
      pcNavStatus: 1,
      h5NavStatus: 1,
      auth: true,
    },
  },
  {
    title: '发布',
    platform: ['pc', 'h5'],
    default: true,
    path: 'publish',
    component: Loadable(() => import('./publish/index')),
    pageConfig: {
      pcNavStatus: 1,
      h5NavStatus: 1,
      auth: true,
    },
  },
  {
    title: '博客详情',
    platform: ['pc', 'h5'],
    default: true,
    path: 'blogDetail',
    component: Loadable(() => import('./blogDetail/index')),
    pageConfig: {
      pcNavStatus: 0,
      h5NavStatus: 0,
    },
  },
  {
    title: '标签列表',
    platform: ['pc', 'h5'],
    default: true,
    path: 'tagList',
    component: Loadable(() => import('./tagList/index')),
    pageConfig: {
      pcNavStatus: 0,
      h5NavStatus: 0,
    },
  },
  // {
  //     title: 'About Us',
  //     platform: ['pc', 'h5'],
  //     default: true,
  //     path: 'about',
  //     component: $q.is.desktop ? Loadable(() => import('./about/index')) : Loadable(() => import('./about/indexMobile')),
  //     pageConfig: {
  //         pcNavStatus: 1,
  //         h5NavStatus: 1,
  //         headerThemeM: 4
  //     }
  // },
  // {
  //     title: 'Technology',
  //     platform: ['pc', 'h5'],
  //     path: 'technology',
  //     component: Loadable(() => import('./technology')),
  //     pageConfig: {
  //         pcNavStatus: 1,
  //         h5NavStatus: 1,
  //         headerThemeM: 4
  //     }
  // },
  // {
  //     title: 'Trust and Safety',
  //     platform: ['pc', 'h5'],
  //     path: 'safety',
  //     component: Loadable(() => import('./safety')),
  //     pageConfig: {
  //         pcNavStatus: 1,
  //         h5NavStatus: 1,
  //         headerThemeM: 4
  //     }
  // },
  // {
  //     title: 'Join Us',
  //     platform: ['pc', 'h5'],
  //     path: 'join',
  //     component: Loadable(() => import('./join')),
  //     pageConfig: {
  //         pcNavStatus: 1,
  //         h5NavStatus: 1,
  //         headerThemeM: 4
  //     }
  // },
  // {
  //     title: 'User Agreement',
  //     platform: ['pc', 'h5'],
  //     path: 'agreement',
  //     component: Loadable(() => import('./agreement')),
  //     pageConfig: {
  //         headerThemeM: 2
  //     }
  // },
  // {
  //     title: 'Privacy Policy',
  //     platform: ['pc', 'h5'],
  //     path: 'privacy',
  //     component: Loadable(() => import('./privacy')),
  //     pageConfig: {
  //         headerThemeM: 2
  //     }
  // }
]
