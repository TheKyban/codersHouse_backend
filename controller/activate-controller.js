import Jimp from 'jimp';
import path from 'path'
import userService from '../services/user-service.js';
import UserDto from '../dtos/user-dto.js';
// import image from '../storage'

class ActivateController {
    async activate(req, res) {
        const { name, avatar } = req.body
        // console.log(name, avatar)

        if (!name || !avatar) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        const buffer = await Buffer.from(avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64') // Work only for png

        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`

        try {
            const jimpResp = await Jimp.read(buffer)
            jimpResp.resize(150, Jimp.AUTO).write(path.resolve(process.cwd(), `storage/${imagePath}`))
        } catch (error) {
            return res.status(500).json({ message: "Could not process the image" })
        }

        /**
         * Update user
         */
        const userId = req.user._id
        try {

            const user = await userService.findUserById(userId)

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            user.activated = true
            user.name = name
            user.avatar = `/storage/${imagePath}`
            await user.save()

            
            res.json({
                user: new UserDto(user), auth: true
            })

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    }
}

export default new ActivateController()