import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './Table.module.scss'

const Table = ({ data, itemsPerPage }) => {
  const [page, setPage] = useState(1)

  const pages = useMemo(() => {
    return Array.from(Array(Math.ceil(data.length / itemsPerPage)).keys())
  }, [data.length, itemsPerPage])

  return (
    <div className={styles.wrapper}>
      <table>
        <thead>
          <tr>
            <th>Transaction Hash</th>
            <th>Date (UT)</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map(e => (
            <tr key={e.hash}>
              <td>
                {e.hash}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(e.hash)
                  }}
                >
                  Copy
                </button>
              </td>
              <td>{e.date.toUTCString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {pages.map(e => (
          <button key={e} onClick={() => setPage(e)}>
            {e}
          </button>
        ))}
      </div>
    </div>
  )
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number,
}

Table.defaultProps = {
  data: [],
  itemsPerPage: 10,
}

export default Table
