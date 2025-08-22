import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  User,
  MapPin,
  Wallet,
  Shield,
  TreePine,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormData {
  // Login fields
  phone: string;
  password: string;

  // Registration fields
  name: string;
  email: string;
  aadhaarNumber: string;
  address: {
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  farmDetails: {
    totalLandArea: string;
    irrigatedArea: string;
    drylandArea: string;
    landRecordNumber: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  upiId: string;
}

export default function FarmerAuth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<FormData>({
    phone: "",
    password: "",
    name: "",
    email: "",
    aadhaarNumber: "",
    address: {
      village: "",
      district: "",
      state: "",
      pincode: "",
    },
    farmDetails: {
      totalLandArea: "",
      irrigatedArea: "",
      drylandArea: "",
      landRecordNumber: "",
    },
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountHolderName: "",
    },
    upiId: "",
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("farmer", JSON.stringify(data.data.farmer));
        navigate("/farmer/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate farm details
    const totalLand = parseFloat(formData.farmDetails.totalLandArea);
    const irrigated = parseFloat(formData.farmDetails.irrigatedArea);
    const dryland = parseFloat(formData.farmDetails.drylandArea);

    if (irrigated + dryland !== totalLand) {
      setError("Irrigated + Dryland area should equal total land area");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone,
          aadhaarNumber: formData.aadhaarNumber || undefined,
          address: formData.address,
          farmDetails: {
            totalLandArea: totalLand,
            irrigatedArea: irrigated,
            drylandArea: dryland,
            landRecordNumber:
              formData.farmDetails.landRecordNumber || undefined,
          },
          bankDetails: formData.bankDetails.accountNumber
            ? formData.bankDetails
            : undefined,
          upiId: formData.upiId || undefined,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Registration successful! Please login with your credentials.",
        );
        setActiveTab("login");
        setFormData((prev) => ({ ...prev, password: "" }));
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 p-3 rounded-xl shadow-lg">
              <TreePine className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black text-gray-900">
                MRV Farmer Portal
              </h1>
              <p className="text-emerald-600 font-semibold">
                Track your carbon impact
              </p>
            </div>
          </div>
          <p className="text-gray-600 font-medium">
            Join the carbon farming revolution. Register your farm and start
            earning from sustainable practices.
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Farmer Access Portal
            </CardTitle>
            <CardDescription className="text-lg">
              Login to your account or register as a new farmer
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700 font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-700 font-medium">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="login"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Register</span>
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Registration Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2 text-emerald-600" />
                      Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-phone">Phone Number *</Label>
                        <Input
                          id="reg-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aadhaar">
                          Aadhaar Number (Optional)
                        </Label>
                        <Input
                          id="aadhaar"
                          placeholder="Enter Aadhaar number"
                          value={formData.aadhaarNumber}
                          onChange={(e) =>
                            handleInputChange("aadhaarNumber", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="reg-password">Password *</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Create a password (min 6 characters)"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                      Address Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="village">Village *</Label>
                        <Input
                          id="village"
                          placeholder="Enter village name"
                          value={formData.address.village}
                          onChange={(e) =>
                            handleInputChange("address.village", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">District *</Label>
                        <Input
                          id="district"
                          placeholder="Enter district name"
                          value={formData.address.district}
                          onChange={(e) =>
                            handleInputChange(
                              "address.district",
                              e.target.value,
                            )
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={formData.address.state}
                          onValueChange={(value) =>
                            handleInputChange("address.state", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          placeholder="Enter pincode"
                          value={formData.address.pincode}
                          onChange={(e) =>
                            handleInputChange("address.pincode", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Farm Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <TreePine className="h-5 w-5 mr-2 text-emerald-600" />
                      Farm Details
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalLand">Total Land (Acres) *</Label>
                        <Input
                          id="totalLand"
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="e.g., 2.5"
                          value={formData.farmDetails.totalLandArea}
                          onChange={(e) =>
                            handleInputChange(
                              "farmDetails.totalLandArea",
                              e.target.value,
                            )
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="irrigated">
                          Irrigated Area (Acres) *
                        </Label>
                        <Input
                          id="irrigated"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="e.g., 1.5"
                          value={formData.farmDetails.irrigatedArea}
                          onChange={(e) =>
                            handleInputChange(
                              "farmDetails.irrigatedArea",
                              e.target.value,
                            )
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dryland">Dryland Area (Acres) *</Label>
                        <Input
                          id="dryland"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="e.g., 1.0"
                          value={formData.farmDetails.drylandArea}
                          onChange={(e) =>
                            handleInputChange(
                              "farmDetails.drylandArea",
                              e.target.value,
                            )
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-3">
                        <Label htmlFor="landRecord">
                          Land Record Number (Optional)
                        </Label>
                        <Input
                          id="landRecord"
                          placeholder="Enter land record/survey number"
                          value={formData.farmDetails.landRecordNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "farmDetails.landRecordNumber",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Wallet className="h-5 w-5 mr-2 text-emerald-600" />
                      Payment Details (Optional)
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="upi">UPI ID</Label>
                        <Input
                          id="upi"
                          placeholder="yourname@paytm or yourname@gpay"
                          value={formData.upiId}
                          onChange={(e) =>
                            handleInputChange("upiId", e.target.value)
                          }
                        />
                      </div>

                      <div className="text-sm text-gray-600 font-medium">
                        OR Bank Details:
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            placeholder="Enter account number"
                            value={formData.bankDetails.accountNumber}
                            onChange={(e) =>
                              handleInputChange(
                                "bankDetails.accountNumber",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ifsc">IFSC Code</Label>
                          <Input
                            id="ifsc"
                            placeholder="e.g., SBIN0001234"
                            value={formData.bankDetails.ifscCode}
                            onChange={(e) =>
                              handleInputChange(
                                "bankDetails.ifscCode",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            placeholder="Enter bank name"
                            value={formData.bankDetails.bankName}
                            onChange={(e) =>
                              handleInputChange(
                                "bankDetails.bankName",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accountHolder">
                            Account Holder Name
                          </Label>
                          <Input
                            id="accountHolder"
                            placeholder="As per bank records"
                            value={formData.bankDetails.accountHolderName}
                            onChange={(e) =>
                              handleInputChange(
                                "bankDetails.accountHolderName",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
