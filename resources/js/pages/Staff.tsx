import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
  Users, 
 // Settings, 
  AlertTriangle, 
  //CheckCircle, 
  Clock, 
  Bell,
  Search,
  Plus,
//  Calendar,
  Wrench,
//  MessageSquare,
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

const StaffTasks: React.FC = () => {
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

  // Sample data - would come from Laravel backend
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
    // This would typically send data to Laravel backend
    console.log('Saving tasks:', taskStatus);
    alert('Tasks saved successfully!');
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-purple-600 text-white shadow-lg' 
          : 'text-purple-600 hover:bg-purple-100 hover:text-purple-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'purple' }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${
            color === 'purple' ? 'text-purple-600' :
            color === 'green' ? 'text-green-600' :
            color === 'yellow' ? 'text-yellow-600' :
            'text-red-600'
          }`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${
          color === 'purple' ? 'bg-purple-100' :
          color === 'green' ? 'bg-green-100' :
          color === 'yellow' ? 'bg-yellow-100' :
          'bg-red-100'
        }`}>
          <Icon className={`${
            color === 'purple' ? 'text-purple-600' :
            color === 'green' ? 'text-green-600' :
            color === 'yellow' ? 'text-yellow-600' :
            'text-red-600'
          }`} size={24} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }: any) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800',
      urgent: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800'
    };

    return (
      <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-1">
          <p className="text-gray-800 text-sm font-medium">{activity.message}</p>
          <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[activity.status as keyof typeof statusColors]}`}>
          {activity.status}
        </span>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Total Students" 
          value={dashboardStats.totalStudents}
          color="purple"
        />
        <StatCard 
          icon={Home} 
          title="Occupancy Rate" 
          value={`${dashboardStats.occupancyRate}%`}
          color="green"
        />
        <StatCard 
          icon={Clock} 
          title="Pending Requests" 
          value={dashboardStats.pendingRequests}
          color="yellow"
        />
        <StatCard 
          icon={AlertTriangle} 
          title="Urgent Issues" 
          value={dashboardStats.urgentIssues}
          color="red"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Student Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
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
                    <button className="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Maintenance & Work Orders</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>New Work Order</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
                      order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{order.assignedTo}</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Daily Tasks</h2>
        <button 
          onClick={saveTasks}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save Progress</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <label htmlFor="role" className="block mb-2 font-medium text-gray-700">
            Select your staff role:
          </label>
          <select
            id="role"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value as StaffRole)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            {staffRoles.map(role => (
              <option key={role.value} value={role.value} style={{ color: 'black' }}>
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
            <div key={task} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors">
              <span className="text-gray-800 font-medium flex-1">{task}</span>
              <div className="ml-4 flex items-center space-x-2">
                <label className="text-sm text-gray-600">Completed:</label>
                <select
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
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
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
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
    <div className="text-center py-12">
      <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
      <h3 className="text-lg font-medium text-gray-600">Reports Coming Soon</h3>
      <p className="text-gray-500">Generate detailed residence reports and analytics.</p>
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Home className="text-blue-600" size={24} />
                <h1 className="text-xl font-bold text-gray-800">DormDash</h1>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Staff Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <UserCheck size={20} />
                <span className="font-medium">Staff Name</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        {/* Sidebar Navigation Tabs */}
        <div className="w-56 flex-shrink-0 mr-8 flex flex-col justify-between" style={{ minHeight: '500px' }}>
          <nav className="flex flex-col space-y-2">
            <TabButton id="dashboard" label="Overview" icon={BarChart3} isActive={activeTab === 'dashboard'} onClick={setActiveTab} />
            <TabButton id="students" label="Students" icon={Users} isActive={activeTab === 'students'} onClick={setActiveTab} />
            <TabButton id="maintenance" label="Maintenance" icon={Wrench} isActive={activeTab === 'maintenance'} onClick={setActiveTab} />
            <TabButton id="tasks" label="Daily Tasks" icon={ClipboardList} isActive={activeTab === 'tasks'} onClick={setActiveTab} />
            <TabButton id="reports" label="Reports" icon={BarChart3} isActive={activeTab === 'reports'} onClick={setActiveTab} />
          </nav>
          <div className="mt-8">
            <Link href="/dashboard" className="text-purple-600 hover:underline font-medium">
              Go back to dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StaffTasks;