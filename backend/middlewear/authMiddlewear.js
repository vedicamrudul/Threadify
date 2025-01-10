// authentication middleware to check if jwt in cookie is valid and present
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { StatusCodes } = require('http-status-codes');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Token is not present" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid token" });
        }

        const { _id } = decoded;
        const user = await User.findById({ _id }).select("-password");

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "No user found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error in auth middleware" });
    }
};

module.exports = authMiddleware;