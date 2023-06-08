import mongoose from "mongoose";

const schema = mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    activated: { type: Boolean, required: false, default: false },
    name: { type: String, required: false },
    avatar: {
        type: String, required: false, get: (avatar) => {
            if (avatar) {
                return `${process.env.BASE_URL}${avatar}`
            }
        }
    }
}, {
    timestamps: true,
    toJSON: { getters: true }
}
)

const UserModel = mongoose.model("users", schema)

export default UserModel