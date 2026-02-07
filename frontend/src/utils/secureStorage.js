/**
 * Secure Storage utility for encrypting sensitive data in localStorage
 * Uses AES-GCM encryption with Web Crypto API
 */

// Generate a consistent encryption key based on a secret phrase combined with browser fingerprint
const generateKey = async () => {
  const secret =
    import.meta.env.VITE_STORAGE_SECRET || "grocerymart-secure-key-2024";

  // Create a more unique key by combining secret with browser info
  const browserInfo = `${navigator.userAgent}-${navigator.language}`;
  const keyData = `${secret}-${browserInfo}`;

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(keyData),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("grocerymart-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
};

/**
 * Encrypt data using AES-GCM
 * @param {string} data - Data to encrypt
 * @returns {Promise<string>} - Base64 encoded encrypted data with IV
 */
const encrypt = async (data) => {
  try {
    const key = await generateKey();
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM

    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoder.encode(data),
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption error:", error);
    // Fallback to plain storage if encryption fails
    return data;
  }
};

/**
 * Decrypt data using AES-GCM
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @returns {Promise<string>} - Decrypted data
 */
const decrypt = async (encryptedData) => {
  try {
    const key = await generateKey();

    // Convert from base64
    const combined = Uint8Array.from(atob(encryptedData), (c) =>
      c.charCodeAt(0),
    );

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data,
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    // If decryption fails, assume it's plain text (backward compatibility)
    return encryptedData;
  }
};

/**
 * Securely store data in localStorage with encryption
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export const secureSetItem = async (key, value) => {
  try {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    const encrypted = await encrypt(stringValue);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error("SecureStorage setItem error:", error);
    // Fallback to regular localStorage
    localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    );
  }
};

/**
 * Retrieve and decrypt data from localStorage
 * @param {string} key - Storage key
 * @param {boolean} parseJSON - Whether to parse as JSON (default: true)
 * @returns {Promise<any>} - Decrypted value
 */
export const secureGetItem = async (key, parseJSON = true) => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const decrypted = await decrypt(encrypted);

    if (parseJSON) {
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    }

    return decrypted;
  } catch (error) {
    console.error("SecureStorage getItem error:", error);
    // Fallback to regular localStorage
    const value = localStorage.getItem(key);
    if (!value) return null;

    if (parseJSON) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    return value;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const secureRemoveItem = (key) => {
  localStorage.removeItem(key);
};

/**
 * Clear all items from localStorage
 */
export const secureClear = () => {
  localStorage.clear();
};

/**
 * Synchronous versions for backward compatibility
 * (Uses encryption but may have slight delay)
 */
export const secureStorage = {
  setItem: (key, value) => {
    secureSetItem(key, value).catch((error) => {
      console.error("Async setItem error:", error);
    });
  },

  getItem: (key, parseJSON = true) => {
    // For synchronous access, return from regular localStorage
    // This is a limitation of the async encryption
    const value = localStorage.getItem(key);
    if (!value) return null;

    if (parseJSON) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    return value;
  },

  removeItem: secureRemoveItem,
  clear: secureClear,
};

export default {
  setItem: secureSetItem,
  getItem: secureGetItem,
  removeItem: secureRemoveItem,
  clear: secureClear,
};
