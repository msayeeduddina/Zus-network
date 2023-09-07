export async function handleResponseDispatch(props) {
  const { data, error, dispatch, actionTypes, errMessage, successMsg } = props

  if (
    (error && error.message) ||
    (typeof error === 'string' && error) ||
    !data
  ) {
    await dispatch({
      type: actionTypes.error,
      message: errMessage,
      payload: error,
    })

    return { error }
  }

  await dispatch({ type: actionTypes.success, payload: data, successMsg })

  return { data }
}
