import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { userProfileAsync } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../features/user/Components/ProfileAvatar';
import ProfileSideNav from '../features/user/Components/ProfileSideNav';
import ProfileInfo from '../features/user/Components/ProfileInfo';
import ProfileOrder from '../features/user/Components/ProfileOrder';
import ProfileAddress from '../features/user/Components/ProfileAddress';

const ProfilePage = () => {
    document.title = "Profile";

    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            dispatch(userProfileAsync());
        }
    }, [dispatch, user]); // Add user to the dependency array

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [navigate, user]); // Add navigate and user to the dependency array

    return (
        <section className='bg-section'>
            {
                user &&
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                            <ProfileAvatar />
                            <ProfileSideNav />
                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-2">
                                <ProfileInfo />
                            </div>
                            <div className="row mb-2">
                                <ProfileAddress />
                            </div>
                            <div className="row mb-2">
                                <ProfileOrder />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </section>
    )
}

export default ProfilePage;
