import React from 'react';
import { useApp } from '../contexts/AppContext';
import { LogOut, Menu, X, Home, FileText, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  const isAdmin = state.auth.user?.role === 'admin';
  
  const navigation = isAdmin ? [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Issues', href: '/admin/issues', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ] : [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Report Issue', href: '/report', icon: FileText },
    { name: 'My Issues', href: '/issues', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className={`fixed inset-y-0 left-0 flex w-full max-w-xs transform flex-col bg-white transition duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 bg-blue-600">
              <span className="text-xl font-bold text-white">FixMyCampus</span>
              <button
                className="text-white hover:bg-blue-700 p-2 rounded-md"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 bg-white px-2 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`mr-4 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{state.auth.user?.name}</p>
                  <p className="text-xs text-gray-500">{state.auth.user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
          <div className="flex h-16 flex-shrink-0 items-center px-4 bg-blue-600">
            <span className="text-xl font-bold text-white">FixMyCampus</span>
          </div>
          <nav className="flex-1 space-y-1 bg-white px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center w-full">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{state.auth.user?.name}</p>
                <p className="text-xs text-gray-500">{state.auth.user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 bg-white shadow-sm lg:hidden">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-gray-900">FixMyCampus</h1>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;