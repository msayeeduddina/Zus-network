import PropTypes from 'prop-types'

import BlueCheckedIcon from 'assets/svg/checked-checkbox.svg'
import BlueUnCheckedIcon from 'assets/svg/unchecked-checkbox.svg'

import { generateRandomString } from 'lib/utils'

const listCheckedIcons = {
  blue: <BlueCheckedIcon />,
}

const listUnCheckedIcons = {
  blue: <BlueUnCheckedIcon />,
}

const CheckBox = ({
  checkedIcon,
  unCheckedIcon,
  customClass,
  isChecked,
  setIsChecked,
  onClick,
  color = 'blue',
}) => {
  const checkBoxId = generateRandomString()

  return (
    <div data-testid="checkbox" className={customClass}>
      <label
        htmlFor={checkBoxId}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          onClick && onClick()
          setIsChecked && setIsChecked()
        }}
      >
        {isChecked
          ? checkedIcon || listCheckedIcons[color]
          : unCheckedIcon || listUnCheckedIcons[color]}
      </label>
      <input id={checkBoxId} type="checkbox" />
    </div>
  )
}

CheckBox.propTypes = {
  isChecked: PropTypes.bool,
  setIsChecked: PropTypes.func,
  onClick: PropTypes.func,
  checkedIcon: PropTypes.node,
  unCheckedIcon: PropTypes.node,
  customClass: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'gray', 'white', 'orange']),
}

export default CheckBox
