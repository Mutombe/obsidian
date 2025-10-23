// components/Admin/Settings.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Bell,
  Shield,
  Palette,
  Save,
  Loader2,
  Check,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import AdminLayout from "./layout";
import { selectUser } from "../../redux/slices/authSlice";
import api from "../../utils/api";

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    from_email: 'newsletter@obsidian.com',
    from_name: 'Obsidian Newsletter',
    reply_to: 'support@obsidian.com',
    smtp_host: '',
    smtp_port: 587,
    use_tls: true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    new_subscriber_alert: true,
    newsletter_sent_alert: true,
    weekly_report: true,
    system_updates: false
  });

  // Template Settings
  const [templateSettings, setTemplateSettings] = useState({
    default_template: 'modern',
    primary_color: '#fbbf24',
    secondary_color: '#f59e0b',
    logo_url: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/newsletter/admin/settings/');
      
      if (response.data.profile) {
        setProfileData(response.data.profile);
      }
      if (response.data.email) {
        setEmailSettings(response.data.email);
      }
      if (response.data.notifications) {
        setNotificationSettings(response.data.notifications);
      }
      if (response.data.template) {
        setTemplateSettings(response.data.template);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await api.put('/api/newsletter/admin/settings/profile/', profileData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/newsletter/admin/settings/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      setSaveStatus('success');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      setSaveStatus('error');
      alert(error.response?.data?.error || 'Failed to change password');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    try {
      setLoading(true);
      await api.put('/api/newsletter/admin/settings/email/', emailSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving email settings:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      await api.put('/api/newsletter/admin/settings/notifications/', notificationSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving notifications:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setLoading(true);
      await api.put('/api/newsletter/admin/settings/template/', templateSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving template settings:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'template', label: 'Templates', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gravesend-sans text-2xl font-light text-white flex items-center gap-3"
            >
              <SettingsIcon size={28} className="text-yellow-400" />
              Settings
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="century-gothic text-gray-400 mt-1"
            >
              Manage your account and application preferences
            </motion.p>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                saveStatus === 'success' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              <Check size={16} />
              <span className="century-gothic text-sm">
                {saveStatus === 'success' ? 'Settings saved successfully!' : 'Failed to save settings'}
              </span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-2 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-yellow-400/10 text-yellow-400 border-l-2 border-yellow-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
            >
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="gravesend-sans text-lg text-white mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileData.first_name}
                          onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                          className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileData.last_name}
                          onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                          className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="century-gothic bg-yellow-400 text-black px-6 py-2 font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Changes
                  </button>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="gravesend-sans text-lg text-white mb-4">Email Configuration</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="century-gothic text-sm text-gray-400 mb-2 block">
                            From Email
                          </label>
                          <input
                            type="email"
                            value={emailSettings.from_email}
                            onChange={(e) => setEmailSettings({...emailSettings, from_email: e.target.value})}
                            className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                        <div>
                          <label className="century-gothic text-sm text-gray-400 mb-2 block">
                            From Name
                          </label>
                          <input
                            type="text"
                            value={emailSettings.from_name}
                            onChange={(e) => setEmailSettings({...emailSettings, from_name: e.target.value})}
                            className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          Reply-To Email
                        </label>
                        <input
                          type="email"
                          value={emailSettings.reply_to}
                          onChange={(e) => setEmailSettings({...emailSettings, reply_to: e.target.value})}
                          className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      
                      <div className="border-t border-white/10 pt-4">
                        <h4 className="century-gothic text-sm font-medium text-white mb-3">SMTP Configuration</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="century-gothic text-sm text-gray-400 mb-2 block">
                              SMTP Host
                            </label>
                            <input
                              type="text"
                              value={emailSettings.smtp_host}
                              onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                              placeholder="smtp.example.com"
                              className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                          <div>
                            <label className="century-gothic text-sm text-gray-400 mb-2 block">
                              SMTP Port
                            </label>
                            <input
                              type="number"
                              value={emailSettings.smtp_port}
                              onChange={(e) => setEmailSettings({...emailSettings, smtp_port: parseInt(e.target.value)})}
                              className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={emailSettings.use_tls}
                              onChange={(e) => setEmailSettings({...emailSettings, use_tls: e.target.checked})}
                              className="w-4 h-4 accent-yellow-400"
                            />
                            <span className="century-gothic text-sm text-gray-300">Use TLS/SSL</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveEmailSettings}
                    disabled={loading}
                    className="century-gothic bg-yellow-400 text-black px-6 py-2 font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Email Settings
                  </button>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="gravesend-sans text-lg text-white mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                          <div>
                            <p className="century-gothic text-white font-medium capitalize">
                              {key.replace(/_/g, ' ')}
                            </p>
                            <p className="century-gothic text-sm text-gray-400 mt-1">
                              {key === 'new_subscriber_alert' && 'Receive alerts when new subscribers join'}
                              {key === 'newsletter_sent_alert' && 'Get notified when newsletters are sent'}
                              {key === 'weekly_report' && 'Receive weekly performance reports'}
                              {key === 'system_updates' && 'Get notified about system updates'}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              [key]: e.target.checked
                            })}
                            className="w-5 h-5 accent-yellow-400"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveNotifications}
                    disabled={loading}
                    className="century-gothic bg-yellow-400 text-black px-6 py-2 font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Preferences
                  </button>
                </div>
              )}

              {/* Template Settings */}
              {activeTab === 'template' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="gravesend-sans text-lg text-white mb-4">Newsletter Template</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          Default Template
                        </label>
                        <select
                          value={templateSettings.default_template}
                          onChange={(e) => setTemplateSettings({...templateSettings, default_template: e.target.value})}
                          className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                        >
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                          <option value="minimal">Minimal</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="century-gothic text-sm text-gray-400 mb-2 block">
                            Primary Color
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={templateSettings.primary_color}
                              onChange={(e) => setTemplateSettings({...templateSettings, primary_color: e.target.value})}
                              className="w-12 h-10 bg-transparent border border-white/20 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={templateSettings.primary_color}
                              onChange={(e) => setTemplateSettings({...templateSettings, primary_color: e.target.value})}
                              className="century-gothic flex-1 px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="century-gothic text-sm text-gray-400 mb-2 block">
                            Secondary Color
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={templateSettings.secondary_color}
                              onChange={(e) => setTemplateSettings({...templateSettings, secondary_color: e.target.value})}
                              className="w-12 h-10 bg-transparent border border-white/20 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={templateSettings.secondary_color}
                              onChange={(e) => setTemplateSettings({...templateSettings, secondary_color: e.target.value})}
                              className="century-gothic flex-1 px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          Logo URL
                        </label>
                        <input
                          type="url"
                          value={templateSettings.logo_url}
                          onChange={(e) => setTemplateSettings({...templateSettings, logo_url: e.target.value})}
                          placeholder="https://example.com/logo.png"
                          className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveTemplate}
                    disabled={loading}
                    className="century-gothic bg-yellow-400 text-black px-6 py-2 font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Template Settings
                  </button>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="gravesend-sans text-lg text-white mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                            className="century-gothic w-full px-4 py-2 pr-10 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          New Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                          className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="century-gothic text-sm text-gray-400 mb-2 block">
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                          className="century-gothic w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={loading || !passwordData.current_password || !passwordData.new_password}
                    className="century-gothic bg-yellow-400 text-black px-6 py-2 font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    Change Password
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;