import bcrypt from 'bcrypt';

import { IUser, UserModel } from './../models';

// =============== C - create user ===============
const createUser = async (user: IUser) => {
    const hashedPassword = await bcrypt.hash(user.password, Number(process.env.SALT_ROUNDS));
    user.password = hashedPassword;
    const newUser = new UserModel(user);
    return await newUser.save();
}

// ================ R - read user ================
const getUserById = async (userId: String, includePassword: boolean = false) => {
    if (includePassword) {
        return await UserModel.findById(userId).select('+password').exec();
    }
    return await UserModel.findById(userId).exec();
}

const getUserByEmail = async (email: String, includePassword: boolean = false) => {
    if (includePassword) {
        return await UserModel.findOne({ email: email }).select('+password').exec();
    }
    return await UserModel.findOne({ email: email }).exec();
}
const getUserByRefreshToken = async (refreshToken: String) => {
    return await UserModel.findOne({ refreshToken: refreshToken }).exec();
}

// =============== U - update user ===============
const updateUser = async (userId: String, userData: IUser) => {
    return UserModel.findByIdAndUpdate(userId, {
        email: userData.email,
        name: userData.email,
    }).exec();
}

const updateUserRefreshToken = async (userId: String, refreshToken: String) => {
    return await UserModel.findByIdAndUpdate(userId, { refreshToken: refreshToken });
};

const updateUserPassword = async (userId: String, newPassword: string) => {
    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));
    return await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
}


// =============== D - delete user ===============
const deleteUser = (userId: String) => {

}

export const userService = {
    createUser,
    getUserById,
    getUserByEmail,
    getUserByRefreshToken,
    updateUser,
    updateUserRefreshToken,
    updateUserPassword,
    deleteUser,
}