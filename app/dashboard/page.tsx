import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAttorneyByUserId, getLeadCount, getZipsByAttorney } from '@/lib/db'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/dashboard/login')
  }

  const attorney = getAttorneyByUserId(session.userId)
  const leadCount = attorney ? getLeadCount(attorney.id) : 0
  const zips = attorney ? getZipsByAttorney(attorney.id) : []

  return (
    <DashboardClient
      session={session}
      attorney={attorney || null}
      leadCount={leadCount}
      initialZips={zips}
    />
  )
}
