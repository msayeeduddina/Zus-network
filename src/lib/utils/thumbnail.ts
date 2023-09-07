import { arrayBufToFile } from './file'

export const getThumbnailSize = (elm, max = 400) => {
  let maxWidth = max
  let maxHeight = max
  let ratio = 0
  let width = elm.width || elm.videoWidth
  let height = elm.height || elm.videoHeight

  if (width > maxWidth) {
    ratio = maxWidth / width
    height = height * ratio
    width = width * ratio
  }
  if (height > maxHeight) {
    ratio = maxHeight / height
    width = width * ratio
    height = height * ratio
  }

  return { width, height }
}

export const getThumbnailBuf = elm => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const { width, height } = getThumbnailSize(elm)
  canvas.width = width
  canvas.height = height
  ctx.drawImage(elm, 0, 0, width, height)

  const dataURL = canvas.toDataURL('image/jpeg')
  const data = dataURL.replace(/^data:image\/\w+;base64,/, '')
  return Buffer.from(data, 'base64')
}

export const getThumbnailforVideo = async videoUrl => {
  const video = document.createElement('video')
  const canvas = document.createElement('canvas')

  await new Promise(resolve => {
    video.addEventListener(
      'loadedmetadata',
      () => (video.currentTime = video.duration * 0.25)
    )
    // @ts-ignore
    video.addEventListener('seeked', () => resolve())
    video.src = videoUrl
  })

  const { width, height } = getThumbnailSize(video)
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataURL = canvas.toDataURL('image/png')
  return dataURL
}

export const getThumbnailBytes = async file => {
  const notSupportedTypes = ['video/avi', 'video/x-ms-wmv', 'video/x-msvideo'] // https://github.com/ffmpegwasm/ffmpeg.wasm/issues/202 can resolve this later

  const isImage = file?.type.startsWith('image/')
  const isVideo = file?.type.startsWith('video/')

  const fileUrl = URL.createObjectURL(file)

  if (isImage) {
    const image = new Image()
    image.src = fileUrl

    const buf = await new Promise(resolve => {
      image.onload = () => resolve(getThumbnailBuf(image))
    })

    return buf
  } else if (isVideo) {
    if (notSupportedTypes.includes(file.type)) return Promise.resolve(null)

    const thumbnailUrl = await getThumbnailforVideo(fileUrl)
    const image = new Image()
    image.src = thumbnailUrl

    const buf = await new Promise(resolve => {
      image.onload = () => resolve(getThumbnailBuf(image))
    })

    return buf
  }

  return Promise.resolve(null)
}
