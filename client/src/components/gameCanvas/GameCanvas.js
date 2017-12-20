import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Game from '../../game-logic/main';
import './GameCanvas.css';

class GameCanvas extends Component {
	constructor(props) {
		super(props);

		this.state = {
			alphaOrientation: null,
			betaOrientation: null,
			gammaOrientation: null
		};

		this.orientationDataHandler = this.orientationDataHandler.bind(this);

		this.gameObject = Game.getInstance();
		this.gameObject.setWebrtc(props.webrtcObject);
		this.gameObject.addOrientationDataHandler(this.orientationDataHandler);

		if (props.webrtcPeerState === 'closed') {
			// TODO: call game logic to handle peer connection lost
		}
	}

	orientationDataHandler(data) {
		this.setState({
			alphaOrientation: data.alpha.toFixed(4),
			betaOrientation: data.beta.toFixed(4),
			gammaOrientation: data.gamma.toFixed(4)
		});
	}

	render() {
		return (
			<div className="GameController">
				<pre className="GameController-webrtcPeerState">Peer state: {this.props.webrtcPeerState}</pre>
				<pre className="GameController-orientationData">
					Z: {this.state.alphaOrientation}<br/>
					X: {this.state.betaOrientation}<br/>
					Y: {this.state.gammaOrientation}
				</pre>
			</div>
		);
	}
}
GameCanvas.propTypes = {
	webrtcObject: PropTypes.object.isRequired,
	webrtcPeerState: PropTypes.string
};

export default GameCanvas;