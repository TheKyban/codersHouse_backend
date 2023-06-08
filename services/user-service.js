import UserModel from "../models/user-model.js";

class UserService {
    async findUser(phone) {
        try {
            const user = await UserModel.findOne({ phone: phone })
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async CreateUser(phone, activated) {
        try {
            const CreatedUser = await UserModel.create({ phone: phone, activated: activated })
            return CreatedUser
        } catch (error) {
            console.log(error)
        }
    }

    async findUserById(_id) {
        return await UserModel.findById(_id)
    }
}

export default new UserService()