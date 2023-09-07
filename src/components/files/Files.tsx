import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Tile from 'components/tile'
import UploadContainer from 'components/upload-container'
import Button from 'components/Button'
import FilesViewer from 'components/files-viewer'
import CheckBox from 'components/checkbox'
import MultiOperationBar from 'components/multi-operation-bar'

import ImageIcon from 'assets/svg/image-icon.svg'
import PageIcon from 'assets/svg/page.svg'

import {
  uploadObjects,
  selectMultiFiles,
  setMultiSelection,
} from 'store/object'

import stl from './Files.module.scss'

const Files = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { file: fileQuery } = router.query

  // @ts-ignore
  const { allFiles = [] } = useSelector(state => state.object)
  const multiSelectionEnabled = useSelector(selectMultiFiles)

  const file =
    fileQuery &&
    allFiles.find(file => file.type === 'f' && file.lookup_hash === fileQuery)

  return allFiles.length > 0 ? (
    <div className={stl.filesWrapper}>
      <input
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        onChange={e => dispatch(uploadObjects(e))}
      />
      <input
        type="file"
        id="doc-upload"
        multiple
        accept={`application/pdf,
  application/vnd.ms-powerpoint,
  application/vnd.openxmlformats-officedocument.presentationml.presentation,
  application/vnd.ms-excel,
  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
  application/msword,
  application/vnd.openxmlformats-officedocument.wordprocessingml.document,
  text/csv, text/plain, .csv, .doc, .docx, .pdf, .ppt, .pptx, .txt, .xls, .xlsx`}
        onChange={e => dispatch(uploadObjects(e))}
      />

      <div className={stl.head}>
        <div className={stl.heading}>
          <CheckBox
            isChecked={multiSelectionEnabled}
            onClick={() => dispatch(setMultiSelection(!multiSelectionEnabled))}
          />
          <h2>All Files</h2>
        </div>

        <div className={stl.btnsBox}>
          <Button
            theme="outline"
            onClick={() => document.getElementById('image-upload').click()}
          >
            <ImageIcon /> Upload Image
          </Button>
          <Button
            theme="outline"
            onClick={() => document.getElementById('doc-upload').click()}
          >
            <PageIcon /> Upload Document
          </Button>
        </div>
      </div>

      <div className={stl.filesContainer} id="filesContainer">
        {allFiles.map((file, i) => (
          <Tile key={i} file={file} />
        ))}
      </div>

      <FilesViewer isOpen={!!file} files={allFiles} />

      <MultiOperationBar files={allFiles} />
    </div>
  ) : (
    <UploadContainer />
  )
}

export default Files
