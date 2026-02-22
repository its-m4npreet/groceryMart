/**
 * Global navigation service for use outside of React components
 * Allows navigation without hooks
 */

let navigate = null;

export const setNavigate = (navigateFunction) => {
  navigate = navigateFunction;
};

export const navigateTo = (path, options = {}) => {
  if (navigate) {
    navigate(path, options);
  } else {
    // Fallback to window.location if navigate not set
    window.location.href = path;
  }
};

export const getNavigate = () => navigate;
