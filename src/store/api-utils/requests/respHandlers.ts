export const handleJsonResp = async response => {
  const contentType = response?.headers?.get('content-type')
  const isJson = contentType?.includes('application/json')

  if (response.status >= 400 || !isJson) {
    const errorObj: { [index: string]: any } = {
      message: isJson ? response.statusText : 'Response is not JSON',
      contentType,
      response,
    }

    if (isJson) errorObj.body = await response.json()

    throw errorObj
  }

  return response.json()
}
