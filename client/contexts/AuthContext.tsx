import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  AuthState,
  AuthUser,
  LoginResponse,
  OTPRequest,
  OTPVerification,
  AdminLoginRequest,
  EnhancedFarmerRegistration,
} from "@shared/auth";

interface AuthContextType extends AuthState {
  sendOTP: (
    data: OTPRequest,
  ) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (data: OTPVerification) => Promise<LoginResponse>;
  adminLogin: (data: AdminLoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: AuthUser | null }
  | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          const response = await fetch("/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            dispatch({ type: "SET_USER", payload: data.user });
          } else {
            localStorage.removeItem("auth_token");
            dispatch({ type: "SET_LOADING", payload: false });
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  const sendOTP = async (data: OTPRequest) => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Send OTP failed:", error);
      return { success: false, message: "Failed to send OTP" };
    }
  };

  const verifyOTP = async (data: OTPVerification): Promise<LoginResponse> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.user) {
        localStorage.setItem("auth_token", result.token);
        dispatch({ type: "SET_USER", payload: result.user });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }

      return result;
    } catch (error) {
      console.error("OTP verification failed:", error);
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, message: "Verification failed" };
    }
  };

  const adminLogin = async (
    data: AdminLoginRequest,
  ): Promise<LoginResponse> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.user) {
        localStorage.setItem("auth_token", result.token);
        dispatch({ type: "SET_USER", payload: result.user });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }

      return result;
    } catch (error) {
      console.error("Admin login failed:", error);
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, message: "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    dispatch({ type: "LOGOUT" });
  };

  const updateProfile = async (data: any) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        dispatch({ type: "SET_USER", payload: result.user });
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const value: AuthContextType = {
    ...state,
    sendOTP,
    verifyOTP,
    adminLogin,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
