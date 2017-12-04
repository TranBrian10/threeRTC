var React = require('react');
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

module.exports = HelloMessage;