var React = require('react');
var DefaultLayout = require('./layouts/default');

class HelloMessage extends React.Component {
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

module.exports = HelloMessage;