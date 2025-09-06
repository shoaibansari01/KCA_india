import React, { useState, useEffect } from 'react';
import { Users, FileText, CreditCard, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import { dashboardService } from '../../services/dashboardService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts if API doesn't return chart data
  const monthlyData = [
    { name: 'Jan', registrations: 65, payments: 45 },
    { name: 'Feb', registrations: 59, payments: 52 },
    { name: 'Mar', registrations: 80, payments: 70 },
    { name: 'Apr', registrations: 81, payments: 68 },
    { name: 'May', registrations: 56, payments: 48 },
    { name: 'Jun', registrations: 55, payments: 51 }
  ];

  const categoryData = [
    { name: 'School', value: 400, color: '#3B82F6' },
    { name: 'Individual', value: 300, color: '#10B981' },
    { name: 'Global', value: 200, color: '#F59E0B' },
    { name: 'National', value: 100, color: '#EF4444' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your KCA platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={dashboardData?.totalUsers || '0'}
          icon={Users}
          change="12"
          changeType="positive"
          color="blue"
        />
        <StatsCard
          title="Registrations"
          value={dashboardData?.totalRegistrationForm || '0'}
          icon={FileText}
          change="8"
          changeType="positive"
          color="green"
        />
        <StatsCard
          title="National Payments"
          value={dashboardData?.nationalTotalAmt || '0'}
          icon={CreditCard}
          change="5"
          changeType="positive"
          color="yellow"
        />
        <StatsCard
          title="Global Revenue"
          value={`₹${dashboardData?.globalPaymets?.national || 0}`}
          icon={TrendingUp}
          change="15"
          changeType="positive"
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="registrations" fill="#3B82F6" name="Registrations" />
              <Bar dataKey="payments" fill="#10B981" name="Payments" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center mt-4 space-x-4">
            {categoryData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { type: 'registration', user: 'John Doe', action: 'registered for National competition', time: '2 hours ago' },
              { type: 'payment', user: 'Jane Smith', action: 'completed payment of ₹500', time: '4 hours ago' },
              { type: 'user', user: 'Mike Johnson', action: 'created new account', time: '6 hours ago' },
              { type: 'registration', user: 'Sarah Wilson', action: 'registered for Global competition', time: '8 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'registration' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;