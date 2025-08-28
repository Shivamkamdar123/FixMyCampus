import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Clock, AlertCircle, CheckCircle, Filter, Search, Edit3, User, Calendar } from 'lucide-react';

const IssueManagement: React.FC = () => {
  const { state, updateIssue } = useApp();
  const issues = state.issues;
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIssue, setEditingIssue] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    assignedTo: '',
    adminRemarks: ''
  });

  const categories = [...new Set(issues.map(issue => issue.category))];

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  const handleEdit = (issue: any) => {
    setEditingIssue(issue.id);
    setEditForm({
      status: issue.status,
      assignedTo: issue.assignedTo || '',
      adminRemarks: issue.adminRemarks || ''
    });
  };

  const handleSave = (issueId: string) => {
    updateIssue(issueId, editForm);
    setEditingIssue(null);
    setEditForm({ status: '', assignedTo: '', adminRemarks: '' });
  };

  const handleCancel = () => {
    setEditingIssue(null);
    setEditForm({ status: '', assignedTo: '', adminRemarks: '' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'in-progress':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Issue Management</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            {filteredIssues.length} of {issues.length} issues
          </div>
        </div>

        {/* Issues List */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-150">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 lg:mb-0">
                    {getStatusIcon(issue.status)}
                    <h3 className="text-lg font-medium text-gray-900">{issue.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(issue.priority)}`}>
                      {issue.priority} priority
                    </span>
                    <button
                      onClick={() => handleEdit(issue)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-150"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{issue.description}</p>

                {/* Student Information */}
                <div className="bg-gray-50 rounded-md p-3 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <span className="font-medium text-gray-600">Student:</span>
                        <p className="text-gray-900">{issue.studentName}</p>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Roll No:</span>
                      <p className="text-gray-900">{issue.studentRollNo}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Department:</span>
                      <p className="text-gray-900">{issue.studentDepartment}</p>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <span className="font-medium text-gray-600">Reported:</span>
                        <p className="text-gray-900">{new Date(issue.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Category:</span>
                    <span className="ml-2 text-gray-900">{issue.category}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Location:</span>
                    <span className="ml-2 text-gray-900">{issue.location}</span>
                  </div>
                </div>

                {/* Edit Form */}
                {editingIssue === issue.id ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                        <input
                          type="text"
                          value={editForm.assignedTo}
                          onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                          placeholder="Assign to staff member..."
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Remarks</label>
                      <textarea
                        value={editForm.adminRemarks}
                        onChange={(e) => setEditForm({ ...editForm, adminRemarks: e.target.value })}
                        placeholder="Add your remarks or updates..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(issue.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-150"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Current Assignment & Remarks */
                  <div className="space-y-2">
                    {issue.assignedTo && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <div className="flex items-center text-sm text-blue-700">
                          <span className="font-medium mr-2">Assigned to:</span>
                          <span>{issue.assignedTo}</span>
                        </div>
                      </div>
                    )}

                    {issue.adminRemarks && (
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Remarks:</h4>
                        <p className="text-sm text-gray-600">{issue.adminRemarks}</p>
                      </div>
                    )}
                  </div>
                )}

                {issue.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={issue.imageUrl}
                      alt="Issue"
                      className="max-w-full h-auto rounded-md border border-gray-200"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueManagement;