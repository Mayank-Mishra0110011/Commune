import { ADD_POST, POST_LOADING, GET_POSTS, DELETE_POST, GET_POST } from '../actions/types';

const initialState = {
	posts: [],
	post: {},
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_POST:
			return {
				...state,
				post: action.payload,
				loading: false
			};
		case DELETE_POST:
			let index;
			for (let i = 0; i < state.posts.length; i++) {
				if (state.posts[i]._id === action.payload._id) {
					index = i;
					break;
				}
			}
			let tempState = state.posts;
			tempState.splice(index, 1, action.payload.data);
			return {
				...state,
				posts: tempState
			};
		case GET_POSTS:
			return {
				...state,
				posts: action.payload,
				loading: false
			};
		case POST_LOADING:
			return {
				...state,
				loading: true
			};
		case ADD_POST:
			return {
				...state,
				posts: [ action.payload, ...state.posts ]
			};
		default:
			return state;
	}
}
