import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Lock,
  Bell,
  Mail,
  Phone,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button, Input } from "../components/ui";
import axios from "../api/axios";
import { logout, setUser } from "../store/slices/authSlice";

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
      country: user?.address?.country || "India",
    },
  });

  // Password Settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    orderUpdates: user?.notifications?.orderUpdates ?? true,
    promotions: user?.notifications?.promotions ?? true,
    newsletter: user?.notifications?.newsletter ?? false,
    stockAlerts: user?.notifications?.stockAlerts ?? true,
  });

  // Sync profileData with user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || "",
          country: user.address?.country || "India",
        },
      });
      setNotifications({
        orderUpdates: user.notifications?.orderUpdates ?? true,
        promotions: user.notifications?.promotions ?? true,
        newsletter: user.notifications?.newsletter ?? false,
        stockAlerts: user.notifications?.stockAlerts ?? true,
      });
    }
  }, [user]);

  const showResult = (type, message) => {
    setResult({ type, message });
    setTimeout(() => setResult(null), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch("/auth/profile", profileData);
      // Update user in Redux store and localStorage
      if (response.data.user) {
        dispatch(setUser(response.data.user));
      }
      showResult("success", "Profile updated successfully");
    } catch (error) {
      showResult(
        "error",
        error.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showResult("error", "New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showResult("error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await axios.patch("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showResult("success", "Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showResult(
        "error",
        error.response?.data?.message || "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.patch("/auth/notifications", notifications);
      // Update user in Redux store with new notification preferences
      if (response.data.user) {
        dispatch(setUser(response.data.user));
      } else {
        // If backend doesn't return user, update locally
        dispatch(setUser({ ...user, notifications }));
      }
      showResult("success", "Notification preferences updated");
    } catch {
      showResult("error", "Failed to update notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone!",
      )
    ) {
      return;
    }

    const confirmText = window.prompt('Type "DELETE" to confirm:');
    if (confirmText !== "DELETE") {
      showResult("error", "Account deletion cancelled");
      return;
    }

    setLoading(true);
    try {
      await axios.delete("/auth/account");
      showResult("success", "Account deleted successfully");
      setTimeout(() => {
        dispatch(logout());
      }, 2000);
    } catch {
      showResult("error", "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Result Alert */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            result.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{result.message}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <User size={24} />
                  Profile Information
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Address
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <Input
                          type="text"
                          value={profileData.address.street}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              address: {
                                ...profileData.address,
                                street: e.target.value,
                              },
                            })
                          }
                          placeholder="Enter your street address"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <Input
                            type="text"
                            value={profileData.address.city}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                address: {
                                  ...profileData.address,
                                  city: e.target.value,
                                },
                              })
                            }
                            placeholder="City"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <Input
                            type="text"
                            value={profileData.address.state}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                address: {
                                  ...profileData.address,
                                  state: e.target.value,
                                },
                              })
                            }
                            placeholder="State"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode
                          </label>
                          <Input
                            type="text"
                            value={profileData.address.pincode}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                address: {
                                  ...profileData.address,
                                  pincode: e.target.value,
                                },
                              })
                            }
                            placeholder="Pincode"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <Input
                            type="text"
                            value={profileData.address.country}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                address: {
                                  ...profileData.address,
                                  country: e.target.value,
                                },
                              })
                            }
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      <Save size={18} />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Lock size={24} />
                  Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      <Lock size={18} />
                      Change Password
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Bell size={24} />
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h3 className="font-medium">Order Updates</h3>
                      <p className="text-sm text-gray-600">
                        Get notified about order status changes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.orderUpdates}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            orderUpdates: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h3 className="font-medium">Promotions & Offers</h3>
                      <p className="text-sm text-gray-600">
                        Receive updates about special deals
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.promotions}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            promotions: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h3 className="font-medium">Newsletter</h3>
                      <p className="text-sm text-gray-600">
                        Get weekly newsletter with tips and updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.newsletter}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            newsletter: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-medium">Stock Alerts</h3>
                      <p className="text-sm text-gray-600">
                        Alert when low-stock items are restocked
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.stockAlerts}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            stockAlerts: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleNotificationUpdate}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      <Save size={18} />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Shield size={24} />
                  Privacy & Security
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Account Status</h3>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Your account is active and secure
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2 text-red-600">
                      Danger Zone
                    </h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-4">
                      <div>
                        <h4 className="font-medium text-red-900">
                          Delete Account
                        </h4>
                        <p className="text-sm text-red-700 mt-1">
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        onClick={handleDeleteAccount}
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                        Delete My Account
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Data & Privacy</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          size={16}
                          className="text-green-600 mt-0.5 flex-shrink-0"
                        />
                        <span>Your data is encrypted and stored securely</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          size={16}
                          className="text-green-600 mt-0.5 flex-shrink-0"
                        />
                        <span>
                          We never share your personal information with third
                          parties
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          size={16}
                          className="text-green-600 mt-0.5 flex-shrink-0"
                        />
                        <span>
                          You can request a copy of your data at any time
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          size={16}
                          className="text-green-600 mt-0.5 flex-shrink-0"
                        />
                        <span>
                          Auto logout after 30 days of inactivity for security
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
