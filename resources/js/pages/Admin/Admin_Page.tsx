import React, { useState, useEffect } from 'react';
import {
  Users,
  Building,
  Bed,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  MessageSquare,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Search,
  Filter,
  Download,
  UserPlus,
  Home,
  Key,
  AlertCircle,
  Mail
} from 'lucide-react';

// Types
interface Student {
  id: string;
  studentNumber: string;
  name: string;
  email: string;
  phone: string;
  faculty: string;
  year: number;
  gender: 'male' | 'female';
  applicationStatus: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  dormAssignment?: string;
  roomNumber?: string;
  applicationDate: string;
  preferences: string[];
}

interface Dormitory {
  id: string;
  name: string;
  campus: string;
  type: 'male' | 'female' | 'mixed';
  totalRooms: number;
  occupiedRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  pricePerSemester: number;
  amenities: string[];
  status: 'active' | 'maintenance' | 'closed' | 'available';
  description: string;
}

interface Room {
  id: string;
  roomNumber: string;
  dormitoryId: string;
  dormitoryName: string;
  capacity: number;
  currentOccupants: number;
  type: 'single' | 'double' | 'triple' | 'quad';
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  occupants: string[];
  amenities: string[];
}

interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  preferences: string[];
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  assignedDorm?: string;
  assignedRoom?: string;
  notes?: string;
}

interface DashboardStats {
  totalStudents: number;
  totalDorms: number;
  occupancyRate: number;
  pendingApplications: number;
  totalRevenue: number;
  availableRooms: number;
}

const DormDash: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalDorms: 0,
    occupancyRate: 0,
    pendingApplications: 0,
    totalRevenue: 0,
    availableRooms: 0
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [dormitories, setDormitories] = useState<Dormitory[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/students');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Fetch dormitories
  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const response = await fetch('/api/admin/dormitories');
        const data = await response.json();
        setDormitories(data);
      } catch (error) {
        console.error('Error fetching dormitories:', error);
      }
    };
    fetchDormitories();
  }, []);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/admin/applications');
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    fetchApplications();
  }, []);

  // Function to update application status
  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh applications
        const updatedApps = await fetch('/api/admin/applications');
        const data = await updatedApps.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  // Function to get the status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'maintenance':
      case 'reserved':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
      case 'closed':
        return 'text-red-600 bg-red-100';
      case 'waitlisted':
      case 'occupied':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; change?: string }> =
    ({ title, value, icon, change }) => (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && <p className="text-sm text-green-600">{change}</p>}
          </div>
          <div className="text-purple-600">{icon}</div>
        </div>
      </div>
    );

  const TabButton: React.FC<{ id: string; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-purple-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Total Dormitories"
          value={stats.totalDorms}
          icon={<Building size={24} />}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={<Bed size={24} />}
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          icon={<Clock size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app: Application) => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{app.studentName}</p>
                    <p className="text-sm text-gray-600">{app.studentNumber} - {app.preferences[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{new Date(app.applicationDate).toLocaleDateString()}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No recent applications found.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Dormitory Occupancy</h3>
          {dormitories.length > 0 ? (
            <div className="space-y-3">
              {dormitories.slice(0, 5).map((dorm: Dormitory) => (
                <div key={dorm.id} className="p-3 border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{dorm.name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(dorm.status)}`}>
                      {dorm.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{dorm.occupiedRooms}/{dorm.totalRooms} rooms</span>
                    <span>{((dorm.occupiedRooms / dorm.totalRooms) * 100).toFixed(1)}% occupied</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(dorm.occupiedRooms / dorm.totalRooms) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((dorm.occupiedRooms / dorm.totalRooms) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No dormitories to display.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStudentManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {loading ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading students...</p>
        </div>
      ) : students.length > 0 ? (
        <table className="min-w-full">
          {/* ... table content ... */}
        </table>
      ) : (
        <p className="py-8 text-center text-gray-500">No students found.</p>
      )}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="all">All Faculties</option>
            <option value="engineering">Engineering</option>
            <option value="commerce">Commerce</option>
            <option value="humanities">Humanities</option>
            <option value="fnas">Natural&AgriculuralSciences</option>
            <option value="education">Education</option>
            <option value="humanities">Humanities</option>
            <option value="ems">EMS</option>
          </select>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Import Students
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {students.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student: Student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.studentNumber}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.faculty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Year {student.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.applicationStatus)}`}>
                      {student.applicationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.dormAssignment ? (
                      <div>
                        <div>{student.dormAssignment}</div>
                        <div className="text-xs text-gray-500">Room {student.roomNumber}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-purple-600 hover:text-purple-800"><Eye size={16} /></button>
                    <button className="text-purple-600 hover:text-purple-800"><Key size={16} /></button>
                    <button className="text-purple-600 hover:text-purple-800"><Mail size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="py-8 text-center text-gray-500">No students found.</p>
        )}
      </div>
    </div>
  );

  const renderDormitoryManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dormitory Management</h2>
        <div className="flex space-x-2">
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
          >
            <option value="all">All Campuses</option>
            <option value="potchefstroom">Potchefstroom</option>
            <option value="vanderbijlpark">Vanderbijlpark</option>
            <option value="mafikeng">Mahikeng</option>
          </select>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Add Dormitory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dormitories.length > 0 ? (
          dormitories.map((dorm: Dormitory) => (
            <div key={dorm.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{dorm.name}</h3>
                  <p className="text-sm text-gray-600">{dorm.campus} Campus</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(dorm.status)}`}>
                  {dorm.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium capitalize">{dorm.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rooms:</span>
                  <span className="text-sm font-medium">{dorm.occupiedRooms}/{dorm.totalRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Beds:</span>
                  <span className="text-sm font-medium">{dorm.occupiedBeds}/{dorm.totalBeds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-sm font-medium">R{dorm.pricePerSemester.toLocaleString()}/semester</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Occupancy Rate</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(dorm.occupiedRooms / dorm.totalRooms) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((dorm.occupiedRooms / dorm.totalRooms) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="mt-4 flex justify-between">
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View Details</button>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">Manage Rooms</button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No dormitories found.</p>
        )}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Application Management</h2>
        <div className="flex space-x-2 items-center flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="waitlisted">Waitlisted</option>
          </select>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {applications.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferences</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app: Application) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.studentName}</div>
                    <div className="text-sm text-gray-500">{app.studentNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(app.applicationDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <ul className="list-disc pl-5">
                      {app.preferences.map((pref, index) => <li key={index}>{pref}</li>)}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.assignedDorm ? (
                      <div>
                        <div>{app.assignedDorm}</div>
                        <div className="text-xs text-gray-500">Room {app.assignedRoom}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button title="View Details" className="text-purple-600 hover:text-purple-800"><Eye size={16} /></button>
                    <button 
                      title="Approve" 
                      className="text-green-600 hover:text-green-800"
                      onClick={() => updateApplicationStatus(app.id, 'approved')}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button 
                      title="Reject" 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                    >
                      <XCircle size={16} />
                    </button>
                    <button title="Assign Dormitory" className="text-purple-600 hover:text-purple-800"><Key size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="py-8 text-center text-gray-500">No applications found.</p>
        )}
      </div>
    </div>
  );

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'students':
        return renderStudentManagement();
      case 'dormitories':
        return renderDormitoryManagement();
      case 'applications':
        return renderApplications();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="bg-white border-r p-4 md:w-64 min-h-screen">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
              <Home size={28} />
              DormDash
            </h1>
            <p className="text-sm text-gray-500 mt-1">Admin</p>
          </div>
          <nav className="mt-8 space-y-2">
            <TabButton id="dashboard" label="Dashboard" icon={<Home size={20} />} />
            <TabButton id="students" label="Students" icon={<Users size={20} />} />
            <TabButton id="dormitories" label="Dormitories" icon={<Building size={20} />} />
            <TabButton id="applications" label="Applications" icon={<Calendar size={20} />} />
           
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin</h1>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <button className="text-gray-600 hover:text-purple-600">
                <Bell size={24} />
              </button>
              <button className="text-gray-600 hover:text-purple-600">
                <MessageSquare size={24} />
              </button>
              <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-bold">
                AD
              </div>
            </div>
          </header>

          <section className="mt-6">
            {renderView()}
          </section>
        </main>
      </div>
    </div>
  );
};

export default DormDash;