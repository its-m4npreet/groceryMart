/**
 * Secure Storage utility for encrypting sensitive data in localStorage
 * Uses AES-GCM encryption with Web Crypto API
 */

// Generate a consistent encryption key based on a secret phrase combined with browser fingerprint
const generateKey = async () => {
  const secret =
    import.meta.env.VITE_STORAGE_SECRET || "grocerymart-secure-key-2024";

  // Create a more unique key by combining secret with browser info
  // We use userAgent but omit language to avoid issues when user changes browser language
  const browserInfo = navigator.userAgent;
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
    let combined;
    try {
      combined = Uint8Array.from(atob(encryptedData), (c) =>
        c.charCodeAt(0),
      );
    } catch (e) {
      // Not valid base64, so it's definitely not our encrypted data
      throw new Error("NOT_ENCRYPTED");
    }

    // Extract IV and encrypted data (IV is 12 bytes)
    if (combined.length < 13) { // 12 bytes IV + at least 1 byte data
      throw new Error("NOT_ENCRYPTED");
    }

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
    // If it's one of our custom errors or an OperationError (likely key mismatch),
    // don't log it here; the caller (secureGetItem) will provide a better message.
    if (error.message !== "NOT_ENCRYPTED" && error.name !== "OperationError") {
      console.error("Decryption error:", error);
    }
    throw error;
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
  const rawValue = localStorage.getItem(key);
  if (!rawValue) return null;

  try {
    const decrypted = await decrypt(rawValue);

    if (parseJSON) {
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    }

    return decrypted;
  } catch (error) {
    if (error.message === "NOT_ENCRYPTED") {
      // It's likely plain text. Try to parse it if needed.
      if (parseJSON) {
        try {
          const parsed = JSON.parse(rawValue);
          // Re-encrypt for next time (lazy migration)
          await secureSetItem(key, parsed);
          return parsed;
        } catch {
          // Not valid JSON either, just return as string
          return rawValue;
        }
      }
      return rawValue;
    }

    // Decryption failed (e.g., OperationError). This means it IS encrypted but we can't read it.
    // This happens if the encryption key changed (browser info change).
    console.warn(`SecureStorage: Could not decrypt data for key "${key}". The data might be corrupted or the encryption key has changed.`);

    // Last ditch effort: if it's valid JSON even though it looked encrypted, 
    // maybe it wasn't ours or was half-migrated.
    if (parseJSON) {
      try {
        const parsed = JSON.parse(rawValue);
        return parsed;
      } catch {
        // Definitely corrupted/inaccessible
        console.warn(`Clearing corrupted data for key: ${key}`);
        localStorage.removeItem(key);
        return null;
      }
    }

    return null;
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
        // If it's not valid JSON, and it's long enough to be our encrypted data, 
        // return null instead of the encrypted string.
        if (value.length > 20) return null;
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
