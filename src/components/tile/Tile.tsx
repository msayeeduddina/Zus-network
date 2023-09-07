import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'

import CheckBox from 'components/checkbox'
import ProgressCircle from 'components/progress-circle'

import DocumentIcon from 'assets/svg/document.svg'
import ViewFileIcon from 'assets/svg/view-file.svg'
import DownloadIcon from 'assets/svg/download.svg'

import { bytesToString } from 'lib/utils'
import { handleShiftKeySelection } from './index'

import {
  downloadObject,
  selectMultiFiles,
  selectMultiFilesList,
  addSelectedFiles,
  setMultiSelection,
  removeSelectedFiles,
} from 'store/object'

import stl from './Tile.module.scss'

const Tile = ({ file, customClass }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const multiSelectionEnabled = useSelector(selectMultiFiles)
  const selectedFiles = useSelector(selectMultiFilesList)
  const isSelected = selectedFiles.includes(file.lookup_hash)
  // @ts-ignore
  const { downloadLoadings = [] } = useSelector(state => state.object)
  const downloadInfo =
    downloadLoadings.find(item => item.fileId === file.lookup_hash) || {}

  const handleDownload = async () => {
    await dispatch(
      downloadObject({
        path: file?.path || '',
        lookupHash: file?.lookup_hash || '',
        fileName: file?.name || '',
      })
    )
  }

  const handleViewFile = () =>
    router.push({ query: { ...router.query, file: file?.lookup_hash || '' } })

  const handleMultiSelection = (e, select) => {
    const modalNotOpened = !document.getElementById('modal').hasChildNodes()

    if (modalNotOpened) {
      if (e.ctrlKey || e.metaKey || (select && !isSelected))
        dispatch(setMultiSelection(true)) &&
          dispatch(addSelectedFiles(file.lookup_hash))
    }

    if (e.shiftKey)
      multiSelectionEnabled &&
        handleShiftKeySelection(
          file.lookup_hash,
          selectedFiles,
          dispatch,
          addSelectedFiles,
          removeSelectedFiles
        )

    if (multiSelectionEnabled)
      isSelected
        ? dispatch(removeSelectedFiles(file.lookup_hash))
        : dispatch(addSelectedFiles(file.lookup_hash))
    else () => {}
  }

  return (
    <div
      id={file.lookup_hash}
      className={clsx(
        stl.tile,
        multiSelectionEnabled && stl.selectable,
        customClass
      )}
      // @ts-ignore
      onClick={handleMultiSelection}
    >
      <div className={stl.left}>
        {multiSelectionEnabled && (
          <CheckBox isChecked={isSelected} customClass={stl.checkBox} />
        )}
        <div className={stl.icon}>
          {downloadInfo.isDownloading ? (
            <div className={stl.downloadIndicator}>
              <ProgressCircle
                size={30}
                strokeWidth={4}
                progress={downloadInfo.progress || 0}
                loading={!downloadInfo.progress}
                color="blue"
                rotate={90}
              />
              <DownloadIcon className={stl.downloadIcon} />
            </div>
          ) : (
            <DocumentIcon />
          )}
        </div>
        <p className={stl.fileName}>{file.name}</p>
      </div>

      <div className={stl.right}>
        <span className={stl.size}>{bytesToString(file.size)}</span>
        <button className={stl.btn} onClick={handleViewFile}>
          <ViewFileIcon /> View
        </button>
        <button className={stl.btn} onClick={handleDownload}>
          <DownloadIcon /> Download
        </button>
      </div>
    </div>
  )
}

Tile.propTypes = {
  file: PropTypes.object.isRequired,
  customClass: PropTypes.string,
}

export default Tile
