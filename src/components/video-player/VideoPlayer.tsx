import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import ContolBar from './ControlBar'
import LoadingSpinner from 'components/loading-spinner'

import LargePlayIcon from 'assets/svg/media/large-play.svg'
import LargePauseIcon from 'assets/svg/media/large-pause.svg'

import { downloadObject, addTempImageUrl, addVideoLoading } from 'store/object'
import { generateRandomString } from 'lib/utils'
import { usePlayer } from 'lib/hooks/usePlayer'

import stl from './VideoPlayer.module.scss'

const VideoPlayer = ({
  id = generateRandomString(),
  onPrev,
  onNext,
  poster,
  src: srcProp,
  controlBarColor = 'dark',
  fullScreen,
  setFullScreen,
  lookupHash,
  authTicket,
  isMobile,
  customClass,
}) => {
  const [thumbnail, setThumbnail] = useState('')
  const [vidDetails, setVidDetails] = useState({})
  const [playing, setPlaying] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)

  const videoRef = useRef(null)
  const { current: player } = videoRef
  const dispatch = useDispatch()
  const router = useRouter()
  const { play, stop } = usePlayer(vidDetails)

  const {
    tempImageUrls = {},
    videoLoadings = {},
    allFiles = [],
    // @ts-ignore
  } = useSelector(state => state.object)
  const isLoading = videoLoadings[id]
  const file = allFiles.find(file => file.lookup_hash === id)

  useEffect(() => {
    setVidDetails({
      remotePath: file?.path,
      lookupHash: lookupHash || file?.lookup_hash,
      mimeType: file?.mimetype || 'video/mp4',
      authTicket,
      id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const pausePlay = () => player.pause()

  const startPlay = () => {
    if (!isLoading) {
      if (isPlayerReady) {
        if (player.paused) player.play()
      } else if (player) {
        dispatch(addVideoLoading(id))
        play(player)
        setIsPlayerReady(true)
      }
    }
  }

  const stopPlay = () => {
    if (isPlayerReady) {
      stop(player)
      player.pause()
      player.currentTime = 0
      setPlaying(false)
    }
  }

  const handlePlayPause = () => {
    if (playing) {
      pausePlay()
      setPlaying(false)
    } else {
      startPlay()
      setPlaying(true)
    }
  }

  useEffect(() => {
    stopPlay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.file])

  useEffect(() => {
    if (player && player.currentTime === player.duration) stopPlay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player?.currentTime])

  const getThumbnail = useCallback(async () => {
    if (vidDetails) {
      if (tempImageUrls[id || lookupHash])
        setThumbnail(tempImageUrls[id || lookupHash])
      else {
        try {
          const filePath = allFiles.find(f => f.lookup_hash === id)?.path
          const data: any = await dispatch(
            downloadObject({
              path: filePath,
              authTicket,
              lookupHash,
              thumbnailOnly: true,
              getDetails: true,
            })
          )

          if (data) {
            setThumbnail(data.url)
            dispatch(addTempImageUrl(id || lookupHash, data.url))
          }
        } catch (error) {
          process.env.NODE_ENV === 'development' &&
            console.log(error, 'from getThumbnail')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, vidDetails])

  useEffect(() => {
    const fetchThumbnail = async () => await getThumbnail()
    fetchThumbnail()
  }, [getThumbnail])

  return (
    <div
      className={clsx(stl.wrapper, fullScreen && stl.fullScreen, customClass)}
      id={`container${id}`}
    >
      <video
        ref={videoRef}
        id={id}
        preload="metadata"
        src={srcProp}
        poster={thumbnail || poster}
        className={clsx(stl.videoPlayer)}
        onClick={handlePlayPause}
        controls={isMobile}
      />

      <button
        className={clsx(
          stl.largePlayBtn,
          !isLoading && isPlayerReady && stl.fadeUp
        )}
        onClick={handlePlayPause}
      >
        {!isLoading && (playing ? <LargePauseIcon /> : <LargePlayIcon />)}

        <LoadingSpinner isOpen={isLoading} />
      </button>
      <div className={stl.controlBarWrapper}>
        <ContolBar
          color={controlBarColor}
          onPrev={onPrev}
          onNext={onNext}
          fullScreen={fullScreen}
          setFullScreen={!isMobile && setFullScreen}
          handlePlayPause={handlePlayPause}
          isPlayerReady={isPlayerReady}
          playing={playing}
          player={player}
          videoId={id}
        />
      </div>
    </div>
  )
}

VideoPlayer.propTypes = {
  id: PropTypes.string,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  poster: PropTypes.string,
  src: PropTypes.string,
  fullScreen: PropTypes.bool,
  setFullScreen: PropTypes.func,
  controlBarColor: PropTypes.oneOf(['dark', 'light', 'transparent']),
  lookupHash: PropTypes.string,
  authTicket: PropTypes.string,
  isMobile: PropTypes.bool,
  customClass: PropTypes.string,
}

export default VideoPlayer
