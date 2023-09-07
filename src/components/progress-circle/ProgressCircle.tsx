import PropTypes from 'prop-types'
import clsx from 'clsx'

import stl from './ProgressCircle.module.scss'

const ProgressCircle = ({
  size,
  strokeWidth,
  progress,
  color,
  rotate,
  loading,
  customClass,
}) => {
  const radius = (size - strokeWidth) / 2
  const viewBox = `0 0 ${size} ${size}`
  const dashArray = radius * Math.PI * 2
  const dashOffset = dashArray - (dashArray * progress) / 100

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={clsx(loading && stl.loading, customClass)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <circle
        className={stl.circleBackground}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        className={stl.circleProgress}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
        }}
      />
    </svg>
  )
}

ProgressCircle.defaultProps = {
  color: stl.primaryblue,
  size: 100,
  progress: 75,
  strokeWidth: 10,
}

ProgressCircle.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  progress: PropTypes.number,
  strokeWidth: PropTypes.number,
  rotate: PropTypes.number,
  loading: PropTypes.bool,
  customClass: PropTypes.string,
}

export default ProgressCircle
