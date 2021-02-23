import React, { PureComponent } from 'react'
import cx from 'classnames';


class SwatchItem extends PureComponent {

	handleClick = e => {
		e.preventDefault();
		this.props.onClick(this.props.id);
	}

	render() {
		const classes = cx('swatch-item', { 'swatch-selected' : this.props.selected });
		const backgroundColor = this.props.color;

		return (
			<button
				className={classes}
				style={{ backgroundColor }}
				onClick={this.handleClick}
			/>
		);
	}
}


class ColorSwatch extends PureComponent {
	constructor(props) {
		super(props);

		this.buildSwatch = this.buildSwatch.bind(this)
	}

	buildSwatch = (color, i) => {
		console.log('COLOR :', color);
		return (
			<SwatchItem
				color={color}
				key={i}
				id={i}
				onClick={this.props.onSelect}
				selected={this.props.selected === i}
			/>
		);

	}

	render() {
		console.log('this.props.colors: ', this.props.colors)
		return (
			<div className="swatch">
				{this.props.colors.map(this.buildSwatch)}
			</div>
		);
	}
}

ColorSwatch.defaultProps = {
	colors: [],
	selected: null
};

export default ColorSwatch;