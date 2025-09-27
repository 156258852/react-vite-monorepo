import { createSlice } from '@reduxjs/toolkit';
import type { Post } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// 定义 PostsState 类型
export interface PostsState {
  posts: Post[];
  // 为不同的操作分离 loading 状态
  fetchLoading: boolean;
  createLoading: boolean;
  deleteLoading: boolean;
  // 为不同的操作分离 error 状态
  fetchError: string | null;
  createError: string | null;
  deleteError: string | null;
  currentPost: Post | null;
}

// 初始状态
const initialState: PostsState = {
  posts: [],
  fetchLoading: false,
  createLoading: false,
  deleteLoading: false,
  fetchError: null,
  createError: null,
  deleteError: null,
  currentPost: null,
};

// 创建 slice，只包含简单的 actions
export const postsSlice = createSlice({
  name: '@@app/posts',
  initialState,
  reducers: {
    // 获取所有文章 - 组件只调用这个
    fetchPosts: state => {
      state.fetchLoading = true;
      state.fetchError = null;
    },

    // 获取文章成功 - 由 saga 调用
    fetchPostsSuccess: (state, action) => {
      state.fetchLoading = false;
      state.posts = action.payload;
    },

    // 获取文章失败 - 由 saga 调用
    fetchPostsFailure: (state, action) => {
      state.fetchLoading = false;
      state.fetchError = action.payload;
    },

    // 创建文章 - 组件只调用这个
    createPost: state => {
      state.createLoading = true;
      state.createError = null;
    },

    // 创建文章成功 - 由 saga 调用
    createPostSuccess: (state, action) => {
      state.createLoading = false;
      state.posts.push(action.payload);
    },

    // 创建文章失败 - 由 saga 调用
    createPostFailure: (state, action) => {
      state.createLoading = false;
      state.createError = action.payload;
    },

    // 删除文章 - 组件只调用这个
    deletePost: state => {
      state.deleteLoading = true;
      state.deleteError = null;
    },

    // 删除文章成功 - 由 saga 调用
    deletePostSuccess: (state, action) => {
      state.deleteLoading = false;
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },

    // 删除文章失败 - 由 saga 调用
    deletePostFailure: (state, action) => {
      state.deleteLoading = false;
      state.deleteError = action.payload;
    },

    // 用于触发并行获取文章和相关数据的 action
    fetchPostsWithRelated: state => {
      state.fetchLoading = true;
      state.fetchError = null;
    },
  },
});

// 导出 actions
export const {
  fetchPosts,
  fetchPostsSuccess,
  fetchPostsFailure,
  createPost,
  createPostSuccess,
  createPostFailure,
  deletePost,
  deletePostSuccess,
  deletePostFailure,
  fetchPostsWithRelated,
} = postsSlice.actions;

console.log('🚀 >>> postsSlice', postsSlice);

// 导出 reducer
export default postsSlice.reducer;
