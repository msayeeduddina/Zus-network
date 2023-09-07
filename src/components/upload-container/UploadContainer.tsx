import { useDispatch } from 'react-redux'

import { IconUpload } from 'components/IconUpload'

import { uploadObjects } from 'store/object'

import stl from './UploadContainer.module.scss'

const UploadContainer = () => {
  const dispatch = useDispatch()

  return (
    <div className={stl.container}>
      <div className={stl.halfCol}>
        <IconUpload
          type="image"
          label="Upload image"
          changeFunc={e => dispatch(uploadObjects(e))}
        />
      </div>

      <div className={stl.halfCol}>
        <IconUpload
          type="document"
          label="Upload document"
          changeFunc={e => dispatch(uploadObjects(e))}
        />
      </div>
    </div>
  )
}

export default UploadContainer
