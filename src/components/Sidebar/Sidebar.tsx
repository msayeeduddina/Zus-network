import React, { useContext, useState } from 'react'
import styles from './Sidebar.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../Button'
import clsx from 'clsx'
import { useRouter } from 'next/router'

import { ROUTES } from '../../constant/routes'

import {
  FaucetTokenDialog,
  SendTokenDialog,
  ReceiveTokenDialog,
} from 'components/dialog'
import Modal from 'components/Modal'

const siteMenu = [
  {
    label: 'Bolt',
    href: ROUTES.bolt,
    activeIcon: '/bolt-icon-2.svg',
    inactiveIcon: '/bolt-icon-1.svg',
    iconWidth: 32,
  },
  {
    label: 'Vult',
    href: ROUTES.vult,
    activeIcon: '/vult-icon-2.svg',
    inactiveIcon: '/vult-icon-1.svg',
    iconWidth: 27,
  },
]

const navMenu = [
  {
    label: 'Wallet',
    href: ROUTES.wallet,
    inactiveIcon: '/icons/icon-wallet-line.png',
    iconWidth: 18,
  },
  {
    label: 'Allocation',
    href: ROUTES.allocation,
    inactiveIcon: '/icons/icon-piechart-line.svg',
    iconWidth: 20,
  },
]

export default function Sidebar() {
  const router = useRouter()

  const isActive = path => router.pathname === path

  const [isSendTokenOpen, setIsSendTokenOpen] = useState(false)
  const [isReceiveTokenOpen, setIsReceiveTokenOpen] = useState(false)
  const [faucetTokens, setIsFaucetTokens] = useState(false)

  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  return (
    <div className={styles.siteSidebar}>
      <div className={styles.sidebarTop}>
        <ul className={clsx(styles.nav, styles.siteNav)}>
          {siteMenu.map(item => {
            return (
              <li
                className={isActive(item.href) ? styles.active : ''}
                key={item.label}
              >
                <Link href={item.href}>
                  <figure>
                    <Image
                      src={
                        isActive(item.href)
                          ? item.activeIcon
                          : item.inactiveIcon
                      }
                      width={item.iconWidth}
                      height={item.iconWidth}
                      alt={item.label}
                    />
                  </figure>

                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <hr className={styles.ruler} />

        <ul className={styles.nav}>
          {navMenu.map(item => {
            return (
              <li key={item.label}>
                <Link href={item.href}>
                  <figure>
                    <Image
                      src={item.inactiveIcon}
                      width={item.iconWidth}
                      height={item.iconWidth}
                      alt={item.label}
                    />
                  </figure>

                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {router.pathname === ROUTES.bolt && (
        <div className={styles.sidebarBottom}>
          <Button
            theme="bolt"
            onClick={() => {
              setIsSendTokenOpen(true)
            }}
          >
            Send
            <figure>
              <Image
                src="/icons/icon-arrow-right.svg"
                width="16"
                height="16"
                alt=""
              />
            </figure>
          </Button>

          <Button
            theme="bolt"
            onClick={() => {
              setIsReceiveTokenOpen(true)
            }}
          >
            Receive
            <figure>
              <Image
                src="/icons/icon-arrow-left.svg"
                width="16"
                height="16"
                alt=""
              />
            </figure>
          </Button>

          <Button
            theme="bolt"
            onClick={() => {
              setIsFaucetTokens(true)
            }}
          >
            Faucet
            <figure>
              <Image
                src="/icons/icon-faucet.svg"
                width="20"
                height="20"
                alt=""
              />
            </figure>
          </Button>
        </div>
      )}

      {isSendTokenOpen && (
        <SendTokenDialog
          close={() => setIsSendTokenOpen(false)}
          setIsError={setIsError}
          setIsSuccess={setIsSuccess}
        />
      )}

      {isReceiveTokenOpen && (
        <ReceiveTokenDialog close={() => setIsReceiveTokenOpen(false)} />
      )}

      {faucetTokens && (
        <FaucetTokenDialog
          close={() => setIsFaucetTokens(false)}
          setIsError={setIsError}
          setIsSuccess={setIsSuccess}
        />
      )}

      {isError && (
        <Modal title="Error" closeFunc={() => setIsError(false)}>
          <Image src="/error-icon.svg" height="72" width="72" alt="" />
          <p>Transactions Failed!</p>
          <Button theme="bolt" size="large" onClick={() => setIsError(false)}>
            Ok
          </Button>
        </Modal>
      )}

      {isSuccess && (
        <Modal title="Success" closeFunc={() => setIsSuccess(false)}>
          <Image src="/success-icon.svg" height="72" width="72" alt="" />
          <p>Transaction done successfully!</p>
          <Button theme="bolt" size="large" onClick={() => setIsSuccess(false)}>
            Ok
          </Button>
        </Modal>
      )}
    </div>
  )
}
