import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ConnectionForm.css';

function JoinAsControllerButton(props) {
	// Can only join as controller if gyro is present
	if (!props.hasGyro) {
		return null;
	}

	return (
		<input className="ConnectionForm-joinAsController" type="submit" value="Join as controller" />
	);
}
JoinAsControllerButton.propTypes = {
	hasGyro: PropTypes.bool.isRequired
};

class ConnectionForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formValue: '',
			webrtcState: 'disconnected'
		};
		this.webrtc = null;

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleFormChange(event) {
		this.setState({ formValue: event.target.value });
	}

	handleFormSubmit(event) {
		this.props.createWebrtcConnection(this.state.formValue);
		event.preventDefault();
	}

	render() {
		return (
			<div className="ConnectionForm">
				<form onSubmit={this.handleFormSubmit}>
					<label>
						<span>Join a room: </span>
						<input type="text" placeholder="e.g. myRoom" value={this.state.formValue} onChange={this.handleFormChange} />
					</label>
					<input className="ConnectionForm-joinAsDisplay" type="submit" value="Join as display" />
					<JoinAsControllerButton hasGyro={this.props.hasGyro}/>
				</form>
			</div>
		);
	}
}
ConnectionForm.propTypes = {
	hasGyro: PropTypes.bool.isRequired,
	createWebrtcConnection: PropTypes.func.isRequired
};

export default ConnectionForm;
