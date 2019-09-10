import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { addPost } from '../../actions/postActions';

class PostForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			post: '',
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
		const newPost = {
			title: this.state.title,
			post: this.state.post,
			name: user.name,
			avatar: user.avatar
		};
		this.props.addPost(newPost);
		if (this.state.title.length > 1 && this.state.post.length > 9) {
			this.setState({ title: '' });
			this.setState({ post: '' });
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
						<i className="fas fa-pen-alt" /> Create a post
					</div>
					<div className="card-body">
						<form onSubmit={this.onSubmit}>
							<div className="form-group">
								<input
									type="text"
									className={classnames('form-control', {
										'is-invalid': errors.title
									})}
									placeholder="Post title"
									value={this.state.title}
									onChange={this.onChange}
									error={errors.title}
									name="title"
								/>
								{errors.title && <div className="invalid-feedback">{errors.title}</div>}
								<textarea
									className={classnames('form-control form-control-lg mt-3', {
										'is-invalid': errors.post
									})}
									placeholder="Text or Media Link"
									value={this.state.post}
									onChange={this.onChange}
									error={errors.post}
									name="post"
								/>
								{errors.post && <div className="invalid-feedback">{errors.post}</div>}
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

PostForm.propTypes = {
	addPost: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	errors: state.errors,
	auth: state.auth
});

export default connect(mapStateToProps, { addPost })(PostForm);
