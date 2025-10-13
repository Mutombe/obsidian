// components/Admin/AuthGuard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { fetchAdminProfile, initializeAuth, selectIsAuthenticated, selectAuthStatus } from "../../redux/slices/authSlice";


const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);

  useEffect(() => {
    // Initialize auth from localStorage
    dispatch(initializeAuth());
    
    // Fetch user profile if authenticated
    if (isAuthenticated) {
      dispatch(fetchAdminProfile());
    }
  }, [dispatch, isAuthenticated]);

  // Show loading while checking auth status
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="century-gothic text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;