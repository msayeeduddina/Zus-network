import React from 'react'
import styles from './ContentBox.module.scss'
import PropTypes from 'prop-types'

const ContentBox = ({ children }) => {
  return <div className={styles.contentBox}>{children}</div>
}

ContentBox.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ContentBox
