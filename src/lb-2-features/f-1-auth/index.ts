import {Router} from 'express';
import {logIn} from './a-1-controllers/logIn';
import {getUsersForDev} from './a-1-controllers/getUsersForDev';
import {createUser} from './a-1-controllers/createUser';
import {findUserByToken} from './a-3-helpers/findUserByToken';
import {getMe} from './a-1-controllers/getMe';
import {updateUser} from './a-1-controllers/updateUser';
import {logOut} from './a-1-controllers/logOut';

const auth = Router();

auth.get('/', getUsersForDev); //for dev

auth.post('/login', logIn);
auth.post('/register', createUser);

auth.post('/me', findUserByToken(getMe, 'getMe'));
auth.put('/me', findUserByToken(updateUser, 'updateUser'));
auth.delete('/me', findUserByToken(logOut, 'logOut'));

export default auth;