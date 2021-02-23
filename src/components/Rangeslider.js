import React, { Component } from 'react';
import propTypes from 'prop-types';
import cx from 'classnames';

import { capitalize, clamp } from '../utils/utils.js';

/**
 * Predefined constants
 * @Type {Object}
 */
const constants = {
	orientation: {
		horizontal: {
			dimension: 'width',
			direction: 'left',
			reverseDirection: 'right',
			coordinate: 'x'
		},
		vertical: {
			dimension: 'height',
			direction: 'top',
			reverseDirection: 'bottom',
			coordinate: 'y'
		}
	}
};

class Rangeslider extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			active: false,
			limit: 0,
			grab: 0
		};

		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.handleStart = this.handleStart.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.renderLabels = this.renderLabels.bind(this);
		this.handleFormat = this.handleFormat.bind(this);
		this.getPositionFromValue = this.getPositionFromValue.bind(this);
		this.getValueFromPosition = this.getValueFromPosition.bind(this);
		this.coordinates = this.coordinates.bind(this);
		this.position = this.position.bind(this);
	}

	componentDidMount() {
		this.handleUpdate();
	}

	/**
	 * Update slider state on change
	 * @return {void}
	 */
	handleUpdate = () => {
		if(!this.slider) {
			// for shallow rendering
			return;
		}

		const { orientation } = this.props;
		const dimension = capitalize(constants.orientation[orientation].dimension);
		const sliderPos = this.slider[`offset${dimension}`];
		const handlePos = this.handle[`offset${dimension}`];

		this.setState({
			limit: sliderPos - handlePos,
			grab: handlePos / 2
		});
	}

	handleStart = e => {
		const { onChangeStart } = this.props;
		document.addEventListener('mousemove', this.handleDrag);
		document.addEventListener('mouseup', this.handleEnd);

		this.setState(
			{
				active: true
			},
			() => {
				onChangeStart && onChangeStart(e);
			}
		);
	}

	/**
	 * Handle drag/mousemove event
	 * @param  {Object} e - Event object
	 * @return {void}
	 */
	handleDrag = e => {
		e.stopPropagation();
		const { onChange } = this.props;
		const { target: { className, classList, dataset } } = e;
		if(!onChange || className === 'rangeslider_labels') return;

		let value = this.position(e);

		if( classList && classList.contains('rangeslier__label-item') && dataset.value) {
			value = parseFloat(dataset.value);
		}

		onChange && onChange(value, e);
	}

	/**
	 * Format label/tooltip value
	 * @param  {Number} - value
	 * @return {Formatted Number}
	 */
	handleFormat = value => {
		const { format } = this.props;

		return format ? format(value) : value;
	};

	/**
	 * Detach event listeners to mousemove/mouseup events
	 * @return {void}
	 */
	handleEnd = e => {
		const { onChangeComplete } = this.props;

		this.setState(
			{
				active: false
			},
			() => {
				onChangeComplete && onChangeComplete(e);
			}
		);

		document.removeEventListener('mousemove', this.handleDrag);
		document.removeEventListener('mouseup', this.handleEnd);
	}

	/**
	 * Support for key events on the slider handle
	 * @param  {Object} e - Event object
	 * @return {void}
	 */
	handleKeyDown = e => {
		e.preventDefault();
		const { keyCode } = e;
		const { value, min, max, step, onChange } = this.props;
		let sliderValue;

		switch (keyCode) {
		case 38:
		case 39:
			sliderValue = value + step > max ? max : value + step;
			onChange && onChange(sliderValue, e);
			break;

		case 37:
		case 40:
			sliderValue = value - step < min ? min : value - step;
			onChange && onChange(sliderValue, e);
			break;
		}
	}

	/**
	 * Calculate position of slider based on its value
	 * @param  {number} value - Current value of slider
	 * @return {position} pos - Calculated position of slider based on value
	 */
	getPositionFromValue = value => {
		const { limit } = this.state;
		const { min, max } = this.props;
		const diffMaxMin = max - min;
		const diffValMin = value - min;
		const percetage = diffValMin / diffMaxMin;
		const pos = Math.round(percetage * limit);

		return pos;
	}

	/**
	 * Translate position of slider to slider value
	 * @param  {number} pos - Current position/coordinates of slider
	 * @return {number} value - Slider value
	 */
	getValueFromPosition = pos => {
		const { limit } = this.state;
		const { orientation, min, max, step} = this.props;
		const percentage = clamp(pos, 0, limit) / (limit || 1);
		const baseVal = step * Math.round(percentage * (max -  min) / step);
		const value = orientation === 'horizontal' ? baseVal + min : max - baseVal;

		return clamp(value, min, max);
	}

	/**
	 * Calculate position of slider based on value
	 * @param  {Object} e - Event object
	 * @return {number} value - Slider value
	 */
	position = e => {
		const { grab } = this.state;
		const { orientation, reverse } = this.props;
		const node = this.slider;

		const coordinateStyle = constants.orientation[orientation].coordinate;
		const directionStyle = reverse
			? constants.orientation[orientation].reverseDirection
			: constants.orientation[orientation].direction;

		const clientCoordinateStyle = `client${capitalize(coordinateStyle)}`;
		const coordinate = !e.touches
			? e[clientCoordinateStyle]
			: e.touches[0][clientCoordinateStyle];
		const direction = node.getBoundingClientRect()[directionStyle];
		const pos = reverse
			? direction - coordinate - grab
			: coordinate - direction - grab;
		const value = this.getValueFromPosition(pos);

		return value;
	}

	/**
	 * Grab coordinates of slider
	 * @param  {Object} pos - Position object
	 * @return {Object} - Slider fill/handle coordinates
	 */
	coordinates = pos => {
		const { limit, grab } = this.state;
		const { orientation } = this.props;
		const value = this.getValueFromPosition(pos);
		const position = this.getPositionFromValue(value);
		const handlePos = orientation === 'horizontal' ? position + grab : position;
		const fillPos = orientation === 'horizontal'
			? handlePos
			: limit - handlePos;

		return {
			fill: fillPos,
			handle: handlePos,
			label: handlePos
		};
	}

	renderLabels = labels => (
		<ul
			ref={sl => {
				this.labels = sl;
			}}
			className={'rangeslider__labels'}
		>
			{labels}
		</ul>
	)

	render() {
		const {
			value,
			orientation,
			className,
			tooltip,
			reverse,
			labels,
			min,
			max,
			handleLabel
		} = this.props;

		const { active } = this.state;

		const dimension = constants.orientation[orientation].dimension;
		const direction = reverse
			? constants.orientation[orientation].reverseDirection
			: constants.orientation[orientation].direction;

		const position = this.getPositionFromValue(value);
		const coords = this.coordinates(position);
		const fillStyle = { [dimension]: `${coords.fill}px` };
		const handleStyle = { [direction]: `${coords.handle}px` };
		let showToolTip = tooltip && active;

		let labelItems = [];
		let labelKeys = Object.keys(labels);

		if (labelKeys.length > 0) {
			labelKeys = labelKeys.sort((a, b) => (reverse ? a - b : b - a));

			for (let key of labelKeys) {
				const labelPosition = this.getPositionFromValue(key);
				const labelCoords = this.coordinates(labelPosition);
				const labelStyle = { [direction]: `${labelCoords.label}px` };

				labelItems.push(
					<li
						key={key}
						className={cx('rangeslider__label-item')}
						data-value={key}
						onMouseDown={this.handleDrag}
						onTouchStart={this.handleStart}
						onTouchEnd={this.handleEnd}
						style={labelStyle}
					>
						{this.props.labels[key]}
					</li>
				);
			}
		}

		return (
			<div
				ref={s => {
					this.slider = s;
				}}
				className={cx(
					'rangeslider',
					`rangeslider-${orientation}`,
					{ 'rangeslider-reverse': reverse },
					className
				)}
				onMouseDown={this.handleDrag}
				onMouseUp={this.handleEnd}
				onTouchStart={this.handleStart}
				onTouchEnd={this.handleEnd}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-orientation={orientation}
			>
				<div className="rangeslider__fill" style={fillStyle}/>
				<div
					ref={sh => {
						this.handle = sh;
					}}
					className="rangeslider__handle"
					onMouseDown={this.handleStart}
					onTouchMove={this.handleDrag}
					onTouchEnd={this.handleEnd}
					onKeyDown={this.handleKeyDown}
					style={handleStyle}
					tabIndex={0}
				>
					{showToolTip
						? <div
							ref={st => {
								this.tooltip = st;
							}}
							className='rangeslider__handle-tooltip'
						>
							<span>{this.handleFormat(value)}</span>
						</div>
						: null}
					<div className="rangeslider__handle-label">{handleLabel}</div>
				</div>
				{labels ? this.renderLabels(labelItems) : null}
			</div>
		);
	}
}

Rangeslider.propTypes = {
	min: propTypes.number,
	max: propTypes.number,
	step: propTypes.number,
	value: propTypes.number,
	orientation: propTypes.string,
	tooltip: propTypes.bool,
	reverse: propTypes.bool,
	labels: propTypes.object,
	handleLabel: propTypes.string,
	format: propTypes.func,
	onChangeStart: propTypes.func,
	onChange: propTypes.func,
	onChangeComplete: propTypes.func
};

Rangeslider.defaultProps = {
	min: 0,
	max: 100,
	step: 1,
	value: 0,
	orientation: 'horizontal',
	tooltip: false,
	reverse: false,
	labels: {},
	handleLabel: ''
};

export default Rangeslider;
