import mongoose from "mongoose";

const schema = mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    activated: { type: Boolean, required: false, default: false },
}, { timestamps: true }
)

const UserModel = mongoose.model("users", schema)

export default UserModel