import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const { sendOTP, verifyOTP, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const result = await sendOTP({ email });
      if (result.success) {
        setOtpSent(true);
        setGeneratedOTP(result.otp || ""); // Store OTP for testing
        toast.success("OTP sent to your email");
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP({ email, otp });
      if (result.success) {
        toast.success("Login successful!");
        onOpenChange(false);
        navigate("/farmer-dashboard");
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    }
    setLoading(false);
  };

  const handleAdminLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const result = await adminLogin({ email, password });
      if (result.success) {
        toast.success("Admin login successful!");
        onOpenChange(false);
        navigate("/admin-dashboard");
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Failed to login");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEmail("");
    setOtp("");
    setPassword("");
    setOtpSent(false);
    setGeneratedOTP("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="farmer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="farmer">👨‍🌾 Farmer</TabsTrigger>
            <TabsTrigger value="admin">👨‍💻 Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="farmer" className="space-y-4 mt-4">
            {!otpSent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="farmer-email">Email</Label>
                  <Input
                    id="farmer-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-sm text-gray-600">OTP sent to {email}</p>
                  {generatedOTP && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm font-medium text-blue-800">
                        🔐 Your OTP:{" "}
                        <span className="font-mono text-lg">
                          {generatedOTP}
                        </span>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        (For testing purposes only)
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setOtpSent(false)}
                    className="w-full"
                  >
                    Change Email
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="admin" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                onClick={handleAdminLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {loading ? "Signing in..." : "Admin Login"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
