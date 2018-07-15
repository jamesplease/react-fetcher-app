import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Fetcher from './react-fetcher';

function fetchBooks(props) {
  console.log('fetching books with', props);

  return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => res.json());
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Fetcher request={fetchBooks} bookId={1}>
            {(data) => {
              console.log('render prop callback', data);
              return <button onClick={() => data.request({ bookId: 5000 })}>hello</button>;
            }}
          </Fetcher>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }

  state = {
    num: 0
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(prevState => {
        return {
          num: prevState.num + 1
        };
      });
    }, 5000);
    
  }
}

export default App;
