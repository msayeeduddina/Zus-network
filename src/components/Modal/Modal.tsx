import React from 'react'
import PropTypes from 'prop-types'
import styles from './Modal.module.scss'
import Image from 'next/image'

const Modal = ({ children, title, closeFunc }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h4>{title}</h4>

          {closeFunc && (
            <div className={styles.headerRight}>
              <button className={styles.close} onClick={closeFunc}>
                <Image
                  src="icons/icon-close.svg"
                  height="18"
                  width="18"
                  alt=""
                />
              </button>
            </div>
          )}
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  closeFunc: PropTypes.func,
}

export default Modal
