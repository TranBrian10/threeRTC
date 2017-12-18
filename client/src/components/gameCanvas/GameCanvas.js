import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GameCanvas extends Component {
	constructor(props) {
		super(props);

		this.state = {
			webrtcObject: props.webrtcObject
		};
	}

	render() {
		return (
			<div>Game Canvas</div>
		);
	}
}
GameCanvas.propTypes = {
	webrtcObject: PropTypes.object.isRequired
};

export default GameCanvas;