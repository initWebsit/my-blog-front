import { get, post } from '@/library/ajax'

// 发送验证码
export const sendCode = params => post('/user/sendCode', params)

// 登录
export const login = params => post('/user/login', params)

// 注册
export const register = params => post('/user/register', params)

// 获取用户信息
export const getUserInfo = () => get('/user/getUserInfo', {}, { closeErrorTip: true })

// 发布博客
export const publishBlog = params => post('/blog/addBlog', params)

// 获取博客列表
export const getBlogList = params => get('/blog/getBlogList', params)

// 获取博客详情
export const getBlogDetail = params => get('/blog/getBlogDetail', params)

// 获取标签列表
export const getTags = params => post('/blog/getTags', params)

// 喜欢博客
export const likeBlog = params => post('/blog/likeBlog', params)

// 获取博客评论
export const getBlogComments = params => get('/blog/getComments', params)

// 发布博客评论
export const publishBlogComment = params => post('/blog/addComment', params)
