class UserDto {
    phone;
    activated;
    _id;
    createdAt;
    name;
    avatar;

    constructor(user) {
        this.phone = user.phone;
        this.activated = user.activated;
        this._id = user._id;
        this.createdAt = user.createdAt;
        this.name = user.name;
        this.avatar = user.avatar
        // this.avatar = user.avatar ? `${process.env.BASE_URL}${user.avatar}` : null
    }
}

export default UserDto