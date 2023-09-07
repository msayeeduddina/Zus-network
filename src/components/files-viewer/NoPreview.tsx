import { useEffect } from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Button'
import DownloadIcon from 'assets/svg/download.svg'

import stl from './NoPreview.module.scss'

const NoPreview = ({ setLoading, onClick }) => {
  useEffect(() => {
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={stl.container}>
      <p>No preview available for this file.</p>
      <Button onClick={onClick} theme="outline">
        <DownloadIcon />
        Download
      </Button>
    </div>
  )
}

NoPreview.propTypes = {
  setLoading: PropTypes.func,
  onClick: PropTypes.func,
  isOffline: PropTypes.bool,
}

export default NoPreview
