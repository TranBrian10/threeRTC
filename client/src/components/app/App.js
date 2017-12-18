import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConnectionForm from '../connectionForm/ConnectionForm';
import logo from '../../assets/logo.svg';
import './App.css';
import SimpleWebRTC from 'simplewebrtc';
import EConnectionState from '../../utilities/EConnectionState';
import EDeviceType from '../../utilities/EDeviceType';

function ConnectionWrapper(props) {
	const state = props.webrtcConnectionState;

	// If we have not started a connection yet, show the connection form
	if (state === EConnectionState.DISCONNECTED) {
		return (
			<ConnectionForm
				hasGyro={props.hasGyro}
				createWebrtcConnection={props.createWebrtcConnection}
				updateDeviceType={props.updateDeviceType}
			/>
		);
	}

	// Otherwise, show connection status messages
	const deviceType = EDeviceType.properties[props.webrtcDeviceType].displayName;

	if (state === EConnectionState.JOINING_ROOM) {
		return (
			<div>Joining room &quot;{encodeURI(props.webrtcRoomName)}&quot; as a {deviceType}...</div>
		);
	}

	if (state === EConnectionState.WAITING_FOR_PEER) {
		// Performs xor to turn 0 to 1 or 1 to 0, which gets the other device properties
		const otherDevice = EDeviceType.properties[1^props.webrtcDeviceType].displayName;

		return (
			<div>Waiting for {otherDevice} in room &quot;{encodeURI(props.webrtcRoomName)}&quot;...</div>
		);
	}

	if (state === EConnectionState.CONNECTED) {
		return (
			<div>Connected to peer in room &quot;{encodeURI(props.webrtcRoomName)}&quot;.</div>
		);
	}

	return (
		<div>Connection lost.</div>
	);
}
ConnectionWrapper.propTypes = {
	hasGyro: PropTypes.bool.isRequired,
	createWebrtcConnection: PropTypes.func.isRequired,
	updateDeviceType: PropTypes.func.isRequired,
	webrtcConnectionState: PropTypes.number.isRequired,
	webrtcRoomName: PropTypes.string.isRequired,
	webrtcDeviceType: PropTypes.number
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasGyro: false,
			webrtcPeerState: 'disconnected',
			webrtcConnectionState: EConnectionState.DISCONNECTED,
			webrtcObject: null,
			webrtcRoomName: '',
			webrtcDeviceType: null
		};

		this.updateDeviceType = this.updateDeviceType.bind(this);
		this.createWebrtcConnection = this.createWebrtcConnection.bind(this);
	}

	componentDidMount() {
		// Check for gyroscope
		const checkHandler = (event) => {
			window.removeEventListener('devicemotion', checkHandler);

			if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma) {
				this.setState({ hasGyro: true });
			}
		};

		window.addEventListener('devicemotion', checkHandler);
	}

	updateDeviceType(deviceType) {
		this.setState({ webrtcDeviceType: deviceType });
	}

	createWebrtcConnection(roomName) {
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
		this.setState({ webrtcObject: webrtc });
		this.setState({ webrtcRoomName: roomName });

		webrtc.joinRoom(roomName);
		this.setState({ webrtcConnectionState: EConnectionState.JOINING_ROOM });

		// Joined room
		webrtc.on('connectionReady', () => {
			this.setState({ webrtcConnectionState: EConnectionState.WAITING_FOR_PEER });
		});

		// Peer connection process started
		webrtc.on('createdPeer', (peer) => {
			console.log('createdPeer', peer);

			if (peer && peer.pc) {
				// Peer connection state change
				peer.pc.on('iceConnectionStateChange', () => {
					this.setState({ webrtcPeerState: peer.pc.iceConnectionState });

					// Connected for the waiting side, completed for the calling side
					if (peer.pc.iceConnectionState === 'connected' || peer.pc.iceConnectionState === 'completed') {
						this.setState({ webrtcConnectionState: EConnectionState.CONNECTED });
					}
				});
			}
		});
	}

	render() {
		return (
			<div className="App">
				<header className="App-header App-section">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to threeRTC</h1>
					<p className="App-intro">Gyroscope {this.state.hasGyro ? '' : 'not'} detected</p>
				</header>

				<div className="App-section">
					<ConnectionWrapper
						hasGyro={this.state.hasGyro}
						createWebrtcConnection={this.createWebrtcConnection}
						updateDeviceType={this.updateDeviceType}
						webrtcConnectionState={this.state.webrtcConnectionState}
						webrtcRoomName={this.state.webrtcRoomName}
						webrtcDeviceType={this.state.webrtcDeviceType}
					/>
					<pre className="App-webrtcStatus">Peer state: {this.state.webrtcPeerState}</pre>
				</div>
			</div>
		);
	}
}

export default App;
