export const getArrayDifference = (
  array1 = [],
  array2 = [],
  property1,
  property2?: string
) => {
  const difference = []

  if (property1)
    array1?.forEach(el1 => {
      const el2 = array2?.find(
        el2 => el2[property1] === el1[property1 || property2]
      )

      if (!el2) difference.push(el1)
    })
  else
    array1?.forEach(el1 => {
      if (!array2?.includes(el1)) difference.push(el1)
    })

  return difference
}

export const getRandomIndex = array => Math.floor(Math.random() * array?.length)

export const getRandomArrayElement = array => {
  const randomIndex = getRandomIndex(array)
  return array[randomIndex]
}

export const removeDuplicates = (array, property) => {
  const uniqueArray = []

  if (property) {
    array.forEach(el => {
      const elProperty = el[property]

      if (!uniqueArray.find(uniqueEl => uniqueEl[property] === elProperty))
        uniqueArray.push(el)
    })
  } else
    array.forEach(el => {
      if (!uniqueArray.includes(el)) uniqueArray.push(el)
    })

  return uniqueArray
}
