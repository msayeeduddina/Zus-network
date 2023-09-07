import { useEffect, useContext } from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'

import LayoutDashboard from 'layouts/LayoutDashboard'
import { ContentBox } from 'components/ContentBox'
import Accordion from 'components/accordion'

import { selectActiveWallet } from 'store/wallet'

import styles from './Details.module.scss'

const WalletDetails = () => {
  const wallet = useSelector(selectActiveWallet)

  const walletDetails = {
    'Client ID': wallet?.keys?.walletId,
    'Private Key': wallet?.keys?.privateKey,
    'Public Key': wallet?.keys?.publicKey,
    Mnemonics: wallet?.mnemonic,
    'Public Encryption Key': wallet?.keys?.publicEncryptionKey,
  }

  return (
    <LayoutDashboard>
      <ContentBox>
        <div className={styles.wrapper}>
          <h1>
            <b>Wallet Details</b>
          </h1>

          <div className={styles.list}>
            <h6>Details</h6>
            {Object.entries(walletDetails).map(([key, value]) => {
              return (
                <Accordion title={key} showLine={true} key={key}>
                  <span className={styles.accordionValue}>{value}</span>
                </Accordion>
              )
            })}
          </div>

          <div className={clsx(styles.list, styles.listJSON)}>
            <h6>JSON</h6>

            <pre>{JSON.stringify(wallet, null, 2)}</pre>
          </div>
        </div>
      </ContentBox>
    </LayoutDashboard>
  )
}

export default WalletDetails
