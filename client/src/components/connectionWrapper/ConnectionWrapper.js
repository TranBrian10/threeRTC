import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConnectionForm from '../connectionForm/ConnectionForm';
import EConnectionState from '../../utilities/EConnectionState';
import EDeviceType from '../../utilities/EDeviceType';

class ConnectionWrapper extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const state = this.props.webrtcConnectionState;

		// If we have not started a connection yet, show the connection form
		if (state === EConnectionState.DISCONNECTED) {
			return (
				<ConnectionForm
					hasGyro={this.props.hasGyro}
					createWebrtcConnection={this.props.createWebrtcConnection}
					updateDeviceType={this.props.updateDeviceType}
				/>
			);
		}

		// Otherwise, show connection status messages
		const deviceType = EDeviceType.properties[this.props.webrtcDeviceType].displayName;

		if (state === EConnectionState.JOINING_ROOM) {
			return (
				<div>Joining room &quot;{encodeURI(this.props.webrtcRoomName)}&quot; as a {deviceType}...</div>
			);
		}

		if (state === EConnectionState.WAITING_FOR_PEER) {
			// Performs xor to turn 0 to 1 or 1 to 0, which gets the other device properties
			const otherDevice = EDeviceType.properties[1^this.props.webrtcDeviceType].displayName;

			return (
				<div>Waiting for {otherDevice} in room &quot;{encodeURI(this.props.webrtcRoomName)}&quot;...</div>
			);
		}

		if (state === EConnectionState.CONNECTED) {
			return (
				<div>Connected to peer in room &quot;{encodeURI(this.props.webrtcRoomName)}&quot;.</div>
			);
		}

		return (
			<div>Connection lost.</div>
		);
	}
}
ConnectionWrapper.propTypes = {
	hasGyro: PropTypes.bool.isRequired,
	createWebrtcConnection: PropTypes.func.isRequired,
	updateDeviceType: PropTypes.func.isRequired,
	webrtcConnectionState: PropTypes.number.isRequired,
	webrtcRoomName: PropTypes.string.isRequired,
	webrtcDeviceType: PropTypes.number
};

export default ConnectionWrapper;
