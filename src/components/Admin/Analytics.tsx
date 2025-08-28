import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { BarChart3, TrendingUp, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Analytics: React.FC = () => {
  const { state } = useApp();
  const issues = state.issues;

  // Basic statistics
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;
  const pendingIssues = issues.filter(issue => issue.status === 'pending').length;
  const inProgressIssues = issues.filter(issue => issue.status === 'in-progress').length;

  // Resolution rate
  const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;

  // Average resolution time (mock calculation)
  const resolvedWithDates = issues.filter(issue => issue.status === 'resolved');
  const avgResolutionTime = resolvedWithDates.length > 0 ? 
    resolvedWithDates.reduce((acc, issue) => {
      const created = new Date(issue.createdAt);
      const updated = new Date(issue.updatedAt);
      return acc + (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
    }, 0) / resolvedWithDates.length : 0;

  // Category analysis
  const categoryBreakdown = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryStats = Object.entries(categoryBreakdown)
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalIssues) * 100,
      resolved: issues.filter(issue => issue.category === category && issue.status === 'resolved').length
    }))
    .sort((a, b) => b.count - a.count);

  // Department analysis
  const departmentBreakdown = issues.reduce((acc, issue) => {
    acc[issue.studentDepartment] = (acc[issue.studentDepartment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentStats = Object.entries(departmentBreakdown)
    .map(([department, count]) => ({
      department,
      count,
      percentage: (count / totalIssues) * 100,
      resolved: issues.filter(issue => issue.studentDepartment === department && issue.status === 'resolved').length
    }))
    .sort((a, b) => b.count - a.count);

  // Priority analysis
  const priorityBreakdown = issues.reduce((acc, issue) => {
    acc[issue.priority] = (acc[issue.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Time-based analysis (mock data for demonstration)
  const monthlyData = [
    { month: 'Jan', issues: 8, resolved: 6 },
    { month: 'Feb', issues: 12, resolved: 10 },
    { month: 'Mar', issues: 15, resolved: 12 },
    { month: 'Apr', issues: 10, resolved: 9 },
    { month: 'May', issues: 18, resolved: 14 },
    { month: 'Jun', issues: 22, resolved: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <BarChart3 className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600">
          Comprehensive analysis of campus issues and resolution performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{totalIssues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(resolutionRate)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Resolution</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgResolutionTime)}d</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{priorityBreakdown.high || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Issues by Category</h2>
          <div className="space-y-4">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{stat.category}</span>
                  <div className="text-sm text-gray-500">
                    {stat.count} total • {stat.resolved} resolved
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.round(stat.percentage)}% of total</span>
                  <span>{Math.round((stat.resolved / stat.count) * 100)}% resolved</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Issues by Department</h2>
          <div className="space-y-4">
            {departmentStats.map((stat) => (
              <div key={stat.department} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{stat.department}</span>
                  <div className="text-sm text-gray-500">
                    {stat.count} total • {stat.resolved} resolved
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.round(stat.percentage)}% of total</span>
                  <span>{Math.round((stat.resolved / stat.count) * 100)}% resolved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Priority Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{priorityBreakdown.high || 0}</div>
            <div className="text-sm text-red-700">High Priority</div>
            <div className="text-xs text-red-600 mt-1">
              {totalIssues > 0 ? Math.round(((priorityBreakdown.high || 0) / totalIssues) * 100) : 0}% of total
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{priorityBreakdown.medium || 0}</div>
            <div className="text-sm text-yellow-700">Medium Priority</div>
            <div className="text-xs text-yellow-600 mt-1">
              {totalIssues > 0 ? Math.round(((priorityBreakdown.medium || 0) / totalIssues) * 100) : 0}% of total
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{priorityBreakdown.low || 0}</div>
            <div className="text-sm text-green-700">Low Priority</div>
            <div className="text-xs text-green-600 mt-1">
              {totalIssues > 0 ? Math.round(((priorityBreakdown.low || 0) / totalIssues) * 100) : 0}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{pendingIssues}</div>
            <div className="text-sm text-gray-600">Pending Issues</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalIssues > 0 ? (pendingIssues / totalIssues) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{inProgressIssues}</div>
            <div className="text-sm text-gray-600">In Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalIssues > 0 ? (inProgressIssues / totalIssues) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{resolvedIssues}</div>
            <div className="text-sm text-gray-600">Resolved</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;