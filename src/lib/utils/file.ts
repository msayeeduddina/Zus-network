import JSZip from 'jszip'

import { splitFileExtention } from './string'

export const openSaveFileDialog = file => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  // @ts-ignore
  a.style = 'display: none'

  a.href = file.url
  a.download = file.fileName
  a.click()
  window.URL.revokeObjectURL(file.url)
  document.body.removeChild(a)
}

export const checkBlobUrl = async url => {
  try {
    const res = await fetch(url)
    return res.status === 200
  } catch (e) {
    process.env.NODE_ENV === 'development' && console.log(e)
    return false
  }
}

export const downloadMultipleFiles = async files => {
  const zip = new JSZip()
  const promises = []
  for (const file of files)
    promises.push(
      fetch(file.url)
        .then(res => res.blob())
        .then(blob => {
          zip.file(file.fileName, blob)
        })
    )

  await Promise.all(promises)
  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const fileName = 'files.zip'
  openSaveFileDialog({ url, fileName })
}

export const arrayBufToFile = (arrayBuf, fileName, mimeType) =>
  new File([arrayBuf], fileName, { type: mimeType })

export const readChunk = (offset, chunkSize, file) =>
  new Promise((res, rej) => {
    const fileReader = new FileReader()
    const blob = file.slice(offset, chunkSize + offset)
    fileReader.onload = e => {
      const t = e.target
      if (t.error == null) {
        res({
          // @ts-ignore
          size: t.result.byteLength,
          // @ts-ignore
          buffer: new Uint8Array(t.result),
        })
      } else {
        rej(t.error)
      }
    }

    fileReader.readAsArrayBuffer(blob)
  })

const checkPathExists = (allFiles, path = '/') =>
  allFiles.find(f => f.path === path) !== undefined

export const getNewFile = (file, allFiles = []) => {
  const { name, extension = '' } = splitFileExtention(file.name)

  const getNewName = () => {
    if (checkPathExists(allFiles, `/${file.name}`)) {
      let i = 0
      while (
        checkPathExists(
          allFiles,
          `/${name} (copy)${i ? ` (${i})` : ''}.${extension}`
        )
      )
        i === 0 ? (i = 2) : i++

      return `${name} (copy)${i ? ` (${i})` : ''}.${extension || ''}`
    } else return file.name
  }

  return new File([file], getNewName(), { type: file.type })
}
