import React, { useEffect, useCallback } from 'react';
import Login from '../features/auth/Components/Login';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userProfileAsync } from '../features/user/userSlice';
import { resetState } from '../features/auth/authSlice';

const LoginPage = () => {
  document.title = "Login";

  const user = useSelector(state => state.user.user);
  const { isUserVerificationNeeded, email } = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoize the function to prevent it from being recreated on every render
  const handleGetUserData = useCallback(async () => {
    if (!user) {
      dispatch(userProfileAsync());
    }
    if (user) {
      const [redirect, to] = window.location.search && window.location.search.split("=");
      navigate(redirect === "?redirect" ? to : "/profile");
    }
  }, [dispatch, navigate, user]); // Add dependencies

  useEffect(() => {
    if (isUserVerificationNeeded) {
      navigate(`/account/verificationEmail?email=${email}`);
      dispatch(resetState());
    }
  }, [dispatch, isUserVerificationNeeded, email, navigate]); // Include email and navigate

  useEffect(() => {
    handleGetUserData();
  }, [handleGetUserData]); // Use memoized version

  return <Login />;
};

export default LoginPage;
