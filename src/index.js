const ReactDOM = require('react-dom');
const React = require('react');
const el = document.querySelector('.content');
import {dispatcher, subscriber} from 'react-dispatcher-decorator';

@dispatcher
class Child extends React.Component {
  onClick() {
    this.context.dispatch('foo');
  }

  render() {
    return <button onClick={this.onClick.bind(this)}>hello</button>
  }
}

@subscriber((self, subscribe) => {
  subscribe('foo', () => {
    console.log('foo received on', self);
    self.forceUpdate();
  });
})
class App extends React.Component {
  render() {
    return <Child/>
  }
}

ReactDOM.render(<App/>, el);
