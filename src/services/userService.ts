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
const getUserById = async (userId: string, includePassword: boolean = false) => {
    if (includePassword) {
        return await UserModel.findById(userId).select('+password').exec();
    }
    return await UserModel.findById(userId).exec();
}

const getUserByEmail = async (email: string, includePassword: boolean = false) => {
    if (includePassword) {
        return await UserModel.findOne({ email: email }).select('+password').exec();
    }
    return await UserModel.findOne({ email: email }).exec();
}
const getUserByRefreshToken = async (refreshToken: string) => {
    return await UserModel.findOne({ refreshToken: refreshToken }).exec();
}

// =============== U - update user ===============
const updateUser = async (userId: string, userData: IUser) => {
    return UserModel.findByIdAndUpdate(userId, {
        email: userData.email,
        name: userData.email,
    }).exec();
}

const updateUserRefreshToken = async (userId: string, refreshToken: string) => {
    return await UserModel.findByIdAndUpdate(userId, { refreshToken: refreshToken });
};

const updateUserPassword = async (userId: string, newPassword: string) => {
    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));
    return await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
}

const updateRandomPassword = async (email: string, newPassword: string) => {
    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));
    return await UserModel.findOneAndUpdate({ email: email }, { password: hashedPassword });
}


// =============== D - delete user ===============
const deleteUser = (userId: string) => {

}

export const userService = {
    createUser,
    getUserById,
    getUserByEmail,
    getUserByRefreshToken,
    updateUser,
    updateUserRefreshToken,
    updateUserPassword,
    updateRandomPassword,
    deleteUser,
}