import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GameController extends Component {
	constructor(props) {
		super(props);

		this.state = {
			webrtcObject: props.webrtcObject,
			absoluteOrientation: false,
			alphaOrientation: null,
			betaOrientation: null,
			gammaOrientation: null
		};

		this.handleOrientation = this.handleOrientation.bind(this);
	}

	handleOrientation(event) {
		// TODO: send data here

		this.setState({ absoluteOrientation: event.absolute });
		this.setState({ alphaOrientation: event.alpha });
		this.setState({ betaOrientation: event.beta });
		this.setState({ gammaOrientation: event.gamma });
	}

	componentDidMount() {
		window.addEventListener('deviceorientation', this.handleOrientation, true);
	}

	render() {
		return (
			<div className="GameController">
				<div>Game Controller</div>
				<br/>
				<div>Absolute: {(this.state.absoluteOrientation) ? 'true' : 'false'}</div>
				<div>Alpha: {this.state.alphaOrientation}</div>
				<div>Beta: {this.state.betaOrientation}</div>
				<div>Gamma: {this.state.gammaOrientation}</div>
			</div>
		);
	}
}
GameController.propTypes = {
	webrtcObject: PropTypes.object.isRequired
};

export default GameController;