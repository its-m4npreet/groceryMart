import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowLeft,
  Leaf,
  KeyRound,
  CheckCircle,
} from "lucide-react";
import { authApi } from "../../api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setStep(2);
      toast.success("OTP sent to your email!");
    } catch (err) {
      const errorMessage = err.message || "Failed to send OTP";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!email) {
      setError("Email is missing. Please start over.");
      toast.error("Email is missing. Please start over.");
      setStep(1);
      return;
    }

    setIsLoading(true);

    try {
      await authApi.verifyOTP(email, otp);
      setStep(3);
      toast.success("OTP verified successfully!");
    } catch (err) {
      const errorMessage = err.message || "Invalid OTP";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Validate password contains required characters
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setError(
        "Password must contain uppercase, lowercase, number, and special character",
      );
      toast.error(
        "Password must contain uppercase, lowercase, number, and special character",
      );
      return;
    }

    if (!email || !otp) {
      setError("Session expired. Please start over.");
      toast.error("Session expired. Please start over.");
      setStep(1);
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword(email, otp, newPassword);
      setStep(4);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err.message || "Failed to reset password";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError("");

    if (!email) {
      setError("Email is missing. Please start over.");
      toast.error("Email is missing. Please start over.");
      setStep(1);
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setOtp(""); // Clear previous OTP
      toast.success("New OTP sent to your email!");
    } catch (err) {
      const errorMessage = err.message || "Failed to resend OTP";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            Fresh<span className="text-primary-600">Mart</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 1 ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                1
              </div>
              <div
                className={`h-1 w-12 ${step >= 2 ? "bg-primary-600" : "bg-gray-200"}`}
              />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 2 ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <div
                className={`h-1 w-12 ${step >= 3 ? "bg-primary-600" : "bg-gray-200"}`}
              />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 3 ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                3
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Mail className="h-8 w-8 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-gray-600">
                    Enter your email address and we'll send you an OTP to reset
                    your password
                  </p>
                </div>

                {error && (
                  <Alert variant="error" className="mb-6">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleRequestOTP} className="space-y-6">
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    leftIcon={<Mail className="h-5 w-5" />}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Send OTP
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <KeyRound className="h-8 w-8 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Enter OTP
                  </h1>
                  <p className="text-gray-600">
                    We've sent a 6-digit code to{" "}
                    <span className="font-medium text-gray-900">{email}</span>
                  </p>
                </div>

                {error && (
                  <Alert variant="error" className="mb-6">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <Input
                    type="text"
                    label="OTP Code"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    required
                    maxLength={6}
                    leftIcon={<KeyRound className="h-5 w-5" />}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Verify OTP
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Lock className="h-8 w-8 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Reset Password
                  </h1>
                  <p className="text-gray-600">Enter your new password</p>
                </div>

                {error && (
                  <Alert variant="error" className="mb-6">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <Input
                    type="password"
                    label="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    leftIcon={<Lock className="h-5 w-5" />}
                  />

                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    leftIcon={<Lock className="h-5 w-5" />}
                  />

                  <div className="text-xs text-gray-500">
                    Password must be at least 8 characters long and contain:
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>At least one uppercase letter</li>
                      <li>At least one lowercase letter</li>
                      <li>At least one number</li>
                      <li>At least one special character</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Reset Password
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Password Reset Successful!
                  </h1>
                  <p className="text-gray-600 mb-8">
                    Your password has been reset successfully. You will be
                    redirected to the login page.
                  </p>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => navigate("/login")}
                  >
                    Go to Login
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Login */}
          {step < 4 && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
