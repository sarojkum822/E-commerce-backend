import jwt from 'jsonwebtoken';

export const sendCookie = (user, res, message = "Cookie sent successfully", status = 200) => {
    try {
        // Ensure valid user object is provided
        if (!user || !user._id) {
            throw new Error("Invalid User object");
        }

        // Payload with user details and timestamp
        const payload = {
            _id: user._id,
            name: user.name,
            timeStamp: Date.now()
        };

        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h' // Explicit token expiration for 1 hour
        });

        // Cookie options
        const cookieOptions = {
            httpOnly: true,
            maxAge: 3600000, // 1 hour in milliseconds
            secure: process.env.NODE_ENV === 'production', // Set secure flag if in production environment
            sameSite: 'strict'
        };

        // Send the response with the cookie
        res.status(status).cookie("token", token, cookieOptions).json({
            success: true,
            message // Default or provided message
        });

    } catch (error) {
        console.error("Error generating JWT:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
