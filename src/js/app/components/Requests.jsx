import React, { Component } from 'react';
import connectJSON from '../store/connectors/connectJSON';
import { getIn } from 'fun-util';
import getRequests from '../actions/getRequests';

class Requests extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { method, path } = getIn(this.props, 'location', 'query') || {};
    dispatch(getRequests(method, path));
  }

  render() {
    const { method, path } = getIn(this.props, 'location', 'query') || {};
    const { requests } = this.props;
    return (
      <div>
        <h1>Requests</h1>
        <div>{method}: {path}</div>
        <pre>{requests}</pre>
      </div>
    );
  }
}

export default connectJSON('requests')(Requests);