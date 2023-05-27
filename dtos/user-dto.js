class UserDto {
    phone;
    activated;
    _id;
    createdAt;

    constructor(user) {
        this.phone = user.phone;
        this.activated = user.activated;
        this._id = user._id;
        this.createdAt = user.createdAt;

        // return {
        //     phone: this.phone,
        //     activated: this.activated,
        //     _id: this._id,
        //     createdAt: this.createdAt
        // }
    }
}

export default UserDto