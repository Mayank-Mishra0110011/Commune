import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { addComment } from '../../actions/postActions';

class CommentForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comment: '',
			errors: {}
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.errors) {
			this.setState({ errors: newProps.errors });
		}
	}
	onSubmit(e) {
		e.preventDefault();
		const { user } = this.props.auth;
		const { postId } = this.props;
		const newComment = {
			comment: this.state.comment,
			name: user.name,
			avatar: user.avatar
		};
		this.props.addComment(postId, newComment);
		if (this.state.comment.length > 0) {
			this.setState({ comment: '' });
		}
	}
	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	render() {
		const { errors } = this.state;
		return (
			<div className="post-form mb-3">
				<div className="card card-info">
					<div className="card-header bg-info text-white">
						<i className="fas fa-comment" /> Write a comment
					</div>
					<div className="card-body">
						<form onSubmit={this.onSubmit}>
							<div className="form-group">
								<textarea
									className={classnames('form-control form-control-lg mt-3', {
										'is-invalid': errors.comment
									})}
									placeholder="Reply to post"
									value={this.state.comment}
									onChange={this.onChange}
									error={errors.comment}
									name="comment"
								/>
								{errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
							</div>
							<button type="submit" className="btn btn-dark">
								Submit
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

CommentForm.propTypes = {
	addPost: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	postId: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
	errors: state.errors,
	auth: state.auth
});

export default connect(mapStateToProps, { addComment })(CommentForm);
