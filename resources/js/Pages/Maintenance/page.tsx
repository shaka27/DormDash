import StudentMaintenancePage from './StudentMaintenancePage'
import AdminMaintenancePage from './AdminMaintenancePage'

interface PageProps {
  requests: any[]
  userRole: 'student' | 'admin' | 'house_parent' | 'house_committee'
}

export default function Page({ requests, userRole }: PageProps) {
  const isAdmin = userRole === 'admin' || userRole === 'house_parent' || userRole === 'house_committee'
  
  return isAdmin ? (
    <AdminMaintenancePage initialRequests={requests} />
  ) : (
    <StudentMaintenancePage initialRequests={requests} />
  )
}
