import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import mime from 'mime'

import FullModal from 'components/full-modal'
import VideoPlayer from 'components/video-player'
import BackwardArrowIcon from 'assets/svg/backward-arrow.svg'
import ForwardArrowIcon from 'assets/svg/forward-arrow.svg'
import EnterFullScreenIcon from 'assets/svg/enter-full-screen.svg'
import ExitFullScreenIcon from 'assets/svg/exit-full-screen.svg'
import PlusIcon from 'assets/svg/plus.svg'
import MinusIcon from 'assets/svg/minus.svg'
import ZoomOutIcon from 'assets/svg/zoom-out.svg'
import RetryIcon from 'assets/svg/refresh.svg'
import CrossIcon from 'assets/svg/close-button.svg'

import { checkBlobUrl, removeDuplicates } from 'lib/utils'

import {
  downloadObject,
  getPathUrl,
  stopPlay,
  addTempImageUrl,
} from 'store/object'

import stl from './FilesViewer.module.scss'

const FilesViewer = ({
  isOpen,
  close,
  files: filesProp = [],
  customClass,
  baseURL = '/vult',
}) => {
  const [cFile, setCFile] = useState(null)
  const [resolution, setResolution] = useState([0, 0])
  const [src, setSrc] = useState('')
  const [loading, setLoading] = useState(true)
  const [fullScreen, setFullScreen] = useState(false)
  const [isShowRetryButton, setIsShowRetryButton] = useState(false)
  const [docUrl, setDocUrl] = useState('')
  const [docUrls, setDocUrls] = useState([])

  const router = useRouter()
  const dispatch = useDispatch()
  const imageRef = useRef()

  // @ts-ignore
  const { tempImageUrls = {} } = useSelector(state => state.object)

  const files =
    removeDuplicates(
      filesProp.filter(file => file.type === 'f'),
      'lookup_hash'
    ) || []
  const parentUrl = useSelector(
    getPathUrl({ path: cFile?.parent_path, baseURL })
  )

  useEffect(() => {
    setCFile(files.find(file => file.lookup_hash === router.query.file))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.file])

  const isImage = cFile && cFile.mimetype.includes('image')
  const isVideo = cFile?.mimetype?.includes('video')
  const otherFile = !isImage && !isVideo

  const closeViewer = useCallback(async () => {
    setSrc('')
    setDocUrl('')
    close ? close() : router.push(parentUrl)
    if (isVideo) {
      const video = document.querySelector('video')
      video && video.remove()
      dispatch(stopPlay())
    }
  }, [close, dispatch, isVideo, parentUrl, router])

  const onNext = useCallback(async () => {
    setSrc('')
    setDocUrl('')
    setLoading(true)
    setResolution([0, 0])
    const nextFile = files[files.indexOf(cFile) + 1]

    nextFile &&
      router.push({ query: { ...router.query, file: nextFile.lookup_hash } })
    files.indexOf(cFile) === files.length - 1 &&
      router.push({
        query: { ...router.query, file: files[0].lookup_hash },
      })

    nextFile && setCFile(nextFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cFile, router])

  const onPrev = useCallback(() => {
    setSrc('')
    setDocUrl('')
    setLoading(true)
    setResolution([0, 0])
    const prevFile = files[files.indexOf(cFile) - 1]

    prevFile &&
      router.push({ query: { ...router.query, file: prevFile.lookup_hash } })
    files.indexOf(cFile) === 0 &&
      router.push({
        query: { ...router.query, file: files[files.length - 1].lookup_hash },
      })

    prevFile && setCFile(prevFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cFile, router])

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = e =>
        // @ts-ignore
        (e.keyCode === 37 && files.length > 1 && onPrev()) ||
        (e.keyCode === 39 && files.length > 1 && onNext())

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, files.length, onNext, onPrev])

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = e =>
        // @ts-ignore
        (e.keyCode === 70 && setFullScreen(!fullScreen)) ||
        (e.keyCode === 27 &&
          (fullScreen ? setFullScreen(false) : closeViewer()))

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeViewer, fullScreen])

  const handleDownload = useCallback(
    async getDetails => {
      if (cFile) {
        const response = await dispatch(
          downloadObject({
            path: cFile?.path,
            fileName: cFile?.name,
            getDetails,
          })
        )

        process.env.NODE_ENV === 'development' &&
          console.log('file download response:', response)
        return response
      }
    },
    [cFile, dispatch]
  )

  const handleDoc = useCallback(async () => {
    const cachedDocUrl = docUrls.find(doc => doc[cFile?.lookup_hash])

    if (cachedDocUrl) {
      setDocUrl(cachedDocUrl[cFile?.lookup_hash])
      setLoading(false)
    } else {
      const { data }: any = await handleDownload(true)
      if (data?.url) {
        const type = mime.getType(data?.fileName)

        const rawFile = await (await fetch(data?.url)).blob()
        const blobWithActualType = new Blob([rawFile], { type })
        const blobUrl = URL.createObjectURL(blobWithActualType)

        setDocUrl(blobUrl || '')
        setDocUrls([...docUrls, { [cFile?.lookup_hash]: blobUrl }])
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, cFile, dispatch, handleDownload])

  const getImageUrl = useCallback(async () => {
    if (isOpen) {
      if (isImage) {
        setLoading(true)
        setIsShowRetryButton(false)

        try {
          if (tempImageUrls[cFile.lookup_hash]) {
            checkBlobUrl(tempImageUrls[cFile.lookup_hash]).then(res =>
              res
                ? setSrc(tempImageUrls[cFile.lookup_hash])
                : dispatch(addTempImageUrl(cFile.lookup_hash, ''))
            )
            setLoading(false)
          } else {
            const { data }: any = await dispatch(
              downloadObject({
                path: cFile?.path,
                fileName: cFile?.name,
                getDetails: true,
              })
            )

            if (data.url) {
              await checkBlobUrl(data.url).then(res => {
                if (res) {
                  setSrc(data.url)
                  dispatch(addTempImageUrl(cFile.lookup_hash, data.url))
                } else setIsShowRetryButton(true)
              })
            } else setIsShowRetryButton(true)

            setLoading(false)
          }

          setTimeout(() => {
            setResolution([
              // @ts-ignore
              imageRef.current ? imageRef.current.naturalWidth : 0,
              // @ts-ignore
              imageRef.current ? imageRef.current.naturalHeight : 0,
            ])
          }, 100)
        } catch (error) {
          setLoading(false)
          process.env.NODE_ENV === 'development' && console.log(error)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, cFile, tempImageUrls[cFile?.lookup_hash], dispatch])

  useEffect(() => {
    const fetchUrl = async () => {
      if (isImage) {
        await getImageUrl()
      } else handleDoc()
    }
    cFile && fetchUrl()
  }, [cFile, getImageUrl, handleDoc, isImage])

  const handleZoom = (e, type) => {
    e.stopPropagation()
    const image = imageRef.current

    if (type === 'plus' && image)
      // @ts-ignore
      image.style.scale = image.style.scale ? image.style.scale * 1.1 : 1.1
    else if (type === 'minus')
      // @ts-ignore
      image.style.scale = image.style.scale ? image.style.scale * 0.9 : 0.9
    // @ts-ignore
    else if (type === 'reset') image.style.scale = 1
  }

  return (
    <FullModal
      isOpen={isOpen}
      close={closeViewer}
      closeOnClickAway={false}
      customClass={stl.wrapper}
    >
      <div
        className={clsx(
          stl.container,
          fullScreen && stl.fullScreen,
          customClass
        )}
      >
        <button className={stl.closeButton} onClick={closeViewer}>
          <CrossIcon />
        </button>

        <section className={stl.content}>
          <button
            className={clsx(stl.swipeButton, stl.left)}
            disabled={files.length === 1}
            onClick={onPrev}
          >
            <span>
              <BackwardArrowIcon />
            </span>
          </button>

          <div className={stl.previewer}>
            {isImage && (
              <>
                <div
                  className={clsx(
                    stl.imageViewer,
                    fullScreen && stl.fullScreenImage
                  )}
                >
                  {loading ? (
                    <div className={stl.miniSpinner} />
                  ) : src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img ref={imageRef} src={src} alt={cFile?.name} />
                  ) : (
                    <p>Sorry, we couldn&apos;t load your image.</p>
                  )}
                </div>

                <div className={clsx(stl.controls)}>
                  <button disabled={!src} onClick={e => handleZoom(e, 'minus')}>
                    <MinusIcon />
                  </button>
                  <button disabled={!src} onClick={e => handleZoom(e, 'reset')}>
                    <ZoomOutIcon />
                  </button>
                  <button disabled={!src} onClick={e => handleZoom(e, 'plus')}>
                    <PlusIcon />
                  </button>
                  {isShowRetryButton && (
                    <button
                      className={stl.retryButton}
                      onClick={getImageUrl}
                      disabled={loading}
                    >
                      <RetryIcon />
                    </button>
                  )}
                  <button
                    disabled={!src}
                    onClick={() => setFullScreen(!fullScreen)}
                  >
                    {fullScreen ? (
                      <ExitFullScreenIcon />
                    ) : (
                      <EnterFullScreenIcon />
                    )}
                  </button>
                </div>
              </>
            )}

            {isVideo && (
              <VideoPlayer
                id={cFile?.lookup_hash}
                customClass={stl.videoPlayer}
                fullScreen={fullScreen}
                setFullScreen={setFullScreen}
              />
            )}

            {otherFile &&
              (loading ? (
                <div className={stl.miniSpinner} />
              ) : (
                docUrl && (
                  <iframe
                    src={docUrl}
                    title={cFile?.name}
                    className={clsx(
                      stl.docViewer,
                      fullScreen && stl.fullScreenDoc
                    )}
                  />
                )
              ))}
          </div>

          <button
            className={clsx(stl.swipeButton, stl.right)}
            disabled={files.length === 1}
            onClick={onNext}
          >
            <span>
              <ForwardArrowIcon />
            </span>
          </button>
        </section>

        <footer className={stl.footer}>
          <h3>{cFile?.name}</h3>
          <div className={stl.spaceBetween}>
            {isImage && <p>Image may subject to copyright</p>}
            {cFile?.senderName && (
              <p>
                Shared By: <span>{cFile?.senderName}</span>
              </p>
            )}
          </div>
          {!fullScreen && (
            <div className={stl.metaContainer}>
              <div className={stl.meta}>
                {isImage && (
                  <>
                    <span>{`${resolution[0]} x ${resolution[1]}`}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </footer>
      </div>
    </FullModal>
  )
}

FilesViewer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  files: PropTypes.array,
  customClass: PropTypes.string,
  baseURL: PropTypes.string,
}

export default FilesViewer
