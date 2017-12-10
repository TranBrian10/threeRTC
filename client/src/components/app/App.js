import React, { Component } from 'react';
import ConnectionForm from '../connectionForm/ConnectionForm';
import logo from '../../assets/logo.svg';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { userAgent: 'None' };
	}

	componentDidMount() {
		fetch('/user-agent')
			.then(res => res.json())
			.then(responseJson => this.setState(() => {
				return { userAgent: responseJson.userAgent };
			}));
	}

	render() {
		return (
			<div className="App">
				<header className="App-header App-section">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to threeRTC</h1>
					<p className="App-intro">{this.state.userAgent} detected</p>
				</header>

				<div className="App-section">
					<ConnectionForm />
				</div>
			</div>
		);
	}
}

export default App;
