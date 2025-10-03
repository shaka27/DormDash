import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Bell,
  Search,
  Plus,
  Calendar,
  Wrench,
  MessageSquare,
  BarChart3,
  Home,
  UserCheck,
  Filter,
  ClipboardList,
  Save
} from 'lucide-react';

type StaffRole =
  | 'Cafeteria Services'
  | 'Food & Beverages Services'
  | 'Hospitality Services'
  | 'Residence Services';

type TaskStatus = '' | 'yes' | 'no';

const StaffTasks = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [selectedRole, setSelectedRole] = useState<StaffRole>('Cafeteria Services');
  const [taskStatus, setTaskStatus] = useState<Record<string, TaskStatus>>({});

  const staffRoles: { label: string; value: StaffRole }[] = [
    { label: 'Cafeteria Services', value: 'Cafeteria Services' },
    { label: 'Food & Beverages Services', value: 'Food & Beverages Services' },
    { label: 'Hospitality Services', value: 'Hospitality Services' },
    { label: 'Residence Services', value: 'Residence Services' },
  ];

  const tasksByRole: Record<StaffRole, string[]> = {
    'Cafeteria Services': [
      'Food Preparation',
      'Setting up tables, linens, dinnerware, and serving equipment',
      'Cleaning all equipment',
    ],
    'Food & Beverages Services': [
      'Restocking supplies, ingredients, and beverage inventories',
      'Handling customer complaints and special requests',
    ],
    'Hospitality Services': [
      'Checking guests in and out of accommodations',
      'Handling room assignments',
      'Setting up meeting rooms or event spaces for functions',
    ],
    'Residence Services': [
      'Performing routine cleaning of living spaces, kitchens, and bathrooms',
      'Maintaining outdoor areas including gardens, pools, and recreational facilities',
      'Ensuring compliance with residence policies and safety protocols',
    ],
  };

  // Sample data
  const dashboardStats = {
    totalStudents: 247,
    occupancyRate: 89,
    pendingRequests: 12,
    urgentIssues: 3
  };

  const recentActivities = [
    { id: 1, type: 'maintenance', message: 'Room 204A - Air conditioner repair completed', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'student', message: 'New student check-in: Sarah Williams - Room 301B', time: '4 hours ago', status: 'info' },
    { id: 3, type: 'urgent', message: 'Water leak reported in Block C - 2nd floor', time: '6 hours ago', status: 'urgent' },
    { id: 4, type: 'maintenance', message: 'Weekly safety inspection scheduled for tomorrow', time: '1 day ago', status: 'pending' }
  ];

  const students = [
    { id: 1, name: 'John Smith', room: '101A', status: 'Active', phone: '012-345-6789', checkIn: '2024-02-01' },
    { id: 2, name: 'Sarah Williams', room: '301B', status: 'Active', phone: '012-987-6543', checkIn: '2024-02-15' },
    { id: 3, name: 'Mike Johnson', room: '204A', status: 'Active', phone: '012-456-7890', checkIn: '2024-01-28' },
    { id: 4, name: 'Emma Davis', room: '150C', status: 'Pending', phone: '012-654-3210', checkIn: '2024-03-01' }
  ];

  const workOrders = [
    { id: 1, room: '204A', issue: 'Air conditioner not working', priority: 'High', status: 'In Progress', assignedTo: 'Tom Wilson' },
    { id: 2, room: '301B', issue: 'Leaky faucet in bathroom', priority: 'Medium', status: 'Pending', assignedTo: 'Unassigned' },
    { id: 3, room: '105A', issue: 'Light bulb replacement', priority: 'Low', status: 'Completed', assignedTo: 'Mike Brown' }
  ];

  const handleStatusChange = (task: string, value: TaskStatus) => {
    setTaskStatus(prev => ({
      ...prev,
      [task]: value,
    }));
  };

  const saveTasks = () => {
    console.log('Saving tasks:', taskStatus);
    alert('Tasks saved successfully!');
  };

  // Stats Card Component (matching Student Dashboard style)
  const StatCard = ({ title, value, subtitle, icon, iconBg, iconColor }: any) => (
    <div className="bg-white rounded shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`${iconBg} ${iconColor} p-3 rounded`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  // Activity Item Component (matching Student Dashboard style)
  const ActivityItem = ({ activity }: any) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800',
      urgent: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      info: 'bg-purple-100 text-purple-800'
    };

    return (
      <div className="flex items-start justify-between p-4 border border-gray-200 rounded hover:shadow-sm transition-shadow">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{activity.message}</h3>
          <p className="text-sm text-gray-500">{activity.time}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[activity.status as keyof typeof statusColors]}`}>
          {activity.status}
        </span>
      </div>
    );
  };

  // Quick Action Button Component (matching Student Dashboard style)
  const QuickActionButton = ({ onClick, icon, title, description }: any) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-4 border border-gray-200 rounded hover:shadow-sm hover:border-purple-300 transition-all"
    >
      <span className="text-2xl mb-2">{icon}</span>
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 text-center">{description}</p>
    </button>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Staff Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Manage residence operations and track daily activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={dashboardStats.totalStudents}
          subtitle="Currently residing"
          icon="👥"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${dashboardStats.occupancyRate}%`}
          subtitle="Rooms occupied"
          icon="🏠"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard 
          title="Pending Requests" 
          value={dashboardStats.pendingRequests}
          subtitle="Awaiting action"
          icon="⏰"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard 
          title="Urgent Issues" 
          value={dashboardStats.urgentIssues}
          subtitle="Require immediate attention"
          icon="⚠️"
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-lg mr-3">📋</span>
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Latest updates and maintenance tasks</p>
          </div>
          <div className="p-6 space-y-4">
            {recentActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionButton
              onClick={() => setActiveTab('students')}
              icon="👥"
              title="Students"
              description="Manage residents"
            />
            <QuickActionButton
              onClick={() => setActiveTab('maintenance')}
              icon="🔧"
              title="Maintenance"
              description="Work orders"
            />
            <QuickActionButton
              onClick={() => setActiveTab('tasks')}
              icon="✅"
              title="Daily Tasks"
              description="Track progress"
            />
            <QuickActionButton
              onClick={() => setActiveTab('reports')}
              icon="📊"
              title="Reports"
              description="View analytics"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
            <p className="text-gray-600 mt-1">View and manage residence students</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Room</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Phone</th>
                <th className="text-left p-4 font-medium text-gray-600">Check-in Date</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.filter(student => 
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.room.toLowerCase().includes(searchTerm.toLowerCase())
              ).map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{student.name}</td>
                  <td className="p-4 text-gray-600">{student.room}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{student.phone}</td>
                  <td className="p-4 text-gray-600">{student.checkIn}</td>
                  <td className="p-4">
                    <button className="text-purple-600 hover:text-purple-800 font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Maintenance & Work Orders</h2>
            <p className="text-gray-600 mt-1">Track and manage maintenance requests</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>New Work Order</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Active Work Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Room</th>
                <th className="text-left p-4 font-medium text-gray-600">Issue</th>
                <th className="text-left p-4 font-medium text-gray-600">Priority</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Assigned To</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{order.room}</td>
                  <td className="p-4 text-gray-600">{order.issue}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.priority === 'High' ? 'bg-red-100 text-red-800' :
                      order.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{order.assignedTo}</td>
                  <td className="p-4">
                    <button className="text-purple-600 hover:text-purple-800 font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Tasks</h2>
            <p className="text-gray-600 mt-1">Track your daily work progress</p>
          </div>
          <button 
            onClick={saveTasks}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save Progress</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-6">
        <div className="mb-6">
          <label htmlFor="role" className="block mb-2 font-medium text-gray-700">
            Select your staff role:
          </label>
          <select
            id="role"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value as StaffRole)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {staffRoles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Daily Tasks for {selectedRole}
        </h3>

        <div className="space-y-3">
          {tasksByRole[selectedRole].map((task, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded hover:shadow-sm transition-shadow flex items-center justify-between">
              <span className="text-gray-800 font-medium flex-1">{task}</span>
              <div className="ml-4 flex items-center space-x-2">
                <label className="text-sm text-gray-600">Completed:</label>
                <select
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={taskStatus[task] ?? ''}
                  onChange={e => handleStatusChange(task, e.target.value as TaskStatus)}
                >
                  <option value="">Select</option>
                  <option value="yes">✅ Yes</option>
                  <option value="no">❌ No</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Task Progress Summary */}
        <div className="mt-6 p-4 border border-purple-200 rounded bg-purple-50">
          <h4 className="font-semibold text-purple-800 mb-2">Progress Summary</h4>
          <div className="text-sm text-purple-700">
            Completed: {Object.values(taskStatus).filter(status => status === 'yes').length} / {tasksByRole[selectedRole].length} tasks
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
              style={{
                width: `${(Object.values(taskStatus).filter(status => status === 'yes').length / tasksByRole[selectedRole].length) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
        <p className="text-gray-600">Generate detailed residence reports and analytics</p>
      </div>

      <div className="bg-white rounded shadow-sm p-12 text-center">
        <span className="text-6xl mb-4 block">📊</span>
        <h3 className="text-lg font-medium text-gray-600 mb-2">Reports Coming Soon</h3>
        <p className="text-gray-500">Generate detailed residence reports and analytics.</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'students': return renderStudents();
      case 'maintenance': return renderMaintenance();
      case 'tasks': return renderTasks();
      case 'reports': return renderReports();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - matching Student Dashboard */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏠</span>
                <h1 className="text-xl font-bold text-gray-800">DormDash</h1>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Staff Portal</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                <span className="text-xl">🔔</span>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-xl">👤</span>
                <span className="font-medium">Staff Name</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Left Sidebar Navigation */}
          <aside className="w-64 bg-white rounded shadow-sm p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded text-left transition-all duration-200 ${
                  activeTab === 'dashboard' 
                    ? 'bg-purple-600 text-white shadow' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <BarChart3 size={20} />
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded text-left transition-all duration-200 ${
                  activeTab === 'students' 
                    ? 'bg-purple-600 text-white shadow' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Users size={20} />
                <span className="font-medium">Students</span>
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded text-left transition-all duration-200 ${
                  activeTab === 'maintenance' 
                    ? 'bg-purple-600 text-white shadow' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Wrench size={20} />
                <span className="font-medium">Maintenance</span>
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded text-left transition-all duration-200 ${
                  activeTab === 'tasks' 
                    ? 'bg-purple-600 text-white shadow' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <ClipboardList size={20} />
                <span className="font-medium">Daily Tasks</span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded text-left transition-all duration-200 ${
                  activeTab === 'reports' 
                    ? 'bg-purple-600 text-white shadow' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <BarChart3 size={20} />
                <span className="font-medium">Reports</span>
              </button>
            </nav>
            
            {/* Go back to dashboard hyperlink */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a 
                href="/dashboard" 
                className="text-purple-600 hover:text-purple-800 hover:underline text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Home size={16} />
                <span>Go back to the dashboard</span>
              </a>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StaffTasks;