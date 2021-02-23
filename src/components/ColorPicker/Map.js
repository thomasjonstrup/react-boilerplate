import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DraggableMixin from '../DraggableMixin';
import cx from 'classnames';
import { clamp } from '../../utils/utils';

class Map extends Component {

	constructor(props) {
		super(props);

		this.getPercentageValue = this.getPercentageValue.bind(this);
		this.updatePosition = this.updatePosition.bind(this);
		this.startUpdates = this.startUpdates.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.stopUpdates = this.stopUpdates.bind(this);
		this.getPosition = this.getPosition.bind(this);
		this.getBoundingRect = this.getBoundingRect.bind(this);
		this.getScaledValue = this.getScaledValue.bind(this);

		this.state = {
			active: false
		};
	}

	/**
	 * Update the position in the map
	 * @param {*} rect
	 * @param {*} clientX
	 * @param {*} clientY
	 */
	updatePosition(rect , clientX, clientY) {
		console.log('clientX: ', clientX);
		console.log('clientY: ', clientY);
		console.log('rect.left: ', rect.left)
		console.log('rect: ', rect);
		const clientRect = rect.getBoundingClientRect();
		console.log('tt: ', clientRect);
		const x = (clientX - clientRect.left) / clientRect.width;
		const y = (clientRect.bottom - clientY) / clientRect.height;

		this.props.onChange(
			this.getScaledValue(x),
			this.getScaledValue(y)
		);

	}

	/**
	 * Method for start update
	 * @param {*} e
	 * @return {void}
	 */
	startUpdates(e) {

		document.addEventListener('mousemove', this.handleUpdate);
		document.addEventListener('touchmove', this.handleUpdate);
		document.addEventListener('mouseup', this.stopUpdates);
		document.addEventListener('touchend', this.stopUpdates);

		e.preventDefault();
		console.log('StartUpdates E: ', e);
		const { x, y} = this.getPosition(e);

		//this.rect = this.rect.getBoundingClientRect();
		this.setState({ active: true});
		this.updatePosition(this.rect, x, y);
	}

	/**
	 * Handle the update for Draggable
	 * @param {*} e
	 */
	handleUpdate(e) {
		e.preventDefault();
		const { x, y } = this.getPosition(e);
		console.log('HANDLE UPDATE; ', e)
		this.updatePosition(this.rect, x, y);
	}

	/**
	 * Stop the updates (remove eventlisteners and set active to false)
	 */
	stopUpdates() {
		document.removeEventListener('mousemove', this.handleUpdate);
		document.removeEventListener('touchmove', this.handleUpdate);
		document.removeEventListener('mouseup', this.stopUpdates);
		document.removeEventListener('touchend', this.stopUpdates);

		this.setState({ active: false});
	}

	/**
	 * Get the position for touch and point
	 * @param {*} e
	 * @return {object}
	 */
	getPosition(e) {
		if(e.touches) {
			e = e.touches[0];
		}

		return {
			x: e.clientX,
			y: e.clientY,
		};
	}

	/**
	 * Get percentage from value
	 * @param {*} value
	 * @return {string}
	 */
	getPercentageValue(value) {
		return (value / this.props.max) * 100 + '%';
	}

	/**
	 * Get scaled from value
	 * @param {*} value
	 * @return {integer}
	 */
	getScaledValue(value) {
		return clamp(value, 0, 1) * this.props.max;
	}

	/**
	 * Get percentage from value
	 * @return {object}
	 */
	getBoundingRect() {
		//return ReactDOM.findDOMNode(this).getBoundingClientRect();
	}

	render() {
		const classes = cx('map', this.props.className, { active : this.state.active });
		const backgroundColor = this.props.backgroundColor;

		return (
			<div
				className={classes}
				onMouseDown={this.startUpdates}
				onTouchStart={this.startUpdates}
				ref={st => {
					this.rect = st;
				}}
			>
				<div className="background" style={{ backgroundColor }} />
				<div className="pointer" style={{
					left: this.getPercentageValue(this.props.x),
					bottom: this.getPercentageValue(this.props.y)
				}} />
			</div>
		);
	}
}

Map.propTypes = {
	x : PropTypes.number.isRequired,
	y : PropTypes.number.isRequired,
	backgroundColor : PropTypes.string,
	className : PropTypes.string
};

Map.defaultProps = {
	x : 0,
	y : 0,
	backgroundColor : 'transparent',
	className : ''
};

export default Map;