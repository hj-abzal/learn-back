import {Request, Response} from 'express';
import User, {IUser} from '../../../f-1-auth/a-2-models/user';
import {status400, status500} from '../../../f-1-auth/a-3-helpers/errorStatuses';
import CardsPack, {ICardsPack} from '../../c-2-models/cardsPack';
import {resCookie} from '../../../../lb-1-main/cookie';

export const deleteCardsPack = (req: Request, res: Response, user: IUser) => {
    const {id} = req.query;

    if (!id) {
        status400(
            res,
            'No CardsPack id',
            user,
            'deleteCardsPack',
            {query: req.query});
    } else {
        CardsPack.findById(id)
            .exec()
            .then((cardsPackF: ICardsPack | null) => {
                if (!cardsPackF) {
                    status400(res, 'CardsPack id is not valid', user, 'deleteCardsPack/CardsPack.findById');
                } else if (!cardsPackF.user_id.equals(user._id)) {
                    status400(res, 'not your CardsPack', user, 'deleteCardsPack');
                } else {
                    CardsPack.findByIdAndDelete(id)
                        .exec()
                        .then((cardsPack: ICardsPack | null) => {
                            if (!cardsPack) {
                                status400(res, 'CardsPack id is not valid', user, 'deleteCardsPack/CardsPack.findByIdAndDelete');
                            } else {
                                CardsPack.count({user_id: user._id, private: false})
                                    .exec()
                                    .then((cardPacksTotalCount) => {
                                        User.findByIdAndUpdate(
                                            user._id,
                                            {publicCardsPacksCount: cardPacksTotalCount},
                                            {new: true}
                                        )
                                            .exec()
                                            .then((updatedUser: IUser | null) => {
                                                if (!updatedUser) {
                                                    status400(res, 'not updated?', user, 'deleteCardsPack');
                                                } else {
                                                    resCookie(res, user).status(200).json({
                                                        deletedCardsPack: cardsPack,
                                                        token: user.token,
                                                        tokenDeathTime: user.tokenDeathTime
                                                    })
                                                }
                                            })
                                            .catch(e => status500(res, e, user, 'deleteCardsPack/User.findByIdAndUpdate'));
                                    })
                                    .catch(e => status500(res, e, user, 'deleteCardsPack/CardsPack.count'));
                            }
                        })
                        .catch(e => status500(res, e, user, 'deleteCardsPack/CardsPack.findByIdAndDelete'));
                }
            })
            .catch(e => status500(res, e, user, 'deleteCardsPack/CardsPack.findById'));
    }
};