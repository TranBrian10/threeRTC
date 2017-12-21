import React, { Component } from 'react';
import Game from '../../game-logic/main';
import './TestCanvas.css';

class TestCanvas extends Component {
	constructor(props) {
		super(props);

		this.state = {
			alphaOrientation: null,
			betaOrientation: null,
			gammaOrientation: null
		};

		this.orientationDataHandler = this.orientationDataHandler.bind(this);

		this.gameObject = Game.getInstance();
		this.gameObject.addOrientationDataHandler(this.orientationDataHandler);
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
			<div className="TestCanvas">
				<pre className="TestCanvas-orientationData">
					Z: {this.state.alphaOrientation}<br/>
					X: {this.state.betaOrientation}<br/>
					Y: {this.state.gammaOrientation}
				</pre>
			</div>
		);
	}
}

export default TestCanvas;