import React, {PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
var tinycolor = require('../utils/tinycolor');
import Map from './ColorPicker/Map';


class ColorPicker extends PureComponent {
	constructor(props) {
		super(props);

		this.handleSaturationValueChange = this.handleSaturationValueChange.bind(this);
		/*this.handleAlphaChange = this.handleSaturationValueChange.bind(this);
		this.handleHueChange = this.handleSaturationValueChange.bind(this);
		this.update = this.update.bind(this);*/
		this.getBackgroundHue = this.getBackgroundHue.bind(this);
		/*this.getBackgroundGradient = this.getBackgroundGradient.bind(this);
		this.getAlpha = this.getAlpha.bind(this);*/
		console.log('this.props.color: ', this.props.color);
		const color = tinycolor(this.props.color);
		console.log('COLOR: ', color);
		console.log('color.toHsv(): ', color.toHsv());

		this.state = {
			color: color.toHsv()
		};

		console.log('state; ', this.state);
	}

	componentWillReceiveProps(prevProps) {
		if(!this.props.color === prevProps.color) {
			console.log('RRRRR')

			const color = tinycolor(this.props.color);
			console.log('COLOR: ', color);
			console.log('color.toHsv(): ', color.toHsv());

			this.setState({
				color: color.toHsv()
			});
		}
	}

	/**
	 * Handle saturation value change
	 * @param {*} saturation
	 * @param {*} value
	 */
	handleSaturationValueChange(saturation, value) {
		const {h, a} = this.state.color;
		console.log('hue: ', h);
		console.log('saturation: ', saturation);
		console.log('value: ', value);


		this.update({h: h, s: saturation, v: value, a: a});
	}

	update(color) {
		console.log('update - color: ', color)
		this.setState({ color : color });
		const color2 = tinycolor(color);
		this.props.onChange(color2.toRgbString());
	}

	/**
	 * getBackgroundHue from state
	 */
	getBackgroundHue() {

		const color1 = tinycolor(this.props.color);


		console.log('getBackgroundHue - color: ', this.state);
		const {h} = color1.toHsv();

		console.log('h: ', h);

		const background = {
			h: h,
			s: 100,
			v: 100
		};

		console.log(background);

		const color = tinycolor(background);

		return color.toRgbString();
	}

	render() {
		const classes = cx('colorpicker', { 'with-opacity-slider' : this.props.opacitySlider })
		//const {h, s, v} = this.state.color;

		const color1 = tinycolor(this.props.color);


		console.log('color1: ', color1)

		const {s, v} = color1.toHsv();

		console.log('s and v : ', s, ' ', v)

		console.log('this.state: ', this.state);
		return (
			<div className={classes}>
				<Map
					x={s * 100}
					y={v * 100}
					max={100}
					className={'dark'}
					backgroundColor={this.getBackgroundHue()}
					onChange={this.handleSaturationValueChange}
				/>
			</div>
		);
	}
}

ColorPicker.defaultProps = {
	color : '#2cbfed'
};

export default ColorPicker;
