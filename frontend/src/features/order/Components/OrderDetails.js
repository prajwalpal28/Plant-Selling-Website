import React, { useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetailsByIdAsync } from '../orderSlice';

const OrderDetails = () => {

    const orderDetails = useSelector((order) => order.order.orderDetails);
    console.log("orderDetails: ", orderDetails);

    const dispatch = useDispatch();

    const noPlantsImage = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found";
    
    const { id } = useParams();

    // Use useCallback hook to memoize the function
    const handelGetOrderDetails = useCallback(() => {
        dispatch(getOrderDetailsByIdAsync(id));
    }, [dispatch, id]);

    useEffect(() => {
        handelGetOrderDetails();
    }, [handelGetOrderDetails]);

    return (
        <section className="bg-section">
            <div className="container p-2 p-md-3 p-lg-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/profile" className='link-underline-hover'>Profile</Link></li>
                        <li className="breadcrumb-item"><Link to="/orders/history" className='link-underline-hover'>Your Orders</Link></li>
                        <li className="breadcrumb-item" aria-current="page">Order Details</li>
                    </ol>
                </nav>
                <div className="row border-bottom my-2 pb-2">
                    {
                        orderDetails ? (
                            <>
                                <div className="d-flex flex-column p-2 justify-content-between py-2 mb-2">
                                    <h3 className='h3 px-2'>Order Details</h3>
                                    <div className="d-flex flex-column flex-md-row flex-wrap justify-content-between">
                                        <div className="d-flex flex-column flex-md-row ms-2">
                                            <p className='me-2'>Ordered On: <span>{orderDetails.orderAt}</span></p>
                                            <p className='mx-1 d-none d-md-block'> | </p>
                                            <p className='ms-md-2'>Order Id: <span>{orderDetails._id}</span></p>
                                        </div>
                                        <div className='ms-2'>
                                            <Link to='#' className='btn btn-secondary'>Payment Invoice</Link>
                                        </div>
                                    </div>
                                </div>
                                {/* Rest of the order details content */}
                            </>
                        ) : (
                            <div className="container bg-white pb-3">
                                <div className="row">
                                    <div className="d-flex justify-content-center">
                                        <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="d-flex d-flex flex-column align-items-center">
                                        <h3 className="h3" style={{ fontFamily: "cursive" }}>No Order Details Found!</h3>
                                        <Link to="/orders/history" className='btn btn-primary'><i className="fas fa-arrow-left"></i> Back To Orders History</Link>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    );
}

export default OrderDetails;
