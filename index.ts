import express, { type Response } from 'express';
import { _PORT } from "./src/assets/constants.js";
import { DB } from "./src/db/DB.js";
import type {
    GetEntityByIdParam,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQueryParams
} from "./src/assets/types.js";

import { HTTP_STATUS_CODES } from "./src/assets/http-status-codes.js";
import {RoutePaths} from "./src/assets/route-paths.js";
import type {GetUsersQueryParams} from "./src/entyties/models/users/types/get-users-query-params.js";
import type {UserViewModel} from "./src/entyties/models/users/types/user-types.js";
import {getUserViewModal} from "./src/entyties/models/users/helprers/get-user-view-modal.js";
import type {CreateUserDto} from "./src/entyties/models/users/types/create-user-dto.js";
import type {PatchUserDto} from "./src/entyties/models/users/types/patch-user-dto.js";

const app = express();
const jsonMiddleware = express.json()
app.use(jsonMiddleware);


app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome to the D:\BACKEND\B');
})

app.get(RoutePaths.users, (req: RequestWithQueryParams<GetUsersQueryParams>, res: Response<UserViewModel[]>) => {
    let response = DB.users

    if (req.query?.name) {
        response = response.filter(el => ~el.name.indexOf(req.query?.name as string))
    }

    if (req.query?.destiny) {
        response = response.filter(el => ~el.destiny.indexOf(req.query?.destiny as string))
    }

    res.send(response.map(getUserViewModal));
})

app.get(`${RoutePaths.users}/:id`, (req: RequestWithParams<GetEntityByIdParam>, res: express.Response) => {
    const user = DB.users.find(u => u.id === Number(req.params.id));
    if (user) {
        res.send(user)
        return;
    }
    res.send(HTTP_STATUS_CODES.NOT_FOUND_404);
})

app.post(RoutePaths.users, (req: RequestWithBody<CreateUserDto>, res: Response<UserViewModel>) => {
    if (
        !req.body?.name.trim()
        || !req.body?.destiny.trim()
    ) {
        res
            .status(HTTP_STATUS_CODES.CLIENT_ERROR_400)
        return;
    }
    const newUser = {
        id: DB.users.length,
        name: req.body.name,
        destiny: req.body.destiny,
        isCreated: true,
    }
    DB.users.push(newUser)
    res.status(HTTP_STATUS_CODES.CREATED_201).send(getUserViewModal(newUser));
})

app.patch(`${RoutePaths.users}/:id`, (req: RequestWithParamsAndBody<PatchUserDto, GetEntityByIdParam>, res: Response) => {


    const lookedUserIndex = DB.users.findIndex(u => u.id === Number(req.params.id))

    if (!~lookedUserIndex) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    if (
        !req.body?.name.trim()
        || !req.body?.destiny.trim()
    ) {
        res
            .status(HTTP_STATUS_CODES.CLIENT_ERROR_400)
            // .send({error: 'No fields to patch'});
    }


    DB.users[lookedUserIndex] = {
        ...DB.users[lookedUserIndex],
        ...req.body,
    };

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204);
})

app.delete(`${RoutePaths.users}/:id`, (req: RequestWithParams<GetEntityByIdParam>, res: Response) => {

    const initLength = DB.users.length;

    DB.users = DB.users.filter(u => u.id !== Number(req.params.id));

    const finalLength = DB.users.length;

    if (initLength === finalLength) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    res.status(HTTP_STATUS_CODES.NO_CONTENT_204);
})

app.listen(_PORT, () => {
    console.log(`Listening on port ${_PORT}`);
})