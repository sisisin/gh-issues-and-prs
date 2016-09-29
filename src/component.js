const React = require('react');
import {dispatcher} from 'react-dispatcher-decorator';
import {ufo} from './util.js'
import {EVENTS} from './util.js';

@dispatcher
export class Main extends React.Component {
  render() {
    return (
      <div>
        <Credential {...this.props.user} />
        <hr />
        <button onClick={() => { this.context.dispatch(EVENTS.RELOAD_GITHUB) } }>reload</button>
        <h2>Issues assigned to you</h2>
        <div>
          {this.props.usersIssues.sort((a, b) => ufo(a.repository.name, b.repository.name)).map(issues) }
        </div>
        <h2>Issues created by you</h2>
        <div>{this.props.createdIssues.sort((a, b) => ufo(a.repository.name, b.repository.name)).map(issues) }</div>
      </div>
    );
  }
}
@dispatcher
class Credential extends React.Component {
  render() {
    return (
      <div>
        <input type="text" onChange={(e) => this.context.dispatch(EVENTS.UPDATE_USERDATA, 'id', e.target.value) } value={this.props.id} placeholder="id" />
        <input type="password" onChange={(e) => this.context.dispatch(EVENTS.UPDATE_USERDATA, 'password', e.target.value) } value={this.props.password} placeholder="password" />
        <button onClick={() => { this.context.dispatch(EVENTS.SAVE_USERDATA) } }>save</button>
      </div>
    );
  }
}
function issues(props) {
  const kind = props.pull_request ? 'PR' : 'issue';
  const head = `[${props.repository.name} ${kind}]`;
  return (
    <div key={props.id}>
      <span>{head}  </span>
      <a href={props.html_url} target="_blank">{props.title}</a>
    </div>
  );
}
