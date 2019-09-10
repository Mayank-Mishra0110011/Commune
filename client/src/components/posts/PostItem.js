import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deletePost, upvote, downvote } from '../../actions/postActions';

class PostItem extends Component {
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
	onUpvoteClick(id) {
		this.props.upvote(id);
	}
	onDownvoteClick(id) {
		this.props.downvote(id);
	}
	onDeleteClick(id) {
		this.props.deletePost(id);
	}
	mouseEnter(e) {
		if (e.target.tagName === 'BUTTON') {
			e.target.style.fill = '#FF4500';
		}
	}
	isLink(url) {
		const pattern = new RegExp(
			'^(https?:\\/\\/)?' +
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
				'((\\d{1,3}\\.){3}\\d{1,3}))' +
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
				'(\\?[;&a-z\\d%_.~+=-]*)?' +
				'(\\#[-a-z\\d_]*)?$',
			'i'
		);
		return !!pattern.test(url);
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
	render() {
		const { post, auth, showActions } = this.props;
		let embed;
		if (this.isLink(post.post)) {
			embed = (
				<div className="h-75 mb-2 embed-responsive embed-responsive-16by9">
					<iframe className="embed-responsive-item" src={post.post} />
				</div>
			);
		} else {
			embed = <div className="h-50">{post.post}</div>;
		}
		return (
			<div className="card card-body mb-3">
				<div className="row">
					<div className="col-md-2">
						<a href="profile">
							<img className="rounded-circle d-none d-md-block" src={post.avatar} alt="" />
						</a>
						<br />
						<p className="text-center">{post.name}</p>
					</div>
					<div className="col-md-10">
						<p className="lead font-weight-bold">{post.title}</p>
						{embed}
						<div className={this.isLink(post.post) ? 'mt-5' : ''}>
							{showActions ? (
								<span>
									<button
										type="button"
										className="btn btn-sm btn-light mr-1"
										style={
											this.findUserUpvote(post.upvotes) ? { fill: '#FF4500' } : { fill: 'black' }
										}
										onMouseEnter={this.mouseEnter}
										onMouseLeave={this.mouseLeave.bind(this, this.findUserUpvote(post.upvotes))}
										onClick={this.onUpvoteClick.bind(this, post._id)}
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
									<span className="badge badge-light">
										{post.upvotes.length - post.downvotes.length}
									</span>
									<button
										type="button"
										className="btn btn-sm btn-light mr-1 ml-1"
										onMouseEnter={this.mouseEnterDownvote}
										onMouseLeave={this.mouseLeave.bind(this, this.findUserDownvote(post.downvotes))}
										onClick={this.onDownvoteClick.bind(this, post._id)}
										style={
											this.findUserDownvote(post.downvotes) ? (
												{ fill: '#7193FF' }
											) : (
												{ fill: 'black' }
											)
										}
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
									<Link to={`/post/${post._id}`} className="btn btn-info mr-1">
										Comments
									</Link>
									{post.user === auth.user.id ? (
										<button
											onClick={this.onDeleteClick.bind(this, post._id)}
											type="button"
											className="btn btn-danger mr-1"
										>
											<i className="fas fa-times" />
										</button>
									) : null}
								</span>
							) : null}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

PostItem.defaultProps = {
	showActions: true
};

PostItem.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	deletePost: PropTypes.func.isRequired,
	upvote: PropTypes.func.isRequired,
	downvote: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { deletePost, upvote, downvote })(PostItem);
