var React = require('react');
var DefaultLayout = require('./layouts/default');
import PropTypes from 'prop-types';

class DesktopMessage extends React.Component {
	render() {
		return (
			<DefaultLayout title={this.props.title}>
				<h1>{this.props.title}</h1>
				<div>Desktop browser detected</div>
			</DefaultLayout>
		);
	}
}
DesktopMessage.propTypes = {
	title: PropTypes.string.isRequired
};

module.exports = DesktopMessage;