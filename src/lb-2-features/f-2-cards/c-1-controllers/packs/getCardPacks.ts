import {Request, Response} from 'express';
import {IUser} from '../../../f-1-auth/a-2-models/user';
import CardsPack, {ICardsPack} from '../../c-2-models/cardsPack';
import {status500} from '../../../f-1-auth/a-3-helpers/errorStatuses';
import {resCookie} from '../../../../lb-1-main/cookie';

export const getCardPacks = async (req: Request, res: Response, user: IUser) => {
    const {page, pageCount, sortPacks, packName, min, max, user_id, type} = req.query;

    let pageF = page  && +page || 1;
    const pageCountF = pageCount && +pageCount || 4;

    const sortPacksF: string = sortPacks as string | undefined || '';
    const packNameF: string = packName as string | undefined || '';

    const user_idF = user_id as string | undefined || undefined;
    const typeF = type as string | undefined || 'pack';

    const user_id0 = user_idF ? {user_id: user_idF} : undefined;

    await CardsPack.findOne(user_id0)
        .sort({cardsCount: 1}).exec() //find pack with min count of cards
        .then((packMin: ICardsPack | null) => {
            const minF = packMin ? packMin.cardsCount : 0;

            CardsPack.findOne(user_id0)
                .sort({cardsCount: -1}).exec() //find pack with max count of cards
                .then((packMax: ICardsPack | null) => {
                    const maxF = packMax ? packMax.cardsCount : minF;

                    const sortName: string = (sortPacksF && sortPacksF.length > 2) ? sortPacksF.slice(1) : '';
                    const direction = sortName ? (sortPacksF[0] === '0' ? -1 : 1) : undefined;
                    const sort0: any = sortName ? {[sortName]: direction} : {updated: -1}

                    const findBase = {
                        name: new RegExp(packNameF, 'gi'),
                        cardsCount: {$gte: min && +min || minF, $lte: max && +max || maxF}
                    };
                    const findPrivate = user_idF && user._id.equals(user_idF) ? {} : {private: false};
                    const findByUserId = user_id ? {user_id: user_idF} : {};

                    const find0 = {
                        ...findByUserId,
                        ...findBase,
                        ...findPrivate
                    }

                    CardsPack.count(find0)
                        .exec()
                        .then((cardPacksTotalCount: number) => {
                            if (pageCountF * (pageF - 1) > cardPacksTotalCount) pageF = 1;

                            CardsPack.find(find0)
                                .sort(sort0) //TODO: fix any type for sortO or check
                                .skip(pageCountF * (pageF - 1))
                                .limit(pageCountF)
                                .lean()
                                .exec()
                                .then((cardsPacks) => {

                                    resCookie(res, user).status(200)
                                        .json({
                                            cardsPacks,
                                            page: pageF, pageCount: pageCountF, cardPacksTotalCount,
                                            minCardsCount: minF, maxCardsCount: maxF,
                                            token: user.token,
                                            tokenDeathTime: user.tokenDeathTime
                                        })
                                })
                                .catch( (e) => status500(res, e, user, 'getCardPacks/CardsPack.find'))


                        })
                        .catch((e) => status500(res, e, user, 'getCardPack/CardsPack.count'))

                })
                .catch((e) => status500(res, e, user, 'getCardPacks/CardsPack.findOne/max'))

        })
        .catch((e) => status500(res, e, user, 'getCardPacks/CardsPack.findOne/min'))


}