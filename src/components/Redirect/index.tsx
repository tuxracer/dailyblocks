import { Component } from "preact";
import { route } from "preact-router";

interface RedirectProps {
    to: string;
    replace?: boolean;
}

export class Redirect extends Component<RedirectProps> {
    componentWillMount() {
        route(this.props.to, this.props.replace);
    }

    render() {
        return null;
    }
}

export default Redirect;
