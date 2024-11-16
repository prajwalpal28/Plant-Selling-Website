const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel/user');
const nurseryModel = require('../model/nurseryModel/nursery');

const auth = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies?.auth;

        if (!token) {
            return res.status(401).json({ message: "Authentication failed: No token provided." });
        }

        let verifyUser;
        try {
            // Verify JWT token
            verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            // Handle invalid or expired tokens
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Authentication failed: Token has expired." });
            }
            return res.status(401).json({ message: "Authentication failed: Invalid token." });
        }

        // Fetch user from the database
        const user = await userModel.findOne({ _id: verifyUser._id }).select({ _id: 1, role: 1, isUserVerified: 1 });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed: User not found." });
        }

        if (!user.isUserVerified) {
            return res.status(401).json({ message: "User account not verified. Please verify your email." });
        }

        // Attach user info to the request object
        req.token = token;
        req.user = user._id;
        req.role = user.role;

        // Additional check for "seller" role
        if (req.role?.includes("seller")) {
            const nursery = await nurseryModel.findOne({ user: user._id }).select({ _id: 1 });
            if (!nursery) {
                return res.status(404).json({ message: "Authentication failed: Nursery not found for this seller." });
            }
            req.nursery = nursery._id;
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication middleware error:", error.message);
        res.status(500).json({ message: "An unexpected error occurred during authentication." });
    }
};

module.exports = auth;
