import PropTypes from 'prop-types'
import clsx from 'clsx'

import SpinnerIcon from 'assets/svg/spinner.svg'

import stl from './LoadingSpinner.module.scss'

const LoadingSpinner = ({ isOpen, icon = <SpinnerIcon />, customClass }) => (
  <div className={clsx(stl.spinnerContainer, isOpen && stl.show, customClass)}>
    <div className={stl.spinnerBox}>{icon}</div>
  </div>
)

LoadingSpinner.propTypes = {
  isOpen: PropTypes.bool,
  icon: PropTypes.node,
  customClass: PropTypes.string,
}

export default LoadingSpinner
