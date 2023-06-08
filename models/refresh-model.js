import mongoose, { Schema } from "mongoose";

const schema = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
}, { timestamps: true }
)

const refreshModel = mongoose.model("Refresh", schema, 'tokens')

export default refreshModel