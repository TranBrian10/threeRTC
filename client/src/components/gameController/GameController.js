import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NoSleep from 'nosleep.js';

let webrtc;

function setupDataChannel(webrtcObject) {
	webrtc = webrtcObject;

	const display = webrtc.getPeers()[0];
	if (!display.enableDataChannels) {
		console.warn('Display peer does not have data channels enabled');
		return;
	}

	display.getDataChannel('orientationData');
}

class GameController extends Component {
	constructor(props) {
		super(props);

		this.state = {
			noSleepObject: null,
			wakeLockEnabled: true,
			absoluteOrientation: false,
			alphaOrientation: null,
			betaOrientation: null,
			gammaOrientation: null,
			dataChannel: null
		};

		if (webrtc !== props.webrtcObject) {
			setupDataChannel(props.webrtcObject);
		}

		this.handleOrientation = this.handleOrientation.bind(this);
		this.toggleWakelock = this.toggleWakelock.bind(this);
		this.startCalibration = this.startCalibration.bind(this);
	}

	handleOrientation(event) {
		webrtc.sendDirectlyToAll('orientationData', 'controllerOrientation', {
			absolute: event.absolute,
			alpha: event.alpha,
			beta: event.beta,
			gamma: event.gamma
		});

		this.setState({ absoluteOrientation: event.absolute }); // wrt Earth's coordinate frame
		this.setState({ alphaOrientation: event.alpha }); // z axis
		this.setState({ betaOrientation: event.beta }); // x axis
		this.setState({ gammaOrientation: event.gamma }); // y axis
	}

	toggleWakelock() {
		if (this.state.wakeLockEnabled) {
			this.state.noSleepObject.disable();
			this.setState({ wakeLockEnabled: false });
			return;
		}

		this.state.noSleepObject.enable();
		this.setState({ wakeLockEnabled: true });
	}

	startCalibration() {
		webrtc.sendDirectlyToAll('orientationData', 'controllerCalibrate', {
			absolute: this.state.absoluteOrientation,
			alpha: this.state.alphaOrientation,
			beta: this.state.betaOrientation,
			gamma: this.state.gammaOrientation
		});
	}

	componentDidMount() {
		// Wake lock
		const noSleep = new NoSleep();
		this.setState({ noSleepObject: noSleep });

		window.addEventListener('deviceorientation', this.handleOrientation, true);
	}

	componentWillUnmount() {
		this.state.noSleepObject.disable();
	}

	render() {
		return (
			<div className="GameController">
				<h3>Game Controller</h3>
				<div>Absolute: {(this.state.absoluteOrientation) ? 'true' : 'false'}</div>
				<div>Alpha: {this.state.alphaOrientation}</div>
				<div>Beta: {this.state.betaOrientation}</div>
				<div>Gamma: {this.state.gammaOrientation}</div>
				<br/>
				<div>Warning: do not turn off the phone screen</div>
				<button onClick={this.toggleWakelock}>Toggle wakelock</button>
				<span>{(this.state.wakeLockEnabled) ? 'Enabled' : 'Disabled'}</span>
				<br/>
				<br/>
				<button onClick={this.startCalibration}>Calibrate</button>
			</div>
		);
	}
}
GameController.propTypes = {
	webrtcObject: PropTypes.object.isRequired
};

export default GameController;