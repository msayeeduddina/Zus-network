import React from 'react'
import PropTypes from 'prop-types'
import styles from './IconUpload.module.scss'
import Image from 'next/image'

const IconUpload = ({ type, changeFunc, label }) => {
  const inputType =
    type === 'image'
      ? 'image/*'
      : `application/pdf,
  application/vnd.ms-powerpoint,
  application/vnd.openxmlformats-officedocument.presentationml.presentation,
  application/vnd.ms-excel,
  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
  application/msword,
  application/vnd.openxmlformats-officedocument.wordprocessingml.document,
  text/csv, text/plain, .csv, .doc, .docx, .pdf, .ppt, .pptx, .txt, .xls, .xlsx`

  return (
    <div className={styles.wrapper}>
      <figure>
        {type === 'image' ? (
          <Image src="/Doc.png" width={65} height={65} alt="" />
        ) : (
          <Image
            src="icons/upload-document.svg"
            height={56}
            width={56}
            alt=""
          />
        )}
      </figure>

      <h6>{label}</h6>

      <div className={styles.field}>
        <input type="file" multiple accept={inputType} onChange={changeFunc} />

        <div className={styles.btn}>
          <Image src="icons/icon-upload.svg" height={20} width={20} alt="" />
          Upload
        </div>
      </div>
    </div>
  )
}

IconUpload.propTypes = {
  type: PropTypes.oneOf(['image', 'document']).isRequired,
  label: PropTypes.string.isRequired,
  changeFunc: PropTypes.func,
}

export default IconUpload
