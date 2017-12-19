import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Game from '../../game-logic/main';
import './GameCanvas.css';

class GameCanvas extends Component {
	constructor(props) {
		super(props);

		this.state = {
			webrtcObject: props.webrtcObject
		};

		this.gameObject = Game.getInstance();
		this.gameObject.setWebrtc(this.state.webrtcObject);
	}

	render() {
		return (
			<div></div>
		);
	}
}
GameCanvas.propTypes = {
	webrtcObject: PropTypes.object.isRequired
};

export default GameCanvas;