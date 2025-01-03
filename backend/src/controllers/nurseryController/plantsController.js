const { uploadImages, deleteResourcesByPrefix, deleteFolder } = require('../../utils/uploadImages');
const plantsModel = require('../../model/nurseryModel/plants');
const { default: mongoose } = require('mongoose');

exports.addNewPlant = async (req, res, next) => {
    try {
        const { user, role, nursery, body, files } = req;

        // Ensure the user is allowed to access this route
        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        // Check if all the required images are provided
        if (!files.image_0 || !files.image_1 || !files.image_2) {
            const error = new Error("At least one image file is missing");
            error.statusCode = 400;
            throw error;
        }

        const images = [files.image_0, files.image_1, files.image_2];
        const plant = new plantsModel(body);

        // Log the images to check if the files are being received
        // console.log("Received image files:", images);

        // Upload images using the uploadImages utility function
        const resultImage = await uploadImages(images, {
            folder: `PlantSeller/user/${user}/nursery/${nursery}/plants/${plant._id}`,
            width: 550,
            height: 650,
            crop: "fit",
        });

        // Validate if the upload returned a valid array
        if (!resultImage || !Array.isArray(resultImage)) {
            const error = new Error("Image upload failed or returned an invalid response");
            error.statusCode = 500;
            throw error;
        }

        // Log the successful image upload result
        console.log("Uploaded images:", resultImage);

        // Save image URLs and IDs into the plant object
        plant.images = resultImage.map((elem) => ({
            public_id: elem.public_id,
            url: elem.secure_url,
        }));

        plant.imageList = resultImage.map((elem) => ({
            public_id: elem.public_id,
            url: elem.url,
        }));

        // Save the plant document to the database
        await plant.save();

        // Return success response
        const info = {
            status: true,
            message: "New plant added successfully.",
        };
        res.status(200).send(info);

    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};




exports.getAllPlantsOfNursery = async (req, res, next) => {
    try {
        const { user, role, nursery } = req;

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const result = await plantsModel.find({ user, nursery });

        if (!result) {
            const error = new Error("No Plants Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Plants Found successfully.",
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};


exports.getPlantById = async (req, res, next) => {
    try {
        const { user, role, nursery } = req;

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const _id = req.params.id;
        const result = await plantsModel.findOne({ user, nursery, _id });

        if (!result) {
            const error = new Error("No Plant Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Plant Found successfully.",
            result
        };

        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};


exports.updatePlantById = async (req, res, next) => {
    try {
        const { user, role, nursery } = req;

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const _id = req.params.id;
        const result = await plantsModel.findOneAndUpdate({ user, nursery, _id }, req.body, {
            new: true
        });

        if (!result) {
            const error = new Error("No Plant Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Plant updated successfully.",
            result
        };

        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};


exports.deletePlantById = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { user, role, nursery } = req;

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const _id = req.params.id;
        const result = await plantsModel.findOneAndDelete({ user, nursery, _id }, { session });

        if (!result) {
            const error = new Error("No Plant Found.");
            error.statusCode = 404;
            throw error;
        }

        await deleteResourcesByPrefix(`PlantSeller/user/${user}/nursery/${nursery}/plants/${_id}`, {
            type: 'upload',
            resource_type: 'image',
            invalidate: true
        });

        await deleteFolder(`PlantSeller/user/${user}/nursery/${nursery}/plants/${_id}`);

        await session.commitTransaction();

        const info = {
            status: true,
            message: "Plant deleted successfully.",
        };

        res.status(200).send(info);


    } catch (error) {
        await session.abortTransaction();

        next(error);
    } finally {
        await session.endSession();
    }
};
