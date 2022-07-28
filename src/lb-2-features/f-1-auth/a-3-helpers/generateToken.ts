import {v1} from 'uuid';
import {Types} from 'mongoose';
import User from '../a-2-models/user';

export const generateToken = (rememberMe: boolean): [string, number] => {
    const token = v1();
    const tokenDeathTime = rememberMe
        ? Date.now() + (1000 * 60 * 60 * 24 * 7) //7days
        : Date.now() + (1000 * 60 * 60 * 3); //3hours
    return [token, tokenDeathTime];
};

export const generateResetPasswordToken = async (userId: Types.ObjectId) => {
    const resetPasswordToken = v1();

    await User.findByIdAndUpdate(
        userId,
        {resetPasswordToken, resetPasswordTokenDeathTime: Date.now() + (1000 * 60 * 10)}, //10 min
        {new: true}
    ).exec();
    return resetPasswordToken;
};