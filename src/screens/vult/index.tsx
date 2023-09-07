import { useSelector } from 'react-redux'
import format from 'date-fns/format'

import LayoutDashboard from 'layouts/LayoutDashboard'
import { ContentBox } from 'components/ContentBox'
import { ProgressBar } from 'components/ProgressBar'
import Files from 'components/files'

import { selectActiveAllocation } from 'store/allocation'
import { bytesToString } from 'lib/utils'

export default function Vult() {
  const allocation = useSelector(selectActiveAllocation)

  const totalStorage = allocation?.size || 0
  const usedStorage = allocation?.stats?.used_size || 0
  const usedPercentage = (usedStorage / totalStorage) * 100
  const storageString = bytesToString(totalStorage)
  const usageString = bytesToString(usedStorage)

  const startDate = allocation.start_time
    ? new Date(allocation?.start_time * 1000).toISOString()
    : new Date().toDateString()
  const formatedStartDate =
    format(new Date(startDate), 'MMM do, yyyy, h:mm aaa') ?? '-'

  return (
    <LayoutDashboard>
      <ContentBox>
        <h1>
          <b>Allocation</b>
        </h1>
        <small>{formatedStartDate}</small>

        <ProgressBar
          value={usedPercentage}
          labelLeft={`${usageString} used of ${storageString}`}
          theme="vult"
        />
      </ContentBox>

      <Files />
    </LayoutDashboard>
  )
}
