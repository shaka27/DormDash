import StudentMaintenancePage from './StudentMaintenancePage'
import AdminMaintenancePage from './AdminMaintenancePage'

interface PageProps {
  requests: any[]
}

export default function Page({ requests }: PageProps) {
  // This page is now handled by the controller redirecting to separate pages
  // This component should not be used directly anymore
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Maintenance Page...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the appropriate maintenance interface.</p>
      </div>
    </div>
  )
}