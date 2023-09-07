import React from 'react'
import PropTypes from 'prop-types'
import styles from './ProgressBar.module.scss'
import clsx from 'clsx'

const ProgressBar = ({ theme, value, labelLeft, labelRight }) => {
  return (
    <div className={clsx(styles.bg, styles[theme])}>
      <div className={styles.progress} style={{ width: `${value}%` }}></div>
      {labelLeft && <span className={styles.labelLeft}>{labelLeft}</span>}
      {labelRight && <span className={styles.labelRight}>{labelRight}</span>}
    </div>
  )
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  theme: PropTypes.string,
  labelLeft: PropTypes.string,
  labelRight: PropTypes.string,
}

export default ProgressBar
