import React, { Component } from 'react';
import PropTypes from 'prop-types';

function getKey(props) {
  const { children, request, ...rest } = props;

  return JSON.stringify(rest);
}

export default class Fetcher extends Component {
  render() {
    const { children } = this.props;

    const renderPropArg = {
      ...this.state,
      request: this.makeRequestRenderProp
    };

    if (typeof children === 'function') {
      return children(renderPropArg);
    } else {
      return null;
    }
  }
  
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      fetching: !this.props.lazy
    }
  }

  componentDidMount() {
    const { lazy } = this.props;
  
    if (!lazy) {
      this.makeRequest();
    }
  }

  componentDidUpdate(prevProps) {
    const prevKey = getKey(prevProps);
    const currentKey = getKey(this.props);

    if (prevKey !== currentKey && !this.props.lazy) {
      this.makeRequest();
    }
  }

  makeRequestRenderProp = options => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.makeRequest(options)
          .then(
            val => resolve(val),
            err => reject(err)
          );
      });
    });
    
  }

  makeRequest(options) {
    const { request } = this.props;

    const requestOptions = Object.assign({}, this.props, options);

    if (typeof request === 'function') {
      this.setState({
        fetching: true
      });

      return request(requestOptions)
        .then(result => {
          this.setState({
            fetching: false,
            result
          });

          return result;
        });
    }
  }
}

Fetcher.propTypes = {
  request: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  lazy: PropTypes.bool
}