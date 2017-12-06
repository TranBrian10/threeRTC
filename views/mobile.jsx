var React = require('react');
var DefaultLayout = require('./layouts/default');
import PropTypes from 'prop-types';

class MobileApp extends React.Component {
	render() {
		return (
			<DefaultLayout title={this.props.title}>
				<h1>{this.props.title}</h1>

				<div>Mobile browser detected</div>
				<br/>
			</DefaultLayout>
		);
	}
}
MobileApp.propTypes = {
	title: PropTypes.string.isRequired
};

module.exports = MobileApp;