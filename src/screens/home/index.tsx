import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { getFaucetToken, init } from '@zerochain/zus-sdk'

import Layout from 'layouts/Layout'
import { IconBox } from 'components/IconBox'
import { InfoBox } from 'components/InfoBox'
import Button from 'components/Button'
import Modal from 'components/Modal'
import { Spinner } from 'components/Spinner'

import { createWalletFunc, selectActiveWallet } from 'store/wallet'
import { createAllocationFunc } from 'store/allocation'
import { ROUTES } from 'constant/routes'
import { getNetwork } from 'store/zerochain'
import { useBls } from 'lib/hooks'

import styles from './Home.module.scss'

export default function CreateWallet() {
  const dispatch = useDispatch()
  const { blsLoaded } = useBls()

  const wallet = useSelector(selectActiveWallet)
  // @ts-ignore
  const { isWasmInitializing } = useSelector(state => state.zerochain)

  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Creating Wallet...')

  const handleCreateAccount = async () => {
    setIsLoading(true)
    await dispatch(createWalletFunc())

    setLoadingMsg('Creating Allocation...')
    await getFaucetToken(12)
    await dispatch(createAllocationFunc())

    setIsLoading(false)
    setShowSuccessDialog(true)
  }

  const actions = [
    {
      label: 'Wallet Details',
      url: ROUTES.wallet,
      icon: '/icons/icon-wallet-solid.svg',
    },
    {
      label: 'Allocation Details',
      url: ROUTES.allocation,
      icon: '/icons/icon-piechart-solid.svg',
      iconSize: '31',
    },
  ]

  useEffect(() => {
    dispatch(getNetwork())
  }, [dispatch])

  return (
    <>
      <Layout>
        {wallet.id ? (
          <div className={styles.welcomeWrapper}>
            <h4 className={styles.welcomeMessage}>
              Hello <span>John!</span>
            </h4>

            <div className={styles.flex}>
              {actions.map(item => {
                return (
                  <div key={item.label}>
                    <IconBox
                      icon={item.icon}
                      url={item.url}
                      iconSize={item.iconSize}
                    >
                      {item.label}
                    </IconBox>
                  </div>
                )
              })}
            </div>

            <div className={styles.flex}>
              <div className={styles.logo}>
                <Link href="/bolt">
                  <Image src="/bolt-logo.png" width="178" height="75" alt="" />
                </Link>
              </div>

              <div className={styles.logo}>
                <Link href="/vult">
                  <Image src="/vult-logo.png" width="180" height="72" alt="" />
                </Link>
              </div>
            </div>

            <footer>
              <span>Powered by</span>{' '}
              <Image src="/zus-logo.svg" height="66" width="66" alt="" />
            </footer>
          </div>
        ) : (
          <div className={styles.createWalletWrapper}>
            <figure className={styles.logo}>
              <Image src="/zus-logo.png" width="124" height="45" alt="" />
            </figure>

            <InfoBox className="createWallet">
              <h3>Create your wallet to start staking and earning!</h3>
              <p>
                You will need to create a wallet to start staking and earning
                rewards. You can create a wallet by clicking the button below.
              </p>

              <Button
                size="large"
                fullWidth={true}
                onClick={handleCreateAccount}
                disabled={!blsLoaded || isWasmInitializing}
              >
                Create Wallet
              </Button>
            </InfoBox>
          </div>
        )}
      </Layout>

      {isLoading && (
        <Modal>
          <Spinner />
          <h4>
            <b>{loadingMsg}</b>
          </h4>
        </Modal>
      )}

      {showSuccessDialog && (
        <Modal title="Success" closeFunc={() => setShowSuccessDialog(false)}>
          <Image src="/success-icon.svg" height="72" width="72" alt="" />
          <p>Allocation is created successfully</p>
          <Button size="large" onClick={() => setShowSuccessDialog(false)}>
            Ok
          </Button>
        </Modal>
      )}
    </>
  )
}
