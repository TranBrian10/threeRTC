var React = require('react');
var DefaultLayout = require('./layouts/default');
import PropTypes from 'prop-types';

class DesktopApp extends React.Component {
	render() {
		return (
			<DefaultLayout title={this.props.title}>
				<h1>{this.props.title}</h1>

				<div>Nothing here for now!</div>
			</DefaultLayout>
		);
	}
}
DesktopApp.propTypes = {
	title: PropTypes.string.isRequired
};

module.exports = DesktopApp;