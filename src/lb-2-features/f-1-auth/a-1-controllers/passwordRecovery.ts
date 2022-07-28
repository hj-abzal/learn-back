import {Request, Response} from 'express';
import {emailRegExp, validateEmail} from '../a-3-helpers/validators';
import User, {IUser} from '../a-2-models/user';
import {DEV_VERSION} from '../../../lb-1-main/config';
import {generateResetPasswordToken} from '../a-3-helpers/generateToken';
import {sendMail} from '../a-3-helpers/gmail';

export const  passwordRecovery = async (req: Request, res: Response) => {
 const {email, html1, html2, message, from} = req.body;

 if (validateEmail(email)) {
     res.status(400).json({
         error: 'Email address not valid',
         email,
         emailRegExp,
         in: 'passwordRecovery'
     })
 } else {
     try {
         const user: IUser | null = await User.findOne({email}).exec();

         if (!user) {
             res.status(404).json({
                 error: 'Email address not found',
                 email,
                 in: 'passwordRecovery'
             })
         } else {
            try {
                const resetPasswordToken = await generateResetPasswordToken(user._id);
                let html: string = message;

                if (message && message.includes('$token$')) {
                    do {
                        html = html.replace('$token', resetPasswordToken);
                    } while (html.includes('$token'));
                } else {
                    html = (
                        html1 ||
                            '<div>' +
                            'password recovery link: ' +
                            '<a href="http://localhost:3000/#/set-new-password">link</a>' +
                            '<div> resetPasswordToken: '
                    ) + resetPasswordToken + (
                        html ||  +
                            '</div>' +
                            '</div>'
                    )
                }

                const fromFinal = from || 'cards-back 171-421@mail.ru';

                const answer = await sendMail(
                    fromFinal,
                    email,
                    'password recovery',
                    html
                )
                res.status(200).json({
                    info: 'email sent',
                    success: Boolean(answer.accepted && answer.accepted.length > 0),
                    answer: DEV_VERSION && answer,
                    html: DEV_VERSION && html,
                })
            } catch (e: any) {
                res.status(500).json({
                    error: 'some error: ' + e.message,
                    info: 'Back doesn\'t know what the eror is...',
                    errorObject: DEV_VERSION && e,
                    in: 'passwordRecovery/sendMail'
                })
            }
         }
     } catch (e: any) {
         res.status(500).json({
             error: 'some error: ' + e.message,
             info: 'Back doesn\'t know what the eror is...',
             errorObject: DEV_VERSION && e,
             in: 'passwordRecovery/User.findOne'
         })
     }
 }

}