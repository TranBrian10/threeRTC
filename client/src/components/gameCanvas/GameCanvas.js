import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Game from '../../game-logic/main';
import './GameCanvas.css';

class GameCanvas extends Component {
	constructor(props) {
		super(props);

		this.gameObject = Game.getInstance();
		this.gameObject.setWebrtc(props.webrtcObject);

		if (props.webrtcPeerState === 'closed') {
			// TODO: call game logic to handle peer connection lost
		}
	}

	render() {
		return (
			<div></div>
		);
	}
}
GameCanvas.propTypes = {
	webrtcObject: PropTypes.object.isRequired,
	webrtcPeerState: PropTypes.string
};

export default GameCanvas;