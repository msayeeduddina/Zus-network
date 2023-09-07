import React from 'react'
import PropTypes from 'prop-types'
import styles from './InfoBox.module.scss'
import clsx from 'clsx'

const InfoBox = ({ children, className }) => {
  return (
    <div className={clsx(styles.infoBox, styles[className])}>{children}</div>
  )
}

InfoBox.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default InfoBox
