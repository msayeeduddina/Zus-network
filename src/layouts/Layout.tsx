import Head from 'next/head'
import PropTypes from 'prop-types'

import styles from './Layout.module.scss'

const Layout = ({ children }) => {
  return (
    <div className={styles.siteWrapper}>
      <Head>
        <title>Züs Example Webapp</title>
      </Head>
      <div className={styles.contentWrapper}>{children}</div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
