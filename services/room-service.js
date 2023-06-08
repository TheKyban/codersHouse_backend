import roomModel from "../models/room-model.js"

class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload
        const room = await roomModel.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId]
        })
        return room
    }

    async getAllRooms(types) {
        const Rooms = await roomModel.find({ roomType: { $in: types } })
            .populate('speakers')
            .populate('ownerId')
            .exec()
        return Rooms
    }
}

export default new RoomService()