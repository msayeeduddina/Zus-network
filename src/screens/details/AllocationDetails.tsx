import { useSelector } from 'react-redux'
import format from 'date-fns/format'

import LayoutDashboard from 'layouts/LayoutDashboard'
import { ContentBox } from 'components/ContentBox'

import { selectActiveAllocation } from 'store/allocation'
import { bytesToString } from 'lib/utils'

import stl from './Details.module.scss'

const AllocationDetails = () => {
  const allocation = useSelector(selectActiveAllocation)

  const expirationDate = allocation.expiration_date
    ? new Date(allocation?.expiration_date * 1000).toISOString()
    : new Date().toDateString()
  const formatedExpDate =
    format(new Date(expirationDate), 'MMM do, yyyy, h:mm aaa') ?? '-'

  const details = [
    {
      label: 'Allocation ID',
      value: allocation?.id,
    },
    {
      label: 'Expiration Date',
      value: formatedExpDate,
    },
    {
      label: 'Size',
      value: bytesToString(allocation?.size),
    },
    {
      label: 'Used Size',
      value: bytesToString(allocation?.stats?.used_size),
    },
  ]

  const shardDetails = [
    {
      label: 'Data Shards',
      value: allocation?.data_shards,
    },
    {
      label: 'Parity Shards',
      value: allocation?.parity_shards,
    },
    {
      label: 'Number of Writes',
      value: allocation?.stats?.num_of_writes,
    },
    {
      label: 'Number of Reads',
      value: allocation?.stats?.num_of_reads,
    },
    {
      label: 'Number of Failed Challenges',
      value: allocation?.stats?.num_failed_challenges,
    },
    allocation?.stats?.latest_closed_challenge && {
      label: 'Latest Closed Challenge',
      value: allocation?.stats?.latest_closed_challenge,
    },
  ].filter(Boolean)

  return (
    <LayoutDashboard>
      <ContentBox>
        <div className={stl.wrapper}>
          <h1>
            <b>Allocation Details</b>
          </h1>

          <div className={stl.list}>
            <h6>Details</h6>

            <div className={stl.items}>
              {allocation.id ? (
                details.map((item, i) => (
                  <div key={i} className={stl.item}>
                    <div className={stl.label}>{item.label}:</div>
                    <div className={stl.value}>{item.value}</div>
                  </div>
                ))
              ) : (
                <div className={stl.label}>No details available</div>
              )}
            </div>
          </div>

          <div className={stl.list}>
            <h6>Shards and Challenges</h6>

            <div className={stl.items}>
              {allocation.id ? (
                shardDetails.map((item, i) => {
                  return (
                    <div key={i} className={stl.item}>
                      <div className={stl.label}>{item.label}:</div>
                      <div className={stl.value}>{item.value}</div>
                    </div>
                  )
                })
              ) : (
                <div className={stl.label}>No details available</div>
              )}
            </div>
          </div>
        </div>
      </ContentBox>
    </LayoutDashboard>
  )
}

export default AllocationDetails
