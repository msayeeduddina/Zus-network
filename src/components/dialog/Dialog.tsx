import PropTypes from 'prop-types'
import clsx from 'clsx'

import FullModal from 'components/full-modal'
import DialogFooter from './DialogFooter'
import DialogHeader from './DialogHeader'

import stl from './Dialog.module.scss'

const Dialog = ({
  isOpen,
  close,
  rounded,
  children,
  id,
  animation = 'bounce',
  theme = 'vult',
  closeOnClickAway = true,
  customClass,
}) => {
  return (
    <FullModal
      isOpen={isOpen}
      close={close}
      closeOnClickAway={closeOnClickAway}
    >
      <div
        id={id}
        className={clsx(
          stl.content,
          customClass,
          animation && stl[animation],
          rounded && stl.rounded,
          stl[`${theme}Theme`]
        )}
      >
        {children}
      </div>
    </FullModal>
  )
}

Dialog.propTypes = {
  close: PropTypes.func,
  rounded: PropTypes.bool,
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  animation: PropTypes.oneOf(['bounce', 'zoom']),
  theme: PropTypes.string,
  closeOnClickAway: PropTypes.bool,
  customClass: PropTypes.string,
}

export default Object.assign(Dialog, {
  Header: DialogHeader,
  Footer: DialogFooter,
})
