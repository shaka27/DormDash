import React from "react"
import MaintenancePage from "./MaintenancePage"

interface PageProps {
  role: "student" | "admin"
}

export default function Page({ role }: PageProps) {
  return <MaintenancePage role={role} />
}
