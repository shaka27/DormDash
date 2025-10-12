import MaintenancePage from './MaintenancePage'

interface PageProps {
  requests: any[]
  userRole: 'student' | 'admin' | 'house_parent' | 'house_committee'
}

export default function Page({ requests, userRole }: PageProps) {
  return <MaintenancePage initialRequests={requests} userRole={userRole} />
}
