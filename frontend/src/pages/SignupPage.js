import React, { useEffect } from 'react';
import Signup from '../features/auth/Components/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userProfileAsync } from '../features/user/userSlice';
import { resetState } from '../features/auth/authSlice';

const SignupPage = () => {
    document.title = "Signup";

    const user = useSelector(state => state.user.user);
    const { isUserVerificationNeeded, email } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isUserVerificationNeeded) {
            navigate(`/account/verificationEmail?email=${email}`);
            dispatch(resetState());
            return;
        }
    }, [dispatch, isUserVerificationNeeded, email, navigate]); // Add email and navigate as dependencies

    useEffect(() => {
        const handleGetUserData = async () => {
            if (!user) {
                dispatch(userProfileAsync());
            }
            if (user) {
                const [redirect, to] = window.location.search && window.location.search.split("=");
                navigate(redirect === "?redirect" ? to : "/profile");
                return;
            }
        };

        handleGetUserData();
    }, [dispatch, user, navigate]); // Add navigate as a dependency

    return (
        <Signup />
    );
};

export default SignupPage;
