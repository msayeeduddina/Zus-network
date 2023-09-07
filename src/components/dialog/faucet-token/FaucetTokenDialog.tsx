import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Dialog from 'components/dialog'
import FullModal from 'components/full-modal'
import { Spinner } from 'components/Spinner'

import { getFaucetToken } from '@zerochain/zus-sdk'
import { getBalanceFunc } from 'store/wallet'

import stl from './FaucetTokenDialog.module.scss'

const FaucetTokenDialog = ({ close, setIsSuccess, setIsError }) => {
  const dispatch = useDispatch()

  const [amount, setAmount] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

  const onFaucet = async () => {
    setIsLoading(true)
    try {
      await getFaucetToken(amount)
      await dispatch(getBalanceFunc())
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.log(error)
      setIsError(true)
      setIsLoading(false)
      close()
      return
    }
    setIsLoading(false)
    setIsSuccess(true)
    close()
  }

  return (
    <>
      {isLoading && (
        <FullModal isOpen={isLoading} closeOnClickAway={false}>
          <Spinner />
          <h4>
            <b>Getting Tokens</b>
          </h4>
        </FullModal>
      )}

      <Dialog theme="bolt" close={close} isOpen customClass={stl.faucetDialog}>
        <Dialog.Header title="Faucet Tokens"></Dialog.Header>

        <input
          id="amount"
          name="amount"
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          placeholder="Amount"
          className={stl.textInputBox}
        />

        <Dialog.Footer
          actionButtonLabel="Faucet"
          actionButtonOnClick={onFaucet}
          cancelButtonOnClick={close}
          cancelButtonLabel="Cancel"
          actionButtonColor="bolt"
        />
      </Dialog>
    </>
  )
}

export default FaucetTokenDialog
