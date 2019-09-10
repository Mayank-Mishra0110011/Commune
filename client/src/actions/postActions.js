import axios from 'axios';
import { ADD_POST, GET_ERRORS, POST_LOADING, GET_POSTS, DELETE_POST, GET_POST } from './types';

export const addPost = (postData) => (dispatch) => {
	axios
		.post('/api/posts', postData)
		.then((res) =>
			dispatch({
				type: ADD_POST,
				payload: res.data
			})
		)
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

export const deletePost = (id) => (dispatch) => {
	axios
		.delete(`api/posts/${id}`)
		.then((res) => {
			dispatch({
				type: DELETE_POST,
				payload: {
					data: res.data,
					_id: id
				}
			});
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

export const upvote = (id) => (dispatch) => {
	axios
		.post(`api/posts/upvote/${id}`)
		.then(() => {
			dispatch(getPosts());
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

export const upvoteComment = (postId, commentId) => (dispatch) => {
	axios
		.post(`/api/posts/comment/upvote/${postId}/${commentId}`)
		.then((res) => {
			dispatch({
				type: GET_POST,
				payload: res.data
			});
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

export const downvote = (id) => (dispatch) => {
	axios
		.post(`api/posts/downvote/${id}`)
		.then(() => {
			dispatch(getPosts());
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

export const downvoteComment = (postId, commentId) => (dispatch) => {
	axios
		.post(`/api/posts/comment/downvote/${postId}/${commentId}`)
		.then((res) => {
			dispatch({
				type: GET_POST,
				payload: res.data
			});
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

export const getPosts = () => (dispatch) => {
	dispatch(setPostLoading());
	axios
		.get('/api/posts')
		.then((res) =>
			dispatch({
				type: GET_POSTS,
				payload: res.data
			})
		)
		.catch(() =>
			dispatch({
				type: GET_POSTS,
				payload: null
			})
		);
};

export const getPost = (id) => (dispatch) => {
	dispatch(setPostLoading());
	axios
		.get(`/api/posts/${id}`)
		.then((res) => {
			dispatch({
				type: GET_POST,
				payload: res.data
			});
		})
		.catch(() =>
			dispatch({
				type: GET_POST,
				payload: null
			})
		);
};

export const addComment = (postId, comment) => (dispatch) => {
	axios
		.post(`/api/posts/comment/${postId}`, comment)
		.then((res) =>
			dispatch({
				type: GET_POST,
				payload: res.data
			})
		)
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

export const deleteComment = (postId, commentId) => (dispatch) => {
	axios
		.delete(`/api/posts/comment/${postId}/${commentId}`)
		.then((res) =>
			dispatch({
				type: GET_POST,
				payload: res.data
			})
		)
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

export const setPostLoading = () => {
	return {
		type: POST_LOADING
	};
};
