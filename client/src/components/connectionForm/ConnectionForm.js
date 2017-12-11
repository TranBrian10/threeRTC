import React, { Component } from 'react';
import './ConnectionForm.css';
import SimpleWebRTC from 'simplewebrtc';

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
					<input type="submit" value="Join as display" />
					<input type="submit" value="Join as controller" />
				</form>

				<pre className="ConnectionForm-statusLog">{this.state.webrtcState}</pre>
			</div>
		);
	}
}

export default ConnectionForm;
