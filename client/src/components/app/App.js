import React, { Component } from 'react';
import ConnectionForm from '../connectionForm/ConnectionForm';
import logo from '../../assets/logo.svg';
import './App.css';
import SimpleWebRTC from 'simplewebrtc';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasGyro: false,
			webrtcState: 'disconnected',
			webrtcObject: null
		};

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

		webrtc.joinRoom(roomName);

		webrtc.on('createdPeer', (peer) => {
			console.log('createdPeer', peer);

			if (peer && peer.pc) {
				peer.pc.on('iceConnectionStateChange', () => {
					this.setState({ webrtcState: peer.pc.iceConnectionState });
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
					<ConnectionForm hasGyro={this.state.hasGyro} createWebrtcConnection={this.createWebrtcConnection} />
					<pre className="App-webrtcStatus">{this.state.webrtcState}</pre>
				</div>
			</div>
		);
	}
}

export default App;
