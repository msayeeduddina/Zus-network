import PropTypes from 'prop-types'
import clsx from 'clsx'

import Dialog from 'components/dialog'

import { useDeleteObjects } from 'lib/hooks'

import stl from './DeleteDialog.module.scss'

const DeleteDialog = ({
  title = 'Are you sure?',
  message,
  children,
  isOpen,
  close,
  id,
  actionFiles: files,
  customClass,
}) => {
  const defaultMessage = `Please confirm the deletion of ${
    files.length > 1 ? 'these files' : 'this file'
  }. This action cannot be reversed.`

  const { handleDelete } = useDeleteObjects({ files, close })

  return (
    <Dialog
      id={id}
      isOpen={isOpen}
      close={close}
      rounded
      customClass={clsx(stl.dialog, stl.centered, customClass)}
    >
      <Dialog.Header close={close} customClass={stl.header} title={title} />
      <div data-testid="dialogMessage" className={stl.content}>
        {children || <p>{defaultMessage || message}</p>}
      </div>
      <div className={stl.divider} />
      <Dialog.Footer
        actionButtonLabel="Yes, Delete"
        actionButtonOnClick={handleDelete}
        cancelButtonLabel="Cancel"
        cancelButtonOnClick={close}
        cancelButtonColor="outline"
        customClass={stl.footer}
      />
    </Dialog>
  )
}

DeleteDialog.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  id: PropTypes.string,
  actionFiles: PropTypes.arrayOf(PropTypes.object),
  customClass: PropTypes.string,
}

export default DeleteDialog
