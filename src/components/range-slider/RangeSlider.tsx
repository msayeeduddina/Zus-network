import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import stl from './RangeSlider.module.scss'

const RangeSlider = ({
  min = 0,
  max = 100,
  value,
  step,
  style,
  onChange,
  disabled,
  name,
  variant = 'vult',
  customClass,
}) => (
  <div className={clsx(stl.rangerSliderContainer, customClass)}>
    <input
      onChange={onChange}
      step={step?.toString()}
      type="range"
      min={min?.toString()}
      max={max?.toString()}
      name={name}
      value={value?.toString()}
      className={clsx(
        stl.slider,
        disabled && stl.disabled,
        stl[variant + 'Variant']
      )}
      style={style}
      disabled={disabled}
    />
    {(variant === 'light' || variant === 'dark') && (
      <div
        style={{
          width: `${value * 0.99}%`,
          backgroundColor: variant === 'light' ? '#fff' : '#000',
        }}
        className={clsx(stl.progressBar, disabled && stl.disabled)}
      />
    )}
  </div>
)

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  variant: PropTypes.oneOf(['vult', 'light', 'dark']),
  customClass: PropTypes.string,
}

export default RangeSlider
