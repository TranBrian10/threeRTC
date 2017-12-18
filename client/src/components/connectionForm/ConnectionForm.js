import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ConnectionForm.css';
import SimpleWebRTC from 'simplewebrtc';

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
		// TODO: case sensitive, ensure one word, ensure unique, not too long
		// TODO: set up signaling server, add as constructor parameter
		// TODO: ensure one display, one controller

		// Set up a webrtc data channel connection
		const webrtc = new SimpleWebRTC({
			localVideoEl: '',
			remoteVideosEl: '',
			autoRequestMedia: false,
			enableDataChannels: true,
			receiveMedia: {
				offerToReceiveAudio: 0,
				offerToReceiveVideo: 0
			}
		});
		webrtc.joinRoom(this.state.formValue);

		webrtc.on('createdPeer', (peer) => {
			console.log('createdPeer', peer);

			if (peer && peer.pc) {
				peer.pc.on('iceConnectionStateChange', () => {
					this.setState({ webrtcState: peer.pc.iceConnectionState });
				});
			}
		});

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

				<pre className="ConnectionForm-statusLog">{this.state.webrtcState}</pre>
			</div>
		);
	}
}
ConnectionForm.propTypes = {
	hasGyro: PropTypes.bool.isRequired
};

export default ConnectionForm;
