import {Request, Response} from 'express';
import {IUser} from '../../../f-1-auth/a-2-models/user';
import {status400, status500} from '../../../f-1-auth/a-3-helpers/errorStatuses';
import CardsPack, {ICardsPack} from '../../c-2-models/cardsPack';
import {resCookie} from '../../../../lb-1-main/cookie';

export const updateCardsPack = async (req: Request, res: Response, user: IUser) => {
    const {cardsPack} = req.body;

    if (!cardsPack) {
        status400(
            res,
            'No cardsPack in body',
            user, 'updateCardsPack',
            {body: req.body}
        );
    } else if (!cardsPack._id) {
        status400(
            res,
            'No cardsPack id in body',
            user, 'updateCardsPack',
            {body: req.body}
        );
    } else {
        const nameF = cardsPack.name || undefined;
        const pathF = cardsPack.path || undefined;
        const typeF = cardsPack.type || undefined;
        const gradeF = isFinite(cardsPack.grade) ? +cardsPack.grade : undefined;
        const shotsF = isFinite(cardsPack.shots) && +cardsPack.shots >= 0
            ? +cardsPack.shots
            : undefined;

        if (gradeF && (gradeF > 5 || gradeF < 0)) {
            status400(
                res,
                `CardsPack grade [${gradeF}] not valid! must by between 0 and 5`,
                user,
                'updateCardsPack',
                {body: req.body}
            );
        } else {
            CardsPack.findById(cardsPack._id)
                .exec()
                .then((oldCardsPack: ICardsPack | null) => {
                    if (!oldCardsPack) {
                        status400(res, 'CardsPack id not valid', user, 'updateCardsPack',);
                    } else if (!oldCardsPack.user_id.equals(user._id)) {
                        status400(res, 'Not your CardsPack', user, 'updateCardsPack')
                    } else {
                        CardsPack.findByIdAndUpdate(
                            cardsPack._id,
                            {
                                private: cardsPack.private === undefined ? oldCardsPack.private : cardsPack.private,
                                name: nameF || oldCardsPack.name,
                                path: pathF || oldCardsPack.path,
                                type: typeF || oldCardsPack.type,
                                grade: gradeF || oldCardsPack.grade,
                                shots: shotsF || oldCardsPack.shots,
                                deckCover: cardsPack.deckCover === undefined ? oldCardsPack.deckCover : cardsPack.deckCover
                            },
                            {new: true}
                        )
                            .exec()
                            .then((updatedCardsPack: ICardsPack | null) => {
                                if (!updatedCardsPack) {
                                    status400(res, 'Not updated?', user, 'updateCardsPack')
                                } else {
                                    resCookie(res, user).status(200).json({
                                        updatedCardsPack,
                                        token: user.token,
                                        tokenDeathTime: user.tokenDeathTime
                                    })
                                }
                            })
                            .catch(e => status500(res, e, user, 'updateCardsPack/CardsPack.findbyAndUpdate'))
                    }
                })
                .catch((e: any) => status500(res, e, user, 'updateCardsPack/CardsPack.findById'));

        }
    }
};