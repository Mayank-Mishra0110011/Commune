import React, { Component } from 'react';

class Profile extends Component {
	render() {
		const profile = this.props.profile;
		const location = (
			<tr>
				<td>{profile.location}</td>
			</tr>
		);
		const bio = (
			<tr>
				<td>{profile.bio}</td>
			</tr>
		);
		const profileDisplay = (
			<tr>
				<td>
					<img
						src={profile.user.avatar}
						title="You must have a Gravatar connected to your email to display an image"
						style={{ width: '25px', marginRight: '5px' }}
						className="rounded-circle"
						alt={profile.user.name}
					/>
					{profile.handle}
				</td>
			</tr>
		);
		const socialHead = [],
			socailData = [];
		let i = 1,
			j = 4,
			socialField;
		if (profile.social) {
			socialField = (
				<h4 className="mb-2 mt-1">
					<span>
						<i className="fas fa-user-plus" />
					</span>{' '}
					Social
				</h4>
			);
		}
		if (profile.social && profile.social.twitter) {
			socialHead.push(<th key={i}>Twitter</th>);
			socailData.push(
				<td key={j}>
					<a href={profile.social.twitter}>{profile.social.twitter}</a>
				</td>
			);
			++i;
			++j;
		}
		if (profile.social && profile.social.facebook) {
			socialHead.push(<th key={i}>Facebook</th>);
			socailData.push(
				<td key={j}>
					<a href={profile.social.facebook}>{profile.social.facebook}</a>
				</td>
			);
			++i;
			++j;
		}
		if (profile.social && profile.social.instagram) {
			socialHead.push(<th key={i}>Instagram</th>);
			socailData.push(
				<td key={j}>
					<a href={profile.social.instagram}>{profile.social.instagram}</a>
				</td>
			);
			++i;
			++j;
		}
		return (
			<div>
				<h4 className="mb-2 mt-1">
					<span>
						<i className="fas fa-at" />
					</span>{' '}
					Handle
				</h4>
				<table className="table">
					<tbody>{profileDisplay}</tbody>
				</table>
				<h4 className="mb-2 mt-1">
					<span>
						<i className="fas fa-map-marker-alt" />
					</span>{' '}
					Location
				</h4>
				<table className="table">
					<tbody>{location}</tbody>
				</table>
				<h4 className="mb-2 mt-1">
					<span>
						<i className="far fa-address-card" />
					</span>{' '}
					Bio
				</h4>
				<table className="table">
					<tbody>{bio}</tbody>
				</table>
				{socialField}
				<table className="table">
					<thead>
						<tr>{socialHead}</tr>
					</thead>
					<tbody>
						<tr>{socailData}</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default Profile;
