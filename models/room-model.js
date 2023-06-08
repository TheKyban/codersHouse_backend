import mongoose, { Schema } from "mongoose";

const schema = mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    speakers: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref:'users'
            }
        ],
        required: false
    }
}, { timestamps: true }
)

const roomModel = mongoose.model("Room", schema, 'rooms')

export default roomModel