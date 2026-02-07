const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  verifyToken,
  updateProfile,
  changePassword,
  updateNotifications,
  deleteAccount,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post("/signup", signup);

// @route   POST api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post("/signin", signin);

// @route   GET api/auth/verify
// @desc    Verify token and get user data
// @access  Private
router.get("/verify", protect, verifyToken);

// @route   PATCH api/auth/profile
// @desc    Update user profile
// @access  Private
router.patch("/profile", protect, updateProfile);

// @route   PATCH api/auth/change-password
// @desc    Change user password
// @access  Private
router.patch("/change-password", protect, changePassword);

// @route   PATCH api/auth/notifications
// @desc    Update notification preferences
// @access  Private
router.patch("/notifications", protect, updateNotifications);

// @route   DELETE api/auth/account
// @desc    Delete user account
// @access  Private
router.delete("/account", protect, deleteAccount);

// @route   POST api/auth/forgot-password
// @desc    Request password reset OTP
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   POST api/auth/verify-otp
// @desc    Verify OTP for password reset
// @access  Public
router.post("/verify-otp", verifyOTP);

// @route   POST api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post("/reset-password", resetPassword);

module.exports = router;
