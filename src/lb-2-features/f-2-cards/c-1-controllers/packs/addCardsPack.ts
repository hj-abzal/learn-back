import {Request, Response} from 'express';
import {status400, status500} from '../../../f-1-auth/a-3-helpers/errorStatuses';
import User, {IUser} from '../../../f-1-auth/a-2-models/user';
import CardsPack, {ICardsPack} from '../../c-2-models/cardsPack';
import {resCookie} from '../../../../lb-1-main/cookie';

export const addCardsPack = async (req: Request, res: Response, user: IUser) => {
    const {cardsPack} = req.body;

    if (!cardsPack) {
        status400(res, 'No cardsPack in body!', user, 'addCardsPack', {body: req.body})
    } else {
        const nameF = cardsPack.name || 'no name';
        const pathF = cardsPack.path || '/def';
        const typeF = cardsPack.type || 'pack';
        const gradeF = isFinite(cardsPack.grade) ? +cardsPack.grade : 0;
        const shotsF = isFinite(cardsPack.shots) ? +cardsPack.shots : 0;

        if (gradeF > 5 || gradeF < 0) {
            status400(
                res,
                `Cards grade [${gradeF}] not valid! must be between 0 and 5`,
                user,
                'addCardsPack',
                {body: req.body}
            )
        } else {
           CardsPack.create({
               user_id: user._id,
               user_name: user.name,
               private: !!cardsPack.private,

               name: nameF,
               path: pathF,
               grade: gradeF,
               shots: shotsF,

               deckCover: cardsPack.deckCover,
               cardsCount: 0,

               type: typeF,
               rating: 0,

               created: new Date(),
               updated: new Date(),

               more_id: user._id,
               _doc: {}
           })
               .then((newCardsPack: ICardsPack) => {

                   CardsPack.count({user_id: user._id, pravate: false})
                       .exec()
                       .then((cardPacksTotalCount: number) => {

                           User.findByIdAndUpdate(
                               user._id,
                               {publicCardsCount: cardPacksTotalCount},
                               {new: true}
                           )
                               .exec()
                               .then((updatedUser: IUser | null) => {

                                   if (!updatedUser) {
                                       status400(res, 'not updatedd?', user, 'addCardsPack');
                                   } else {
                                       resCookie(res, user).status(201).json({
                                           newCardsPack,
                                           token: user.token,
                                           tokenDeathTime: user.tokenDeathTime
                                       })
                                   }
                               })
                               .catch((e: any) => status500(res, e, user, 'addCardsPack/User.findByIdAndUpdate'))
                       })
                       .catch((e: any) => status500(res, e, user, 'addCardPack/CardsPack.count'))
               })
               .catch((e: any) => status500(res, e, user, 'addCardsPack/CardsPack.create'))
        }
    }
}