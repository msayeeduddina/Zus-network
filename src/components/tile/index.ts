import Tile from './Tile'

const handleShiftKeySelection = (
  currentId,
  selectedFiles,
  dispatch,
  adder,
  remover
) => {
  const filesId = []
  const files = document.getElementById('filesContainer').children
  for (let i = 0; i < files.length; i++) filesId.push(files[i].id)

  const index = filesId.indexOf(currentId)
  const isCurrentIndexSelected = selectedFiles.includes(currentId)
  const isLastIndexSelected = selectedFiles.includes(
    selectedFiles[selectedFiles.length - 1]
  )

  if (isCurrentIndexSelected) dispatch(remover(currentId))
  else if (isLastIndexSelected) {
    const lastIndex = filesId.indexOf(selectedFiles[selectedFiles.length - 1])

    if (index > lastIndex)
      for (let i = lastIndex; i <= index; i++) dispatch(adder(filesId[i]))
    else for (let i = index; i <= lastIndex; i++) dispatch(adder(filesId[i]))
  } else {
    const lastIndex = filesId.indexOf(selectedFiles[0])

    if (index > lastIndex)
      for (let i = lastIndex; i <= index; i++) dispatch(adder(filesId[i]))
    else for (let i = index; i <= lastIndex; i++) dispatch(adder(filesId[i]))
  }
}

export { handleShiftKeySelection }
export default Tile
