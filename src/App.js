import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import './style/styles.css';

import Rangeslider from './components/Rangeslider';
import ColorPicker from './components/ColorPicker';
var tinycolor = require('./utils/tinycolor');

import colors from './components/colors.json';
import ColorSwatch from './components/ColorSwatch';

const Warning = React.lazy(() => import('./Warning'));

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			counter: 0,
			value: 10,
			color: 'rgb(142, 68, 173)',
			text: '',
			selected: 0,
			colors: colors
		};

		this.minus = this.minus.bind(this);
		this.plus = this.plus.bind(this);
	}

	minus = () => {
		if(this.state.counter > 0) {
			this.setState((state) => {
				return { counter: state.counter - 1 };
			});
		}
	}

	plus = () => {
		this.setState((state) => {
			return { counter: state.counter + 1 };
		});
	}

	handleChangeStart = () => {
		console.log('change event completed');
	}

	handleChange = value => {
		this.setState({
			value: value
		});
	}

	handleChangeHue = value => {
		let color = this.state.color;

		const color1 = tinycolor(this.state.color);
		console.log('COLOR: ', color1);
		console.log('color.toHsv(): ', color1.toHsv());
		let hsv = color1.toHsv();

		hsv.h = value;

		const color2 = tinycolor(hsv);

		console.log('handleChangeHue: ', color2.toRgbString());

		this.setState({
			color: color2.toRgbString()
		});
	}

	handleChangeComplete = () => {
		console.log('change event completed');
	}

	onChangeColor = color => {
		console.log('onChangeColor: ', color);
		this.setState({
			color: color
		});
	}

	onChangeText = e => {
		this.setState({
			text: e.target.value
		});
	}

	onBlurText = e => {
		this.setState({
			color: e.target.value
		});
	}

	handleColorSelect = selected => {
		this.setState({ selected });
	}

	handleColorChange = (color) => {
		const colors = [...this.state.colors];
		colors[this.state.selected] = color;
		this.setState({ colors });
	}

	render() {
		const { value } = this.state;

		const selectedColor = this.state.colors[this.state.selected];

		const color1 = tinycolor(this.state.color);
		console.log('COLOR: ', color1);
		console.log('color.toHsv(): ', color1.toHsv());
		let hsv = color1.toHsv();

		return (
			<>
				<h1>Hello world.</h1>
				<h2 className={this.state.counter > 10 ? 'warning' : null}>
					Count {this.state.counter}
				</h2>
				<button onClick={this.minus}>-</button>
				<button onClick={this.plus}>+</button>
				{this.state.counter > 10 ? (
					<React.Suspense fallback={null}>
						<Warning />
					</React.Suspense>
				) : null}
				<div className='slider'>
					<Rangeslider
						min={0}
						max={100}
						value={value}
						onChangeStart={this.handleChangeStart}
						onChange={this.handleChange}
						onChangeComplete={this.handleChangeComplete}
					/>
					<div className='value'>{value}</div>
				</div>
				<div className='slider'>
					<Rangeslider
						min={0}
						max={100}
						value={value}
						onChangeStart={this.handleChangeStart}
						onChange={this.handleChange}
						onChangeComplete={this.handleChangeComplete}
						orientation="vertical"
					/>
					<div className='value'>{value}</div>
				</div>
				<div className='slider'>
					<Rangeslider
						min={0}
						max={100}
						className="color-slider"
						value={value}
						onChangeStart={this.handleChangeStart}
						onChange={this.handleChange}
						onChangeComplete={this.handleChangeComplete}
					/>
					<div className='value'>{value}</div>
				</div>
				<div className='slider'>
					<Rangeslider
						min={0}
						max={100}
						className="color-slider"
						value={value}
						onChangeStart={this.handleChangeStart}
						onChange={this.handleChange}
						onChangeComplete={this.handleChangeComplete}
						orientation="vertical"
					/>
					<div className='value'>{value}</div>
				</div>


				<div className="picker picker-left">
					<ColorSwatch
						colors={this.state.colors}
						select={this.state.selected}
						onSelect={this.handleColorSelect}
					/>
					{/*<div className="swatch">
						<button className="swatch-item" style={{backgroundColor: this.state.color}}></button>
				</div>*/}
				</div>

				<div className="picker picker-right">
					<ColorPicker
						onChange={this.handleColorChange /*this.onChangeColor*/}
						color={selectedColor}
					/>
					<input value={this.state.text} onChange={this.onChangeText} onBlur={this.onBlurText} />
					<div className='slider'>
						<Rangeslider
							min={0}
							max={360}
							className="color-slider"
							value={hsv.h}
							onChangeStart={this.handleChangeStart}
							onChange={this.handleChangeHue}
							onChangeComplete={this.handleChangeComplete}
							orientation="vertical"
						/>
						<div className='value'>{value}</div>
					</div>
				</div>
			</>
		);
	}
}

const hotFunction = hot(module);

export default hotFunction(App);
