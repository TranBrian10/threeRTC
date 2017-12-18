import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ConnectionForm.css';
import EDeviceType from '../../utilities/EDeviceType';

function JoinAsControllerButton(props) {
	// Can only join as controller if gyro is present
	if (!props.hasGyro) {
		return null;
	}

	return (
		<button className="ConnectionForm-joinAsController" type="submit" onClick={props.updateDeviceType}>Join as controller</button>
	);
}
JoinAsControllerButton.propTypes = {
	hasGyro: PropTypes.bool.isRequired,
	updateDeviceType: PropTypes.func.isRequired
};

class ConnectionForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formValue: '',
			webrtcState: 'disconnected'
		};
		this.webrtc = null;

		this.updateDeviceType = this.updateDeviceType.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	updateDeviceType(clickEvent) {
		switch(clickEvent.target.className) {
			case 'ConnectionForm-joinAsDisplay':
				this.props.updateDeviceType(EDeviceType.CANVAS);
				break;
			case 'ConnectionForm-joinAsController':
				this.props.updateDeviceType(EDeviceType.CONTROLLER);
				break;
		}
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
					<button className="ConnectionForm-joinAsDisplay" type="submit" onClick={this.updateDeviceType}>Join as display</button>
					<JoinAsControllerButton hasGyro={this.props.hasGyro} updateDeviceType={this.updateDeviceType} />
				</form>
			</div>
		);
	}
}
ConnectionForm.propTypes = {
	hasGyro: PropTypes.bool.isRequired,
	createWebrtcConnection: PropTypes.func.isRequired,
	updateDeviceType: PropTypes.func.isRequired
};

export default ConnectionForm;
