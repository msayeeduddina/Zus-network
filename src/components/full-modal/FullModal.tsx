import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import ModalPortal from './ModalPortal'

import { useOnClickOutside } from 'lib/hooks'

import stl from './FullModal.module.scss'

const FullModal = ({
  isOpen,
  close,
  closeOnClickAway,
  children,
  customClass,
  selector = '#modal',
  clearStyles,
}) => {
  const contentRef = useRef()

  useOnClickOutside({
    ref: contentRef,
    onClick: () => closeOnClickAway && close(),
  })

  useEffect(() => {
    if (!isOpen) return

    // @ts-ignore
    contentRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <ModalPortal selector={selector}>
      <div className={clsx(!clearStyles && stl.background, customClass)}>
        <div ref={contentRef} className={stl.modalContainer}>
          {children}
        </div>
      </div>
    </ModalPortal>
  )
}

FullModal.defaultProps = {
  closeOnClickAway: true,
}

FullModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func,
  children: PropTypes.node.isRequired,
  closeOnClickAway: PropTypes.bool,
  customClass: PropTypes.string,
  selector: PropTypes.string,
  clearStyles: PropTypes.bool,
}

export default FullModal
