import express from 'express';
import {findUserByToken} from '../f-1-auth/a-3-helpers/findUserByToken';
import {getCardPack} from './c-1-controllers/packs/getCardPack';
import {addCardsPack} from './c-1-controllers/packs/addCardsPack';
import {updateCardsPack} from './c-1-controllers/packs/updateCardsPack';
import {deleteCardsPack} from './c-1-controllers/packs/deleteCardsPack';

const cards = express.Router();

cards.get('/pack', findUserByToken(getCardPack, 'getCardsPack'));
cards.post('/pack', findUserByToken(addCardsPack, 'addCardsPack'));
cards.put('/pack', findUserByToken(updateCardsPack, 'updateCardsPack'))
cards.delete('/pack', findUserByToken(deleteCardsPack, 'deleteCardsPack'))
export default cards;