import React, { Component } from 'react';
import ConnectionForm from '../connectionForm/ConnectionForm';
import logo from '../../assets/logo.svg';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasGyro: false,
			webrtcState: 'disconnected',
			webrtcObject: null
		};
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

	render() {
		return (
			<div className="App">
				<header className="App-header App-section">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to threeRTC</h1>
					<p className="App-intro">Gyroscope {this.state.hasGyro ? '' : 'not'} detected</p>
				</header>

				<div className="App-section">
					<ConnectionForm hasGyro={this.state.hasGyro} />
				</div>
			</div>
		);
	}
}

export default App;
