import {Request, Response} from 'express';
import {validatePassword} from '../a-3-helpers/validators';
import {DEV_VERSION} from '../../../lb-1-main/config';
import User, {IUser} from '../a-2-models/user';
import bCrypt from 'bcrypt';

export const setNewPassword = async (req: Request, res: Response) => {
    const {resetPasswordToken, password} = req.body;

    if (!validatePassword(password)) {
        res.status(400).json({
            error: 'Password not valid! must be more than 7 characters',
            body: DEV_VERSION && req.body,
            in: 'setNewPassword'
        })
    } else if (!resetPasswordToken) {
        res.status(400).json({
            error: 'no resetPasswordToken, check your request',
            body: DEV_VERSION && req.body,
            in: 'setNewPassword'
        })
    } else {
        try {
            const user: IUser | null = await User.findOne({resetPasswordToken}).exec();

            if (
                !user
                || (user.resetPasswordTokenDeathTime && user.resetPasswordTokenDeathTime < Date.now())
            ) {
                res.status(401).json({
                    error: 'Bad token',
                    body: DEV_VERSION && resetPasswordToken,
                    in: 'setNewPassword/User.findOne'
                })
            } else {
                try {
                    const newUser: IUser | null = await User.findByIdAndUpdate(
                        user._id,
                        {password: await bCrypt.hash(password, 10), verified: true},
                        {new: true}
                    )

                    if (!newUser) {
                        res.status(500).json({
                            error: 'not updated?',
                            in: 'setNewPassword/User.findByAndUpdate'
                        })
                    } else {
                        res.status(200).json({info: 'setNewPassword success'})
                    }
                } catch (e: any) {
                    res.status(500).json({
                        error: "some error: " + e.message,
                        info: "Back doesn't know what the error is...",
                        errorObject: DEV_VERSION && e,
                        in: "setNewPassword/User.findByIdAndUpdate",
                    });
                }
            }

        } catch (e: any) {
            res.status(500).json({
                error: "some error: " + e.message,
                info: "Back doesn't know what the error is...",
                errorObject: DEV_VERSION && e,
                in: "setNewPassword/User.findOne",
            });
        }
    }
}