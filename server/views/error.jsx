var React = require('react');
import PropTypes from 'prop-types';
var DefaultLayout = require('./layouts/default');

class ErrorMessage extends React.Component {
	render() {
		return (
			<DefaultLayout title={this.props.title}>
				<h1>{this.props.message}</h1>
				<h1>{this.props.error.status}</h1>
				<pre>{this.props.error.stack}</pre>
			</DefaultLayout>
		);
	}
}
ErrorMessage.propTypes = {
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	error: PropTypes.object.isRequired
};

module.exports = ErrorMessage;