import RooomDto from "../dtos/room-dto.js";
import roomService from "../services/room-service.js";

class RoomController {
    async create(req, res) {
        const { topic, roomType } = req.body;

        if (!topic || !roomType) {
            res.status(400).json({ message: "All fields are required." })
        }
        const room = await roomService.create({
            topic,
            roomType,
            ownerId: req.user._id
        })

        res.json(new RooomDto(room))


    }

    async index(req, res) {
        const rooms = await roomService.getAllRooms(["open"])
        const allRooms = rooms.map(room => new RooomDto(room))
        return res.json(allRooms)
    }
}

export default new RoomController()