// @ts-nocheck

//https://chromium.googlesource.com/external/w3c/web-platform-tests/+/refs/heads/master/media-source/mediasource-is-type-supported.html

import * as muxjs from 'mux.js'
import * as ebml from 'ts-ebml'

const detectMp4 = ({ mimeType, buf }) => {
  // console.log(mimeType, buf)
  const isFragmented =
    buf && muxjs.mp4.probe.findBox(buf, ['moov', 'mvex']).length > 0
      ? true
      : false

  return {
    isFragmented,
    mimeCodecs:
      buf &&
      `${mimeType}; codecs="${muxjs.mp4.probe
        .tracks(buf)
        .map(t => t.codec)
        .join(',')}"`,
  }
}
const detectWebm = ({ mimeType, buf }) => {
  const decoder = new ebml.Decoder()
  const codecs = decoder
    .decode(buf)
    .filter(it => it.name == 'CodecID')
    .map(it => it.value.replace(/^(V_)|(A_)/, '').toLowerCase())
    .join(',')
  return { isFragmented: true, mimeCodecs: `${mimeType}; codecs="${codecs}"` }
}

const detectors = {
  'video/mp4': detectMp4,
  'audio/mp4': detectMp4,
  'video/webm': detectWebm,
  'audio/webm': detectWebm,
}

export const getMimeCodecs = ({ mimeType, buf }) => {
  const detect = detectors[mimeType]
  if (detect) {
    return detect({ mimeType, buf })
  }
  return mimeType
}
