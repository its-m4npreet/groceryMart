/**
 * Masks a phone number for security, showing only the first and last two digits.
 * Example: "9876036134" -> "98******34"
 */
export const maskPhone = (phone) => {
    if (!phone) return "";
    const cleaned = phone.toString().replace(/\D/g, "");
    if (cleaned.length < 4) return phone;
    return `${cleaned.slice(0, 2)}${"*".repeat(cleaned.length - 4)}${cleaned.slice(-2)}`;
};

/**
 * Masks an email for security.
 * Example: "manpreetji234567890@gmail.com" -> "ma**********@gmail.com"
 */
export const maskEmail = (email) => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;
    if (user.length < 3) return `***@${domain}`;
    return `${user.slice(0, 2)}${"*".repeat(user.length - 2)}@${domain}`;
};
