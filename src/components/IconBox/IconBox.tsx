import React from 'react'
import PropTypes from 'prop-types'
import styles from './IconBox.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const IconBox = ({ children, icon, url, iconSize }) => {
  const size = iconSize ? iconSize : '34'

  return (
    <div className={styles.iconBox}>
      <figure>
        <Image src={icon} height={size} width={size} alt="" />
      </figure>

      <div className={styles.label}>{children}</div>

      {url && <Link href={url}></Link>}
    </div>
  )
}

IconBox.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string.isRequired,
  url: PropTypes.string,
  iconSize: PropTypes.string,
}

export default IconBox
