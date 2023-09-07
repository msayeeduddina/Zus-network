import React, { useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useDispatch } from 'react-redux'

import { SidebarContext } from '../Sidebar/useSidebarContext'
import Button from 'components/Button'

import { clearStore } from 'store/wallet'

import styles from './Header.module.scss'

export default function Header() {
  const dispatch = useDispatch()

  const { toggleSidebar } = useContext(SidebarContext)

  const handleLogout = () => {
    dispatch(clearStore())
  }

  return (
    <nav className={styles.siteHeader}>
      <figure className={styles.logo}>
        <Link
          href="/"
          className={styles.menu}
          onClick={e => {
            e.preventDefault()
            toggleSidebar()
          }}
        >
          <svg className={styles.inactive} viewBox="0 0 20 20">
            <path
              fill="#202127"
              d="M3.314,4.8h13.372c0.41,0,0.743-0.333,0.743-0.743c0-0.41-0.333-0.743-0.743-0.743H3.314 c-0.41,0-0.743,0.333-0.743,0.743C2.571,4.467,2.904,4.8,3.314,4.8z M16.686,15.2H3.314c-0.41,0-0.743,0.333-0.743,0.743 s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,15.2,16.686,15.2z M16.686,9.257H3.314 c-0.41,0-0.743,0.333-0.743,0.743s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,9.257,16.686,9.257z"
            />
          </svg>

          <svg
            className={styles.active}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="#202127"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.4 0.613356C16.88 0.0933556 16.04 0.0933556 15.52 0.613356L8.99996 7.12002L2.47996 0.600022C1.95996 0.080022 1.11996 0.080022 0.599961 0.600022C0.0799609 1.12002 0.0799609 1.96002 0.599961 2.48002L7.11996 9.00002L0.599961 15.52C0.0799609 16.04 0.0799609 16.88 0.599961 17.4C1.11996 17.92 1.95996 17.92 2.47996 17.4L8.99996 10.88L15.52 17.4C16.04 17.92 16.88 17.92 17.4 17.4C17.92 16.88 17.92 16.04 17.4 15.52L10.88 9.00002L17.4 2.48002C17.9066 1.97336 17.9066 1.12002 17.4 0.613356V0.613356Z"
              fill="#202127"
            />
          </svg>
        </Link>

        <Link href="/">
          <Image src="/zus-logo.svg" width="50" height="50" alt="" />
        </Link>
      </figure>

      <div className={styles.right}>
        <div className={styles.avatar}>
          <figure>
            <Image src="/user-photo.jpg" width="50" height="50" alt="" />
          </figure>
          <span>John Doe</span>
        </div>

        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  )
}
