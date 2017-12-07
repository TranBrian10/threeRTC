var React = require('react');
var DefaultLayout = require('./layouts/default');
import PropTypes from 'prop-types';

class Greeting extends React.Component {
	render() {
		return (
			<DefaultLayout title={this.props.title}>
				<h1>{this.props.title}</h1>

				<div>Nothing here for now!</div>
			</DefaultLayout>
		);
	}
}
Greeting.propTypes = {
	title: PropTypes.string.isRequired
};

module.exports = Greeting;