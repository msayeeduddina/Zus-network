import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import clsx from 'clsx'

import { ContentBox } from 'components/ContentBox'
import LayoutDashboard from 'layouts/LayoutDashboard'
import FullModal from 'components/full-modal'
import { Spinner } from 'components/Spinner'
import { TransactionConfirmedDialog } from 'components/dialog'
import Button from 'components/Button'
import RefreshIcon from 'assets/svg/bolt/refresh.svg'

import { getUSDRate } from '@zerochain/zus-sdk'
import {
  getBalanceFunc,
  selectActiveWallet,
  selectWalletBalance,
} from 'store/wallet'
import { getLatestTxns, selectTransactions } from 'store/transactions'
import { tokenToZcn } from 'lib/utils/token'
import { useBls } from 'lib/hooks'

import styles from './Bolt.module.scss'

export default function Bolt() {
  const { usd, zcn } = useSelector(selectWalletBalance)

  const [zcnUsdRate, setZcnUsdRate] = useState(0.14)

  const perPage = 5

  const [currentPage, setCurrentPage] = useState(1)
  const [txnsCount, setTxnsCount] = useState(20)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Getting Balance')
  const [confirmedTransactionDetails, setConfirmedTransactionDetails] =
    useState({})

  const dispatch = useDispatch()
  const { blsLoaded } = useBls()

  const activeWallet = useSelector(selectActiveWallet)
  const transactions: any = useSelector(selectTransactions)
  // @ts-ignore
  const { isWasmInitializing } = useSelector(state => state.zerochain)

  const pages = useMemo(() => {
    return Array.from(Array(Math.ceil(transactions.length / perPage)).keys())
  }, [transactions.length])

  const [
    isTransactionConfirmedDialogOpen,
    setIsTransactionConfirmedDialogOpen,
  ] = useState(false)

  const closeTransactionConfirmedDialogModal = () =>
    setIsTransactionConfirmedDialogOpen(false)

  const viewTransaction = txn => {
    const amount = txn.value ? tokenToZcn(txn.value) : 0
    setConfirmedTransactionDetails({
      coinAmount: amount,
      sendUsdAmount: zcnUsdRate * amount,
      notes: txn.notes,
      transactionNumber: txn.hash,
    })
    setIsTransactionConfirmedDialogOpen(true)
  }

  const getUsdZcnRate = async () => {
    setIsLoading(true)
    setLoadingMsg('Getting ZCN Rate')
    const rate = await getUSDRate('zcn')
    setZcnUsdRate(rate)
    setIsLoading(false)
  }
  useEffect(() => {
    if (blsLoaded && !isWasmInitializing) {
      dispatch(getBalanceFunc())
      getUsdZcnRate()
    }
  }, [blsLoaded, dispatch, isWasmInitializing])

  const itemsPerPage = 5

  const handleSetData = useCallback(async () => {
    setIsLoading(true)
    setLoadingMsg('Getting transactions')
    const params = {
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage + 1,
      sort: 'desc',
      client_id: activeWallet?.id,
      // to_client_id: activeWallet?.id,
    }

    const { data }: any = await dispatch(getLatestTxns(params))

    if (data) {
      if (data?.length > itemsPerPage) {
        setTxnsCount(currentPage * itemsPerPage + data?.length)
        data.pop()
      } else setTxnsCount(currentPage * itemsPerPage)
    }
    setIsLoading(false)
  }, [activeWallet?.id, currentPage, dispatch])

  useEffect(() => {
    if (blsLoaded && !isWasmInitializing) handleSetData()
  }, [blsLoaded, handleSetData, isWasmInitializing, zcn])

  const refreshBalance = () => {
    setIsRefreshing(true)
    dispatch(getBalanceFunc())
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  return (
    <LayoutDashboard>
      <ContentBox>
        {isLoading && (
          <FullModal isOpen={isLoading} closeOnClickAway={false}>
            <Spinner />
            <h4>
              <b>{loadingMsg}</b>
            </h4>
          </FullModal>
        )}
        <div className={styles.balanceWrapper}>
          <p>Available Balance</p>
          <h1 className={styles.value}>
            <b>{zcn}</b>
            <small className={styles.unit}>ZCN</small>
            <RefreshIcon
              onClick={refreshBalance}
              className={clsx(
                styles.refreshIcon,
                isRefreshing && styles.refreshing
              )}
            />
          </h1>
          <small>1 ZCN = ${zcnUsdRate}</small>

          {/* <ProgressBar
            value="50%"
            labelLeft="Staked"
            labelRight="Available"
            theme="bolt"
          ></ProgressBar> */}

          <div className={styles.balance}>
            <div>Total Balance</div>
            <div className={styles.total}>
              <span className={styles.currency}>$</span>
              {usd?.toFixed(4)}
            </div>
          </div>
        </div>
      </ContentBox>

      <div>
        <div className={styles.widgetHeading}>
          <h6>Recent Transactions</h6>

          <div className={styles.right}>
            {/* <Link href="#">View all</Link> */}
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Transaction Hash</th>
              <th>Date (UT)</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length > 0
              ? transactions
                  // .slice(page * perPage, (page + 1) * perPage)
                  .map(e => (
                    <tr key={e.hash}>
                      <td className={styles.hash}>
                        {e.hash}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(e.hash)
                          }}
                        >
                          <Image
                            src="/icons/icon-document.svg"
                            height={17}
                            width={17}
                            alt=""
                          />
                        </button>
                      </td>
                      <td>{new Date(e?.CreatedAt).toUTCString()}</td>
                      <td>
                        <Button
                          theme="bolt"
                          customClass={styles.viewButton}
                          onClick={() => viewTransaction(e)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
              : 'No records found'}
          </tbody>
        </table>

        <ul className={styles.pagination}>
          <li className={styles.previous}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(value => value - 1)}
            >
              <Image
                src="/icons/icon-caret-left.svg"
                height={10}
                width={10}
                alt=""
              />
              Previous
            </button>
          </li>

          {pages.map(e => (
            <li key={e}>
              <button>{currentPage}</button>
            </li>
          ))}

          <li className={styles.next}>
            <button
              disabled={transactions?.length !== itemsPerPage} //can we improve this check? //we don't kmpw the total txns, so using this hack here
              onClick={() => setCurrentPage(value => value + 1)}
            >
              Next
              <Image
                src="/icons/icon-caret-right.svg"
                height={10}
                width={10}
                alt=""
              />
            </button>
          </li>
        </ul>
      </div>
      <TransactionConfirmedDialog
        transactionDetails={confirmedTransactionDetails}
        isOpen={isTransactionConfirmedDialogOpen}
        close={closeTransactionConfirmedDialogModal}
        zcnPrice={zcnUsdRate}
      />
    </LayoutDashboard>
  )
}
