const ReactDOM = require('react-dom');
const React = require('react');
import {subscriber} from 'react-dispatcher-decorator';
import {Main} from './component.js';
import {EVENTS} from './util.js';

const el = document.querySelector('.content');
function getUserFromLocalStorage() {
  const id = localStorage.getItem('id') ? localStorage.getItem('id') : '';
  const password = localStorage.getItem('password') ? localStorage.getItem('password') : '';
  return { id, password };
}
function fetchGitHub(url) {
  const {id, password} = getUserFromLocalStorage();
  const credentials = btoa(`${id}:${password}`);
  const headers = { Authorization: `Basic ${credentials}` };

  return fetch('https://api.github.com' + url, { headers })
    .then(res => {
      if (res.status === 200) { return res.json(); }
      else { return Promise.reject(res.json()); }
    })
    .then(j => {
      console.log(j);
      return j;
    });
}
function fetchIssues() {
  return Promise.all([fetchGitHub('/orgs/opt-tech/issues'), fetchGitHub('/orgs/opt-tech/issues?filter=created')]);
}
@subscriber((self, subscribe) => {
  subscribe('foo', () => {
    console.log('foo received on', self);
    self.forceUpdate();
  });
  subscribe(EVENTS.FETCH_MY_ISSUES, () => {
    fetchGitHub('/orgs/opt-tech/issues')
      .then(res => {
        self.setState({ usersIssues: res });
      })
  });
  subscribe(EVENTS.UPDATE_USERDATA, (k, v) => {
    const user = Object.assign({}, self.state.user, { [k]: v });
    self.setState({ user });
  });
  subscribe(EVENTS.SAVE_USERDATA, () => {
    const {id, password} = self.state.user;
    if (id === '' || password === '') {
      console.log('require input id and password.');
      return;
    }
    localStorage.setItem('id', id);
    localStorage.setItem('password', password);
  });
  subscribe(EVENTS.RELOAD_GITHUB, () => {
    fetchIssues().then(([usersIssues, createdIssues]) => {
      self.setState({ usersIssues, createdIssues });
    });
  });
})
class App extends React.Component {
  constructor() {
    super();
    const user = getUserFromLocalStorage();
    this.state = { usersIssues: [], createdIssues: [], user };
    fetchIssues().then(([usersIssues, createdIssues]) => {
      this.setState({ usersIssues, createdIssues });
    });
  }
  render() {
    return <Main {...this.state} />
  }
}

ReactDOM.render(<App/>, el);
