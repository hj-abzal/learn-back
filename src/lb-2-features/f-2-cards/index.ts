import express from 'express';
import {findUserByToken} from '../f-1-auth/a-3-helpers/findUserByToken';
import {getCardPacks} from './c-1-controllers/packs/getCardPacks';
import {addCardsPack} from './c-1-controllers/packs/addCardsPack';

const cards = express.Router();

cards.get('/pack', findUserByToken(getCardPacks, 'getCardsPacks'));
cards.post('/pack', findUserByToken(addCardsPack, 'addCardsPack'))
export default cards;