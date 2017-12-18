import React, { Component } from 'react';
import ConnectionWrapper from '../connectionWrapper/ConnectionWrapper';
import GameCanvas from '../gameCanvas/GameCanvas';
import GameController from '../gameController/GameController';
import logo from '../../assets/logo.svg';
import './App.css';
import SimpleWebRTC from 'simplewebrtc';
import EConnectionState from '../../utilities/EConnectionState';
import EDeviceType from '../../utilities/EDeviceType';

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
		if (this.state.webrtcConnectionState === EConnectionState.CONNECTED) {
			if (this.state.webrtcDeviceType === EDeviceType.CANVAS) {
				return <GameCanvas webrtcObject={this.state.webrtcObject} />;
			}

			return <GameController webrtcObject={this.state.webrtcObject} />;
		}

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
