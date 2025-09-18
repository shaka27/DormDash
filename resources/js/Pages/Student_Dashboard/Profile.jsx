import StudentDashboard from "./StudentDashboard";
import StudentLayout from "./StudentLayout";



export default function Profile() {
    return (
      <StudentLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Profile Page</h1>
        <p className="mt-2 text-muted-foreground">This page works!</p>
      </div>
      </StudentLayout>
      
    );
  }
  