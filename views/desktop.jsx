var React = require('react');
var DefaultLayout = require('./layouts/default');
import PropTypes from 'prop-types';
import SimpleWebRTC from 'simplewebrtc';

class RoomForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formValue: '',
			webrtcStatus: 'Not connected'
		};
		this.webrtc = null;

		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleFormChange(event) {
		this.setState({ formValue: event.target.value });
	}

	handleFormSubmit(event) {
		// TODO: case sensitive, ensure one word, ensure unique, not too long

		// Set up a webrtc data channel connection
		// const webrtc = new SimpleWebRTC({
		// 	localVideoEl: '',
		// 	remoteVideosEl: '',
		// 	autoRequestMedia: false,
		// 	receiveMedia: {
		// 		offerToReceiveAudio: 0,
		// 		offerToReceiveVideo: 0
		// 	}
		// });
		// webrtc.joinRoom(this.state.formValue);

		// webrtc.on('createdPeer', function (peer) {
		// 	console.log('createdPeer', peer);
		// });
		console.log(this.formValue);

		event.preventDefault();
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleFormSubmit}>
					<label> Start a room:
						<input type="text" placeholder="e.g. myRoom" value={this.state.formValue} onChange={this.handleFormChange} />
					</label>
					<input type="submit" value="Create" />
				</form>
				<br/>

				<div>Status: <span>{this.state.webrtcStatus}</span></div>
			</div>
		);
	}
}

class DesktopApp extends React.Component {
	render() {
		return (
			<DefaultLayout title={this.props.title}>
				<h1>{this.props.title}</h1>

				<div>Desktop browser detected</div>
				<br/>

				<RoomForm />
			</DefaultLayout>
		);
	}
}
DesktopApp.propTypes = {
	title: PropTypes.string.isRequired
};

module.exports = DesktopApp;