import React from 'react';
import toast from 'react-hot-toast';
import { navigateTo } from './navigationService';

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
 * Show order update notification with optional click-to-navigate
 */
export const showOrderUpdateNotification = (user, message, status = 'info', orderId = null) => {
  const icons = {
    success: '✅',
    info: '📦',
    warning: '⚠️',
    error: '❌',
  };

  // If no user or notifications not defined, show notification (default behavior)
  if (!user || !user.notifications) {
    if (orderId) {
      return toast.custom((t) => 
        React.createElement('div', {
          onClick: () => {
            toast.dismiss(t.id);
            navigateTo(`/orders/${orderId}`);
          },
          style: {
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '400px',
            transition: 'transform 0.2s',
          },
          onMouseEnter: (e) => e.currentTarget.style.transform = 'scale(1.02)',
          onMouseLeave: (e) => e.currentTarget.style.transform = 'scale(1)'
        }, [
          React.createElement('span', { style: { fontSize: '24px' }, key: 'icon' }, icons[status] || icons.info),
          React.createElement('div', { style: { flex: 1 }, key: 'content' }, [
            React.createElement('p', { style: { margin: 0, fontWeight: '500', color: '#333' }, key: 'msg' }, message),
            React.createElement('p', { style: { margin: '4px 0 0 0', fontSize: '12px', color: '#666' }, key: 'hint' }, 'Click to view order details')
          ])
        ])
      , { duration: 4000 });
    }
    return toast(message, {
      icon: icons[status] || icons.info,
      duration: 4000,
    });
  }

  // Check if user has enabled this notification type
  const isEnabled = user.notifications['orderUpdates'];
  
  if (isEnabled !== false) {
    if (orderId) {
      return toast.custom((t) => 
        React.createElement('div', {
          onClick: () => {
            toast.dismiss(t.id);
            navigateTo(`/orders/${orderId}`);
          },
          style: {
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '400px',
            transition: 'transform 0.2s',
          },
          onMouseEnter: (e) => e.currentTarget.style.transform = 'scale(1.02)',
          onMouseLeave: (e) => e.currentTarget.style.transform = 'scale(1)'
        }, [
          React.createElement('span', { style: { fontSize: '24px' }, key: 'icon' }, icons[status] || icons.info),
          React.createElement('div', { style: { flex: 1 }, key: 'content' }, [
            React.createElement('p', { style: { margin: 0, fontWeight: '500', color: '#333' }, key: 'msg' }, message),
            React.createElement('p', { style: { margin: '4px 0 0 0', fontSize: '12px', color: '#666' }, key: 'hint' }, 'Click to view order details')
          ])
        ])
      , { duration: 4000 });
    }
    return toast(message, {
      icon: icons[status] || icons.info,
      duration: 4000,
    });
  }
  
  // Notification is disabled, don't show
  return null;
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
