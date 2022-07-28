import {Express, Request, Response} from 'express';
import {VERSION_1_0} from './config';
import auth from '../lb-2-features/f-1-auth';
import cards from '../lb-2-features/f-2-cards';

export const routes = (app: Express) => {
    app.use(VERSION_1_0 + '/auth', auth);
    app.use(VERSION_1_0 + '/cards', cards);

    // ping endpoint
    app.use(VERSION_1_0 + '/ping', (req: Request, res: Response) => {

        // save statistic // TODO?
        const backTime = new Date().getTime();
        const frontTime = (req.query.frontTime && +req.query.frontTime) || (backTime + 1);
        const ping = backTime - frontTime;
        console.warn('!!! PING: ', ping); // need log always

        res.status(200).json({
            ping,
            backTime: backTime,
            frontTime: frontTime > backTime ? 'please send me your time!' : frontTime,
        });

    });


    //default
    app.use((req: Request, res: Response) => {
        console.log('Bad url: ', req.method, req.url);
        res.status(404).json({
            error: 'Bad url',
            method: req.method,
            url: req.url,
            query: req.query,
            body: req.body
        });
    });
};