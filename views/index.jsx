var React = require('react');
import PropTypes from 'prop-types';
var DefaultLayout = require('./layouts/default');

class HelloMessage extends React.Component {
	render() {
		return (
			<DefaultLayout title={this.props.title}>
				<h1>{this.props.title}</h1>
				<div>Hello, welcome to {this.props.title}</div>
			</DefaultLayout>
		);
	}
}
HelloMessage.propTypes = {
	title: PropTypes.string.isRequired
};

module.exports = HelloMessage;