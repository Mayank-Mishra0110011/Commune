import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { createProfile, getCurrentProfile } from '../../actions/profileActions';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';

class CreateProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displaySocialInputs: false,
			handle: '',
			location: '',
			bio: '',
			instagram: '',
			twitter: '',
			facebook: '',
			errors: {}
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentDidMount() {
		this.props.getCurrentProfile();
	}
	onSubmit(event) {
		event.preventDefault();
		const profileData = {
			handle: this.state.handle,
			location: this.state.location,
			bio: this.state.bio,
			instagram: this.state.instagram,
			twitter: this.state.twitter,
			facebook: this.state.facebook
		};
		this.props.createProfile(profileData, this.props.history);
	}
	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
		if (nextProps.profile.profile) {
			const profile = nextProps.profile.profile;
			profile.handle = !isEmpty(profile.handle) ? profile.handle : '';
			profile.location = !isEmpty(profile.location) ? profile.location : '';
			profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
			if (profile.social) {
				profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
				profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
				profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';
			}
			this.setState({
				handle: profile.handle,
				location: profile.location,
				bio: profile.bio,
				instagram: profile.instagram,
				twitter: profile.twitter,
				facebook: profile.facebook
			});
		}
	}
	render() {
		const { errors, displaySocialInputs } = this.state;
		let socialInputs;
		if (displaySocialInputs) {
			socialInputs = (
				<div>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text">
								<i className="fab fa-twitter" />
							</span>
						</div>
						<input
							type="text"
							className={classnames('form-control form-control-lg', {
								'is-invalid': errors.twitter
							})}
							placeholder="Twitter Profile URL"
							name="twitter"
							value={this.state.twitter}
							onChange={this.onChange}
						/>
						{errors.twitter && <div className="invalid-feedback">{errors.twitter}</div>}
					</div>

					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text">
								<i className="fab fa-facebook" />
							</span>
						</div>
						<input
							type="text"
							className={classnames('form-control form-control-lg', {
								'is-invalid': errors.facebook
							})}
							placeholder="Facebook Page URL"
							name="facebook"
							value={this.state.facebook}
							onChange={this.onChange}
						/>
						{errors.facebook && <div className="invalid-feedback">{errors.facebook}</div>}
					</div>

					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text">
								<i className="fab fa-instagram" />
							</span>
						</div>
						<input
							type="text"
							className={classnames('form-control form-control-lg', {
								'is-invalid': errors.instagram
							})}
							placeholder="Instagram Page URL"
							name="instagram"
							value={this.state.instagram}
							onChange={this.onChange}
						/>
						{errors.instagram && <div className="invalid-feedback">{errors.instagram}</div>}
					</div>
				</div>
			);
		}
		return (
			<div className="edit-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Edit Profile</h1>
							<small className="d-block pb-3">* = required field</small>
							<form onSubmit={this.onSubmit}>
								<div className="form-group">
									<input
										type="text"
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.handle
										})}
										placeholder="* Profile handle"
										name="handle"
										value={this.state.handle}
										onChange={this.onChange}
									/>
									{errors.handle && <div className="invalid-feedback">{errors.handle}</div>}
									<small className="form-text text-muted">
										A unique handle for your profile URL. Your full name, nickname, etc.
									</small>
								</div>
								<div className="form-group">
									<input
										type="text"
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.location
										})}
										placeholder="Location"
										name="location"
										value={this.state.location}
										onChange={this.onChange}
									/>
									{errors.location && <div className="invalid-feedback">{errors.location}</div>}
									<small className="form-text text-muted">
										City & state suggested (eg. Boston, MA)
									</small>
								</div>
								<div className="form-group">
									<textarea
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.bio
										})}
										placeholder="A short bio of yourself"
										name="bio"
										value={this.state.bio}
										onChange={this.onChange}
									/>
									{errors.bio && <div className="invalid-feedback">{errors.bio}</div>}
									<small className="form-text text-muted">Tell us a little about yourself</small>
								</div>

								<div className="mb-3">
									<button
										type="button"
										className="btn btn-light"
										onClick={() => {
											this.setState((previousState) => ({
												displaySocialInputs: !previousState.displaySocialInputs
											}));
										}}
									>
										Add Social Network Links
									</button>{' '}
									<span className="text-muted">Optional</span>
								</div>

								{socialInputs}
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

CreateProfile.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	createProfile: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	errors: state.errors
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(CreateProfile));
