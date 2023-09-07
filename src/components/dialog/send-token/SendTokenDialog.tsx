import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Dialog from 'components/dialog'
import FullModal from 'components/full-modal'
import { Spinner } from 'components/Spinner'

import { selectActiveWallet } from 'store/wallet'
import { sendTransaction } from '@zerochain/zus-sdk'
import { getBalanceFunc } from 'store/wallet'
import { zcnToToken } from 'lib/utils/token'

import stl from './SendTokenDialog.module.scss'

const SendTokenDialog = ({ close, setIsSuccess, setIsError }) => {
  const [amount, setAmount] = useState('')
  const [clientID, setClientID] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const wallet = useSelector(selectActiveWallet)

  const sendTransactionClick = async () => {
    setIsLoading(true)
    const fromWallet = {
      id: wallet?.keys?.walletId,
      public_key: wallet?.keys?.publicKey,
      secretKey: wallet?.keys?.privateKey,
    }
    try {
      await sendTransaction(
        fromWallet,
        clientID,
        zcnToToken(Number(amount)),
        ''
      )
      setTimeout(async () => {
        await dispatch(getBalanceFunc())
        setIsLoading(false)
        setIsSuccess(true)
        close()
      }, 5000)
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.log(error)
      setIsError(true)
      setIsLoading(false)
      setIsSuccess(false)
      close()
      return
    }
  }

  return (
    <>
      {isLoading && (
        <FullModal isOpen={isLoading} closeOnClickAway={false}>
          <Spinner />
          <h4>
            <b>Sending ZCN</b>
          </h4>
        </FullModal>
      )}
      <Dialog theme="bolt" close={close} isOpen>
        <Dialog.Header title="Send ZCN"></Dialog.Header>
        <input
          id="clientID"
          name="clientID"
          value={clientID}
          onChange={e => setClientID(e.target.value)}
          placeholder="Client ID"
          className={stl.textInputBox}
        />
        <br />
        <input
          id="amount"
          name="amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
          className={stl.textInputBox}
        />

        <Dialog.Footer
          actionButtonLabel="Send"
          actionButtonOnClick={sendTransactionClick}
          cancelButtonOnClick={close}
          cancelButtonLabel="Cancel"
          theme="bolt"
        ></Dialog.Footer>
      </Dialog>
    </>
  )
}

export default SendTokenDialog
