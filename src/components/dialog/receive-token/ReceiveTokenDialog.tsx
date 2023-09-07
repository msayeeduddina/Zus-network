import { useSelector } from 'react-redux'

import Dialog from 'components/dialog'

import CopyIcon from '../../../../public/copy.svg'

import { selectActiveWallet } from 'store/wallet'

import stl from './ReceiveTokenDialog.module.scss'

const ReceiveTokenDialog = ({ close }) => {
  const wallet = useSelector(selectActiveWallet)
  const walletAddress = wallet?.id

  const onCopy = async () => {
    const { copyTextValue } = await import('lib/utils')
    copyTextValue(walletAddress)
  }

  return (
    <Dialog theme="bolt" close={close} isOpen>
      <Dialog.Header title="Receive ZCN"></Dialog.Header>
      <div className={stl.walletAddressContainer} data-testid="walletAddress">
        <div className={stl.addressDetailsContainer}>
          <div className={stl.addressLabel}>Wallet Address</div>
          <div className={stl.addressContent}>{walletAddress}</div>
        </div>
        <div className={stl.iconContainer}>
          <button onClick={onCopy}>
            <CopyIcon />
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default ReceiveTokenDialog
