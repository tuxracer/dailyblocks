import { Component } from 'preact';
import { route } from 'preact-router';

interface RedirectProps {
  path: string;
  to: string;
}

export default class Redirect extends Component<RedirectProps> {
  componentWillMount() {
    route(this.props.to, true);
  }

  render() {
    return null;
  }
}

export { Redirect };
