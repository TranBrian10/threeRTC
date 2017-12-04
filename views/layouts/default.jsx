var React = require('react');
import PropTypes from 'prop-types';

class DefaultLayout extends React.Component {
	render() {
		return (
			<html>
				<head>
					<title>{this.props.title}</title>
					<link href="/stylesheets/style.css" rel="stylesheet" />
				</head>
				<body>{this.props.children}</body>
			</html>
		);
	}
}
DefaultLayout.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.object
};

module.exports = DefaultLayout;