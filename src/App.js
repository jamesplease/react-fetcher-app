import React, { Component, Fragment } from "react";
import "./App.css";
import Fetcher from "./react-fetcher";

function fetchBooks(options) {
  console.log("fetching books with", options);

  return fetch(
    `https://jsonplaceholder.typicode.com/posts/${options.bookId}`
  ).then(res => {
    return new Promise(resolve => {
      res.json().then(val => {
        res.data = val;

        resolve(res);
      });
    });
  });
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Fetcher request={fetchBooks} bookId={this.state.num}>
          {result => {
            let output;

            console.log("render prop callback", result);
            if (result.failed) {
              output = <div>There was an error</div>;
            } else if (result.fetching) {
              output = <div>Loading...</div>;
            } else if (result.data) {
              output = (
                <div>
                  {result.data.id}: {result.data.title}
                </div>
              );
            }

            return (
              <Fragment>
                <button onClick={() => result.request({ bookId: 30 })}>
                  Load book 30
                </button>
                {output}
              </Fragment>
            );
          }}
        </Fetcher>
      </div>
    );
  }

  state = {
    num: 0
  };

  componentDidMount() {
    this._interval = setInterval(() => {
      this.setState(prevState => {
        return {
          num: prevState.num + 1
        };
      });
    }, 5000);

    setTimeout(() => {
      clearInterval(this._interval);
    }, 30000);
  }
}

export default App;
