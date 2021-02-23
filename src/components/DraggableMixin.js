import React from 'react';
import ReactDOM from 'react-dom';
import { clamp } from '../utils/utils';
import propTypes from 'prop-types';

function noop() {}

const getDocument = element => element.ownerDocument;

const DraggableMixin = {

	/**
	 * Method for defaultprops
	 * @return {object}
	 */
	getDefaultProps() {
		return {
			onChange: noop,
			max: 1
		};
	},

	/**
	 * Method for inital state
	 * @return {object}
	 */
	getInitialState() {
		return {
			active: false
		};
	},

	componentDidMount() {
		this.document = getDocument(ReactDOM.findDOMNode(this));
		this.rect = this.getBoundingRect();
	},

	/**
	 * Method for start update
	 * @param {*} e
	 * @return {void}
	 */
	startUpdates(e) {
		const { document } = this;

		document.addEventListener('mousemove', this.handleUpdate);
		document.addEventListener('touchmove', this.handleUpdate);
		document.addEventListener('mouseup', this.stopUpdates);
		document.addEventListener('touchend', this.stopUpdates);

		e.preventDefault();
		const { x, y} = this.getPosition(e);

		this.rect = this.getBoundingRect();
		this.setState({ active: true});
		this.updatePosition(this.react, x, y);
	},

	/**
	 * Handle the update for Draggable
	 * @param {*} e
	 */
	handleUpdate(e) {
		e.preventDefault();
		const { x, y } = this.getPosition(e);
		this.updatePosition(this.rect, x, y);
	},

	/**
	 * Stop the updates (remove eventlisteners and set active to false)
	 */
	stopUpdates() {
		const { document } = this;

		document.removeEventListener('mousemove', this.handleUpdate);
		document.removeEventListener('touchmove', this.handleUpdate);
		document.removeEventListener('mouseup', this.stopUpdates);
		document.removeEventListener('touchend', this.stopUpdates);

		this.setState({ active: false});
	},

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
	},

	/**
	 * Get percentage from value
	 * @param {*} value
	 * @return {string}
	 */
	getPercentageValue(value) {
		return (value / this.props.max) * 100 + '%';
	},

	/**
	 * Get scaled from value
	 * @param {*} value
	 * @return {integer}
	 */
	getScaledValue(value) {
		return clamp(value, 0, 1) * this.props.max;
	},

	/**
	 * Get percentage from value
	 * @return {object}
	 */
	getBoundingRect() {
		return ReactDOM.findDOMNode(this).getBoundingClientRect();
	},

};

DraggableMixin.propTypes = {
	onChange: propTypes.func.isrequired,
	max: propTypes.number
};

DraggableMixin.defaultProps = {

};

export default DraggableMixin;