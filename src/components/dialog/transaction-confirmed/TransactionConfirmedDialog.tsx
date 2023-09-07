// @ts-nocheck

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Link from 'next/link'
import format from 'date-fns/format'

import Dialog from 'components/dialog'
import Button from 'components/Button'

import LinkingIcon from 'assets/svg/bolt/linking.svg'

import { selectTransactionsByHash, getTxnByHash } from 'store/transactions'
import { getTransactionAmount, formatUUIDAddress } from 'lib/utils'
import { tokenToZcn } from 'lib/utils/token'

import stl from './TransactionConfirmedDialog.module.scss'

const TransactionConfirmedDialog = ({
  transactionDetails = {},
  isOpen,
  close,
  customClass,
  theme = 'bolt',
  zcnPrice,
}) => {
  const dispatch = useDispatch()
  const { activeWalletId } = useSelector(state => state.wallet)
  const [transactionInfo, setTransactionInfo] = useState({})
  const txnHash = transactionDetails?.transactionNumber
  const atlusUrl = `https://atlus.cloud`

  const transaction: any = useSelector(selectTransactionsByHash(txnHash))

  useEffect(() => {
    if (txnHash) {
      setTransactionInfo({})
      const transactionAmount = getTransactionAmount(transaction)
      setTransactionInfo({
        coinAmount: transactionDetails.coinAmount,
        coinSymbol: 'ZCN',
        sendAmount: tokenToZcn(transactionAmount),
        sendUsdAmount: Number(tokenToZcn(transactionAmount) * zcnPrice),
        sendAddress: transaction.to_client_id,
        clientId: transaction.client_id,
        notes: transactionDetails.notes,
        transactionNumber: txnHash,
        status: transaction.status === 1 ? 'Confirmed' : 'Failed',
        transactionDate: format(
          new Date(transaction.CreatedAt),
          'MMM dd, yyyy hh:mm aaa'
        ),
      })
    }
  }, [dispatch, txnHash, transactionDetails, zcnPrice, transaction])

  const headerTitle = `${'Confirmed'}#
  ${transactionDetails.transactionNumber}`

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      customClass={clsx(stl.transactionConfirmedDialog, customClass)}
      theme={theme}
    >
      <Dialog.Header
        title={headerTitle}
        customClass={stl.header}
        customIconClass={stl.icon}
        customTitleClass={stl.heading}
      />
      <div className={stl.flexCenterCol}>
        {transactionInfo.notes && (
          <div className={stl.walletAddressContainer}>
            <div className={stl.notesDetailsContainer}>
              <div className={stl.columnLabel}>Notes</div>
              <div className={stl.columnContent}>{transactionInfo.notes}</div>
            </div>
          </div>
        )}
        <div className={stl.walletAddressContainer}>
          <div className={stl.leftContainer}>
            <div className={stl.columnLabel}>From</div>
            <div className={stl.columnContent}>
              {transactionInfo.clientId === activeWalletId
                ? 'My Wallet'
                : formatUUIDAddress(transactionInfo.clientId)}
            </div>
          </div>
          <div className={stl.rightContainer}>
            <div className={stl.columnLabel}>To</div>
            <div className={clsx(stl.columnContent, stl.walletAddress)}>
              {transactionInfo.sendAddress === activeWalletId
                ? 'My Wallet'
                : transactionInfo.sendAddress}
            </div>
          </div>
        </div>
        <div className={stl.walletAddressContainer}>
          <div className={stl.leftContainer}>
            <div className={stl.columnLabel}>Status</div>
            <div className={stl.columnContent}>{transactionInfo.status}</div>
          </div>
          <div className={stl.rightContainer}>
            <div className={stl.columnLabel}>Date</div>
            <div className={stl.columnContent}>
              {transactionInfo.transactionDate}
            </div>
          </div>
        </div>
        <div className={stl.subTitle}>Amount</div>
        <div className={stl.coinAmount}>
          {transactionInfo.sendAmount
            ? transactionInfo.sendAmount?.toFixed(2)
            : 0}{' '}
          <div className={stl.coinSymbol}>{transactionInfo.coinSymbol}</div>
        </div>
        <div className={stl.usdAmount}>
          {transactionInfo.sendUsdAmount
            ? transactionInfo.sendUsdAmount?.toFixed(2)
            : 0}{' '}
          USD
        </div>
        <Button theme="bolt" customClass={stl.firstButton}>
          <Link
            target="_blank"
            rel="noreferrer"
            href={`${atlusUrl}/transaction-details/${transactionDetails.transactionNumber}`}
          >
            <div className={stl.flexCenter}>
              <div className={stl.buttonIcon}>
                <LinkingIcon height={18} />
              </div>
              <div>View On Explorer</div>
            </div>
          </Link>
        </Button>
        <Button
          theme="bolt"
          color="boltOutline"
          customClass={stl.firstButton}
          onClick={close}
        >
          Close
        </Button>
      </div>
    </Dialog>
  )
}

TransactionConfirmedDialog.propTypes = {
  transactionDetails: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  customClass: PropTypes.string,
  zcnPrice: PropTypes.number,
  theme: PropTypes.string,
}

export default TransactionConfirmedDialog
