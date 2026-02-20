import toast from 'react-hot-toast';

/**
 * Show notification based on user preferences
 * @param {Object} user - User object from Redux state
 * @param {String} type - Notification type: 'orderUpdates', 'promotions', 'newsletter', 'stockAlerts'
 * @param {String} message - Notification message
 * @param {Object} options - Toast options
 */
export const showNotification = (user, type, message, options = {}) => {
  // If no user or notifications not defined, show notification (default behavior)
  if (!user || !user.notifications) {
    return toast(message, options);
  }

  // Check if user has enabled this notification type
  const isEnabled = user.notifications[type];
  
  if (isEnabled !== false) {
    return toast(message, options);
  }
  
  // Notification is disabled, don't show
  return null;
};

/**
 * Show success notification
 */
export const showSuccessNotification = (user, type, message) => {
  return showNotification(user, type, message, {
    icon: '✅',
    duration: 3000,
  });
};

/**
 * Show error notification
 */
export const showErrorNotification = (user, type, message) => {
  return showNotification(user, type, message, {
    icon: '❌',
    duration: 4000,
  });
};

/**
 * Show info notification
 */
export const showInfoNotification = (user, type, message) => {
  return showNotification(user, type, message, {
    icon: 'ℹ️',
    duration: 3000,
  });
};

/**
 * Show warning notification
 */
export const showWarningNotification = (user, type, message) => {
  return showNotification(user, type, message, {
    icon: '⚠️',
    duration: 3500,
  });
};

/**
 * Show order update notification
 */
export const showOrderUpdateNotification = (user, message, status = 'info') => {
  const icons = {
    success: '✅',
    info: '📦',
    warning: '⚠️',
    error: '❌',
  };

  return showNotification(user, 'orderUpdates', message, {
    icon: icons[status] || icons.info,
    duration: 4000,
  });
};

/**
 * Show stock alert notification
 */
export const showStockAlertNotification = (user, message, isOutOfStock = false) => {
  return showNotification(user, 'stockAlerts', message, {
    icon: isOutOfStock ? '❌' : '⚠️',
    duration: 3500,
  });
};

/**
 * Show promotional notification
 */
export const showPromotionalNotification = (user, message) => {
  return showNotification(user, 'promotions', message, {
    icon: '🎉',
    duration: 4000,
  });
};

/**
 * Always show notification (bypasses user preferences)
 * Use for critical notifications that must be shown
 */
export const showCriticalNotification = (message, type = 'error') => {
  const toastTypes = {
    success: toast.success,
    error: toast.error,
    info: toast,
    warning: toast,
  };

  const toastFn = toastTypes[type] || toast;
  return toastFn(message, {
    duration: 5000,
  });
};

/**
 * Check if notification type is enabled for user
 */
export const isNotificationEnabled = (user, type) => {
  if (!user || !user.notifications) {
    return true; // Default to enabled if no preferences set
  }
  return user.notifications[type] !== false;
};
