import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  address: {
    houseNumber: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: false,  // Landmark is sometimes optional
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    }
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
export default User;
