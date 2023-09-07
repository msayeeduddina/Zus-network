import { requestActionTypes } from '../helpers'
import { handleJsonResp } from './respHandlers'

export const fetchWithTimeout = async (url, options: any = {}) => {
  const { timeout = 15000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  })
  clearTimeout(id)

  return response
}

export const basicReqWithDispatch = async props => {
  const {
    url,
    options,
    baseType,
    dispatch,
    assets = {},
    params = {},
    dispatchSuccess = true,
  } = props
  const actionTypes = requestActionTypes(baseType)
  dispatch({ type: actionTypes.request })

  const fullUrl = new URL(url)
  for (const key in params) {
    if (params[key]) fullUrl.searchParams.append(key, params[key])
  }

  return await fetchWithTimeout(fullUrl, options)
    .then(handleJsonResp)
    .then(data => {
      if (dispatchSuccess) {
        dispatch({
          type: actionTypes.success,
          payload: data,
          assets,
        })
      }
      return { data }
    })
    .catch(error => {
      dispatch({
        type: actionTypes.error,
        payload: error,
        message: error?.message,
        assets,
      })

      return { error }
    })
}
