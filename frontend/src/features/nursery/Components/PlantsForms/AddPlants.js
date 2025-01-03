import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { addNewPlantsToNurseryAsync } from '../../nurserySlice';

function AddPlants() {
    const nursery = useSelector(state => state.nursery.nursery);
    const dispatch = useDispatch();

    const [plant, setPlants] = useState({
        user: nursery.user,
        nursery: nursery._id,
        plantName: "",
        price: "",
        stock: "",
        discount: "",
        category: "",
        images: [],
        description: "",
    });

    const [errorMessage, setErrorMessages] = useState({
        plantName: {
            status: false,
            message: "",
            target: ""
        },
        price: {
            status: false,
            message: "",
            target: ""
        },
        stock: {
            status: false,
            message: "",
            target: ""
        },
        discount: {
            status: false,
            message: "",
            target: ""
        },
        category: {
            status: false,
            message: "",
            target: ""
        },
        description: {
            status: false,
            message: "",
            target: ""
        },
    });


    const navigate = useNavigate();

    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        if (name === "images") {
            plant.images.push(e.target.files[0]);
            setPlants({ ...plant, [name]: plant.images });
        } else {
            if (value === "") { 
                setErrorMessages({ ...errorMessage, [name]: { status: true, message: `${name} is required.`, target: e.target } });
            } else if ((name === "plantName") && (value.length < 3 || value.length >= 30)) {
                setErrorMessages({ ...errorMessage, plantName: { status: true, message: `The length of the Plant Name is greater than 3 and less than 30.`, target: e.target } });
            } else if ((name === "discount") && (value < 0 || value > 100)) {
                setErrorMessages({ ...errorMessage, [name]: { status: true, message: `value must be greater then 0 and smaller then 100.`, target: e.target } });
            } else if (e.target.type === "number" && value < 0) {
                setErrorMessages({ ...errorMessage, [name]: { status: true, message: `value must be greater then 0.`, target: e.target } });
            } else {
                setErrorMessages({ ...errorMessage, [name]: { status: false, message: "", target: "" } });
            }

            setPlants({ ...plant, [name]: value });
        }
    }

    const handelPostData = async (e) => {
        e.preventDefault();

        for (const key in errorMessage) {
            if (errorMessage[key].status) {
                errorMessage[key].target.focus();
                return;
            }
        }

        for (const key in plant) {
            if (!plant[key]) {
                message.error(key + " is required field!");
                return;
            }
        }

        if (plant.images.length === 0) {
            message.error("You need to upload at least one image.")
            return;
        }

        const formData = new FormData();
        formData.append("user", plant.user);
        formData.append("nursery", plant.nursery);
        formData.append("plantName", plant.plantName);
        formData.append("price", plant.price);
        formData.append("stock", plant.stock);
        formData.append("discount", plant.discount);
        formData.append("category", plant.category);
        formData.append("description", plant.description);

        plant.images.forEach((image, index) => {
            formData.append(`image_${index}`, image);
        })

        const data = {
            data: formData,
            redirect: "/nursery",
            navigate
        }

        dispatch(addNewPlantsToNurseryAsync(data));
    }


    return (
        <div className="container my-5 d-md-flex justify-content-center">
            <div className="col-md-9 border py-3 mt-5">
                <h3 className='h3 mb-3 text-center'>
                    Add Plants to Nursery
                </h3>

                {typeof (message.status) === "boolean" &&
                    <div className="row p-3">
                        <p className={`text-center ${message.status === true ? 'text-success' : 'text-danger'} m-0`}>{message.message}</p>
                    </div>
                }

                <div className="row p-4">
                    <form method="POST" onSubmit={handelPostData}>
                        <div className="form-outline mb-md-4">
                            <label htmlFor="plantsName" className='ps-1 my-2'>Plant Name: <span className="text-danger small">*</span></label>
                            <input type="text" name='plantName' id="plantsName" className="form-control" placeholder='Plants Name' onChange={handleInputs} value={plant.plantName} />
                            {errorMessage.plantName.status &&
                                <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.plantName.message}</p>
                            }
                        </div>

                        <div className="d-md-flex justify-content-between mb-md-4">
                            <div className='form-outline  col-md-6 pe-md-2'>
                                <label htmlFor="price" className='ps-1 my-2'>Price: <span className="text-danger small">*</span></label>
                                <input type="number" name='price' id="price" className="form-control" placeholder='Price' onChange={handleInputs} value={plant.price} />
                                {errorMessage.price.status &&
                                    <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.price.message}</p>
                                }
                            </div>
                            <div className='form-outline  col-md-6 ps-md-2'>
                                <label htmlFor="stock" className='ps-1 my-2'>Stock: <span className="text-danger small">*</span></label>
                                <input type="number" name='stock' id="stock" className="form-control" placeholder='stock' onChange={handleInputs} value={plant.stock} />
                                {errorMessage.stock.status &&
                                    <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.stock.message}</p>
                                }
                            </div>
                        </div>

                        <div className="d-md-flex justify-content-between mb-4">
                            <div className="form-outline  col-md-6 pe-md-2">
                                <label htmlFor="discount" className='ps-1 my-2'>Discount: <span className="text-danger small">*</span></label>
                                <input type="number" name='discount' id="discount" className="form-control" placeholder='Discount In Percentage' onChange={handleInputs} value={plant.discount} />
                                {errorMessage.discount.status &&
                                    <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.discount.message}</p>
                                }
                            </div>

                            <div className="form-outline  col-md-6 ps-md-2">
                                <label htmlFor="category" className='ps-1 my-2'>Category: <span className="text-danger small">*</span></label>
                                <select type="text" name='category' id="category" defaultValue={plant.category === "" ? "none" : plant.category} className="form-control" placeholder='Category' onChange={handleInputs} >
                                    <option value="none" disabled >--Select Category--</option>
                                    <option value="flowering-plants">Flowering Plants</option>
                                    <option value="medicinal-plants">Medicinal Plants</option>
                                    <option value="ornamental-plants">Ornamental Plants</option>
                                    <option value="indoor-plants">Indoor Plants</option>
                                </select>
                                {errorMessage.category.status &&
                                    <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.category.message}</p>
                                }
                            </div>
                        </div>

                        <div className="form-outline mb-4">
                            <h4>Upload Plant Image</h4>
                            <h6>You can upload upto 3 image.</h6>
                            <div className="mb-3">
                                <label htmlFor="plant-img-1" className="form-label">Image no. 1 <span className="text-danger small">*</span></label>
                                <input className="form-control" type="file" id="plant-img-1" name='images' accept="image/png, image/jpeg" onChange={handleInputs} />
                            </div>

                            {plant.images.length >= 1 &&
                                <div className="mb-3">
                                    <label htmlFor="plant-img-2" className="form-label">Image no. 2</label>
                                    <input className="form-control" type="file" id="plant-img-2" name='images' accept="image/png, image/jpeg" onChange={handleInputs} />
                                </div>
                            }

                            {plant.images.length >= 2 &&
                                <div className="mb-3">
                                    <label htmlFor="plant-img-3" className="form-label">Image no. 3</label>
                                    <input className="form-control" type="file" id="plant-img-3" name='images' accept="image/png, image/jpeg" onChange={handleInputs} />
                                </div>
                            }


                        </div>

                        <div className="form-outline mb-4">
                            <label htmlFor="description" className='ps-1 my-2'>Description: <span className="text-danger small">*</span></label>
                            <textarea className="form-control" name='description' placeholder='Description' id="description" rows="4" onChange={handleInputs}></textarea>
                            {errorMessage.description.status &&
                                <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.description.message}</p>
                            }
                        </div>

                        <button type="submit" className="btn btn-primary btn-block mb-4">Add Plants to Nursery</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddPlants