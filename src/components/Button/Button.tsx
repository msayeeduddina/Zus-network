import React from 'react'
import styles from './Button.module.scss'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const Button = ({
  id,
  name,
  children,
  onClick,
  size,
  theme = 'default',
  fullWidth,
  disabled,
  disableBg,
  color = 'blue',
  customClass,
}) => {
  const colorClasses = {
    [styles.boltOutline]: color === 'boltOutline',
  }
  return (
    <>
      <button
        id={id}
        type="submit"
        className={clsx(
          styles.btn,
          colorClasses,
          styles[size],
          styles[theme],
          disableBg && styles.transparent,
          fullWidth && styles.fullWidth,
          customClass
        )}
        disabled={disabled}
        onClick={onClick}
        name={name}
      >
        {children}
      </button>
    </>
  )
}

Button.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'bolt', 'vult', 'white', 'outline']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  disableBg: PropTypes.bool,
  customClass: PropTypes.string,
}

export default Button
