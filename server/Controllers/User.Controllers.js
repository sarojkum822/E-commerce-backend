import UserModel from '../Models/User.Model.js'
import bcrypt from 'bcrypt';
import { sendCookie } from '../utils/sendCookie.js';

//register controllers........

export const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const { houseNumber, street, landmark, city, state, pincode } = address;

    // Check if all fields are provided
    if (!name || !email || !password || !houseNumber || !street || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let userData = await UserModel.findOne({ email });

    if (userData) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Include detailed address when creating the user
    userData = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      address: { houseNumber, street, landmark, city, state, pincode },
    });

    sendCookie(userData, res, "User registered successfully", 201);

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
 


//user login controller........

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let userData = await UserModel.findOne({ email }).select("+password");


    if (!userData) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const userResponse = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      // Include any additional user details you want to send
    };

    // console.log(userResponse);

    sendCookie(userResponse, res, `Logged in successfully, ${userData.name}`, 200);

    
  
  } catch (error) {
return res.status(500).json({
      sucess: false,
      message: "Internal server error"
    })
  }
}

//get user details .............

export const getUserDetails = async (req, res) => {
  try {
    

    let user = await UserModel.findById(req.user);
    console.log("user",user);

    res.status(200).json({
      sucess: true,
      user: req.user,
    })
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "internal server error"
    })
  }
}

//logout and clear cookie.............

export const logout = async (req, res) => {
  try {
    // Clear the token cookie by setting it to an empty string and setting its expiration to a past date
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


