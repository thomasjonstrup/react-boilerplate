import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import './style/styles.css';

const Warning = React.lazy(() => import('./Warning'));

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			counter: 0
		};

		this.minus = this.minus.bind(this);
		this.plus = this.plus.bind(this);
	}

	minus(type) {
		this.setState((state, props) => {
			return { counter: state.counter - 1 };
		});
	}

	plus(type) {
		this.setState((state, props) => {
			return { counter: state.counter + 1 };
		});
	}

	render() {
		return (
			<Fragment>
				<h1>Hello world.</h1>
				<h2 className={this.state.counter > 10 ? 'warning' : null}>
					Count {this.state.counter}
				</h2>
				<button onClick={this.plus}>+</button>
				<button onClick={this.minus}>-</button>
				{this.state.counter > 10 ? (
					<React.Suspense fallback={null}>
						<Warning />
					</React.Suspense>
				) : null}
			</Fragment>
		);
	}
}

const hotFunction = hot(module);

export default hotFunction(App);
