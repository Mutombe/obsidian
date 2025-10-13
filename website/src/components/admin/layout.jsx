// components/Admin/AdminLayout.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Globe,
  Calendar,
  TrendingUp,
  Bell,
  User
} from "lucide-react";
import { logoutAdmin,selectUser } from "../../redux/slices/authSlice";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
    { name: 'Newsletters', href: '/admin/newsletters', icon: Mail },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { name: 'Content', href: '/admin/content', icon: Globe },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        className={`group flex items-center px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? 'text-yellow-400 bg-yellow-400/10 border-r-2 border-yellow-400'
            : 'text-gray-300 hover:text-white hover:bg-white/5'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon
          className={`mr-3 h-5 w-5 transition-colors ${
            isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white'
          }`}
        />
        {item.name}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center rounded">
                <Crown size={16} className="text-black" />
              </div>
              <div>
                <h1 className="gravesend-sans text-white text-lg font-light">Obsidian</h1>
                <p className="century-gothic text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center rounded-full">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="century-gothic text-sm font-medium text-white truncate">
                  {user?.first_name || user?.username}
                </p>
                <p className="century-gothic text-xs text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="century-gothic w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

