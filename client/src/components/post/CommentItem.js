import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteComment, upvoteComment, downvoteComment } from '../../actions/postActions';

class CommentItem extends Component {
	onUpvoteClick(post_id, comment_id) {
		this.props.upvoteComment(post_id, comment_id);
	}
	onDownvoteClick(post_id, comment_id) {
		this.props.downvoteComment(post_id, comment_id);
	}
	findUserUpvote(upvotes) {
		const { auth } = this.props;
		if (upvotes.filter((upvote) => upvote.user === auth.user.id).length > 0) {
			return true;
		} else {
			return false;
		}
	}
	findUserDownvote(downvotes) {
		const { auth } = this.props;
		if (downvotes.filter((downvote) => downvote.user === auth.user.id).length > 0) {
			return true;
		} else {
			return false;
		}
	}
	mouseEnterDownvote(e) {
		if (e.target.tagName === 'BUTTON') {
			e.target.style.fill = '#7193FF';
		}
	}
	mouseEnter(e) {
		if (e.target.tagName === 'BUTTON') {
			e.target.style.fill = '#FF4500';
		}
	}
	mouseLeave(voted, e) {
		if (!voted) {
			if (e.target.tagName === 'path') {
				e.target.parentElement.parentElement.style.fill = 'black';
			} else if (e.target.tagName === 'svg') {
				e.target.parentElement.style.fill = 'black';
			} else {
				e.target.style.fill = 'black';
			}
		}
	}
	onDeleteClick(postId, commentId) {
		this.props.deleteComment(postId, commentId);
	}
	render() {
		const { comment, postId, auth } = this.props;
		return (
			<div className="card card-body mb-3">
				<div className="row">
					<div className="col-md-2">
						<a href="profile.html">
							<img className="rounded-circle d-none d-md-block" src={comment.avatar} alt="" />
						</a>
						<br />
						<p className="text-center">{comment.name}</p>
					</div>
					<div className="col-md-10">
						<p className="lead">{comment.comment}</p>
						<button
							type="button"
							className="btn btn-sm btn-light mr-1"
							style={this.findUserUpvote(comment.upvotes) ? { fill: '#FF4500' } : { fill: 'black' }}
							onMouseEnter={this.mouseEnter}
							onMouseLeave={this.mouseLeave.bind(this, this.findUserUpvote(comment.upvotes))}
							onClick={this.onUpvoteClick.bind(this, postId, comment._id)}
						>
							<svg
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="15"
								viewBox="0 0 32 32"
							>
								<path d="M16 1l-15 15h9v16h12v-16h9z" />
							</svg>
						</button>
						<span className="badge badge-light">{comment.upvotes.length - comment.downvotes.length}</span>
						<button
							type="button"
							className="btn btn-sm btn-light mr-3 ml-1"
							onMouseEnter={this.mouseEnterDownvote}
							onMouseLeave={this.mouseLeave.bind(this, this.findUserDownvote(comment.downvotes))}
							onClick={this.onDownvoteClick.bind(this, postId, comment._id)}
							style={this.findUserDownvote(comment.downvotes) ? { fill: '#7193FF' } : { fill: 'black' }}
						>
							<svg
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="15"
								viewBox="0 0 32 32"
							>
								<path d="M16 31l15-15h-9v-16h-12v16h-9z" />
							</svg>
						</button>
						{comment.user === auth.user.id ? (
							<button
								onClick={this.onDeleteClick.bind(this, postId, comment._id)}
								type="button"
								className="btn btn-danger mr-1"
							>
								<i className="fas fa-times" />
							</button>
						) : null}
					</div>
				</div>
			</div>
		);
	}
}

CommentItem.propTypes = {
	deleteComment: PropTypes.func.isRequired,
	comment: PropTypes.object.isRequired,
	postId: PropTypes.string.isRequired,
	auth: PropTypes.object.isRequired,
	upvoteComment: PropTypes.func.isRequired,
	downvoteComment: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { deleteComment, upvoteComment, downvoteComment })(CommentItem);
