import React, { Component } from "react";
import PropTypes from "prop-types";

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

    if (typeof children === "function") {
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
    };
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
        this.makeRequest(options).then(val => resolve(val), err => reject(err));
      });
    });
  };

  makeRequest = options => {
    const { request } = this.props;

    const requestOptions = Object.assign({}, this.props, options);

    if (typeof request === "function") {
      const currentKey = getKey(this.props);

      this.setState({
        fetching: true
      });

      this._currentKey = currentKey;

      return request(requestOptions).then(
        result => {
          // We ignore responses when we have a new key
          if (this._currentKey !== currentKey) {
            return result;
          }

          if (process.NODE_ENV !== "production") {
            if (!(result instanceof Response)) {
              console.log(`Fetchers must return Response instances.`);
            }
          }

          this.setState({
            fetching: false,
            failed: !result.ok,
            data: result.data,
            result
          });

          return result;
        },
        error => {
          // We ignore responses when we have a new key
          if (this._currentKey !== currentKey) {
            return Promise.reject(error);
          }

          this.setState({
            fetching: false,
            failed: true,
            error
          });

          return Promise.reject(error);
        }
      );
    }
  };
}

Fetcher.propTypes = {
  request: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  lazy: PropTypes.bool
};
