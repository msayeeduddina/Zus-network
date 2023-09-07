import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import RangeSlider from 'components/range-slider'

import PlayIcon from 'assets/svg/media/play.svg'
import PauseIcon from 'assets/svg/media/pause.svg'
import ForwardIcon from 'assets/svg/media/forward.svg'
import BackwardIcon from 'assets/svg/media/backward.svg'
import VolumeIcon from 'assets/svg/media/volume.svg'
import MutedVolumeIcon from 'assets/svg/media/volume-off.svg'
import SettingsIcon from 'assets/svg/media/settings.svg'
import FullScreenIcon from 'assets/svg/media/full-screen.svg'
import ExitFullScreenIcon from 'assets/svg/media/exit-full-screen.svg'
import PlaybackSpeedIcon from 'assets/svg/media/playback-speed.svg'
import SpinnerIcon from 'assets/svg/small-spinner.svg'
import RightArrowIcon from 'assets/svg/right-arrow.svg'

import { useOnClickOutside } from 'lib/hooks'

import stl from './VideoPlayer.module.scss'

const ContolBar = ({
  color = 'dark',
  onPrev,
  onNext,
  videoId,
  fullScreen,
  setFullScreen,
  handlePlayPause,
  isPlayerReady,
  playing,
  player,
  customClass,
}) => {
  const [videoTime, setVideoTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(50)
  const [muted, setMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  // const [quality, setQuality] = useState('720*1280')
  const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false)
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false)

  const settingsDropdownRef = useRef(null)

  const { [videoId]: isLoading = false } = useSelector(
    // @ts-ignore
    state => state.object?.videoLoadings
  )

  useOnClickOutside({
    ref: settingsDropdownRef,
    onClick: () => setIsSettingsDropdownOpen(false),
  })

  const sliderColor =
    color !== 'transparent' ? (color === 'light' ? 'dark' : 'light') : 'light'

  const currentDuration = videoTime
    ? Math.floor(currentTime / 60) +
      ':' +
      ('0' + Math.floor(currentTime % 60)).slice(-2)
    : '00:00'

  const totalDuration = videoTime
    ? `${Math.floor(videoTime / 60)}:${Math.floor(videoTime % 60)}`
    : '00:00'

  useEffect(() => {
    setVideoTime(0)
    setCurrentTime(0)
    setProgress(0)
    setVolume(50)
    setMuted(false)
    setPlaybackSpeed(1.0)
    // setQuality('720*1280')
    setIsVolumeSliderOpen(false)
    setIsSettingsDropdownOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  window.setInterval(() => {
    setVideoTime(player?.duration)
    setCurrentTime(player?.currentTime)
    setProgress((player?.currentTime / player?.duration) * 100)
  }, 1000)

  const openFullscreen = () => {
    if (player?.requestFullscreen) player?.requestFullscreen()
    else if (player?.webkitRequestFullscreen)
      player?.webkitRequestFullscreen() // Safari || Chrome
    else if (player?.msRequestFullscreen) player?.msRequestFullscreen() // IE11 (edge)
  }

  const handleMuteVolume = () => {
    if (muted) {
      player.muted = false
      setMuted(false)
    } else {
      player.muted = true
      setMuted(true)
    }
  }

  const handleVideoDuration = e => {
    const duration = Number(e.target.value)
    setProgress(duration)
    if (player.duration && player.currentTime) {
      player.currentTime = (duration * videoTime) / 100
    }
  }

  const handleVolume = e => {
    const audio = Number(e.target.value)
    setVolume(audio)
    player.volume = audio / 100
    audio === 0 ? setMuted(true) : setMuted(false)
  }

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
  const handlePlaybackSpeed = speed => {
    setPlaybackSpeed(speed)
    player.playbackRate = Number(speed)
  }

  // TODO: Enable once gosdk supports quality settings
  // const resButton = (name, val) => (
  //   <button
  //     onClick={() => setQuality(val)}
  //     className={clsx(quality === val && stl.activeQuality)}
  //   >
  //     {name}
  //   </button>
  // )

  return (
    <>
      <div
        ref={settingsDropdownRef}
        className={clsx(stl.controlBar, stl[`${color}Bg`], customClass)}
      >
        <button onClick={handlePlayPause} className={stl.controlButton}>
          {!isLoading ? (
            playing ? (
              <PauseIcon style={{ transform: 'scale(1.3)' }} />
            ) : (
              <PlayIcon />
            )
          ) : (
            <SpinnerIcon className={stl.spin} />
          )}
        </button>

        <div className={stl.durationAnalyzer}>
          <span>{currentDuration}</span>
          <RangeSlider
            value={progress || 0}
            disabled={!isPlayerReady}
            min={0}
            max={100}
            onChange={handleVideoDuration}
            variant={sliderColor}
            customClass={stl.rangeSlider}
          />
          <span>{totalDuration}</span>
        </div>

        {onPrev && (
          <button onClick={() => onPrev(player)}>
            <BackwardIcon />
          </button>
        )}

        {onNext && (
          <button onClick={() => onNext(player)}>
            <ForwardIcon />
          </button>
        )}

        <div
          className={clsx(
            stl.volumeBox,
            isVolumeSliderOpen && stl.showVolSlider
          )}
          onMouseLeave={() => setIsVolumeSliderOpen(false)}
        >
          <RangeSlider
            min={0}
            max={100}
            value={volume}
            onChange={handleVolume}
            variant={sliderColor}
            customClass={stl.volumeSlider}
          />
          <button
            onClick={handleMuteVolume}
            onWheel={() => setIsVolumeSliderOpen(true)}
          >
            {muted ? (
              <MutedVolumeIcon style={{ transform: 'scale(0.85)' }} />
            ) : (
              <VolumeIcon />
            )}
          </button>
        </div>

        <div className={stl.settingsBox}>
          <div
            className={clsx(
              stl.settingsDropdown,
              isSettingsDropdownOpen && stl.showSettings,
              stl[`${color}Bg`]
            )}
          >
            <h5 className={stl.dropdownHeading}>Settings</h5>
            <div className={stl.settingsItem}>
              <span>
                <PlaybackSpeedIcon style={{ transform: 'scale(0.85)' }} />
                <p>Playback Speed {playbackSpeed}x</p>
              </span>
              <RightArrowIcon />

              <div className={clsx(stl.options, stl[`${color}Bg`])}>
                {speedOptions.map(speed => (
                  <button
                    key={speed}
                    onClick={() => handlePlaybackSpeed(speed)}
                    className={clsx(playbackSpeed === speed && stl.activeSpeed)}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
            {/* TODO: Enable once gosdk supports quality settings */}
            {/* <div className={clsx(stl[`${color}Bg`], stl.settingsItem)}>
              <span>
                <HighQualityIcon style={{ transform: 'scale(0.85)' }} />
                <p>
                  {t('video-player.quality')}{' '}
                  {quality == '1440*2560' && '1440p'}
                  {quality == '1080*1920' && '1080p'}
                  {quality == '720*1280' && '720p'}
                  {quality == '480*854' && '480p'}
                  {quality == '360*640' && '360p'}
                  {quality == '240*426' && '240p'}
                  {quality == '144*256' && '144p'}
                </p>
              </span>
              <RightArrowIcon />

              <div className={stl.options}>
                {resButton('1440p', '1440*2560')}
                {resButton('1080p', '1080*1920')}
                {resButton('720p', '720*1280')}
                {resButton('480p', '480*854')}
                {resButton('360p', '360*640')}
                {resButton('240p', '240*426')}
                {resButton('144p', '144*256')}
              </div>
            </div> */}
          </div>

          <button
            onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
          >
            <SettingsIcon />
          </button>
        </div>

        <button
          onClick={() =>
            setFullScreen ? setFullScreen(!fullScreen) : openFullscreen()
          }
        >
          {fullScreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}
        </button>
      </div>
    </>
  )
}

ContolBar.propTypes = {
  color: PropTypes.oneOf(['dark', 'light', 'transparent']),
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  videoId: PropTypes.string,
  fullScreen: PropTypes.bool,
  setFullScreen: PropTypes.func,
  handlePlayPause: PropTypes.func,
  isPlayerReady: PropTypes.bool,
  playing: PropTypes.bool,
  player: PropTypes.object,
  customClass: PropTypes.string,
}

export default ContolBar
