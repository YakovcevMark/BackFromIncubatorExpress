import type {User} from "../entyties/models/users/types/user-types.js";
import {usersInitDb} from "../entyties/models/users/db.js";

type DBType = {
    users: User[]
}

export const DB: DBType = {
    users: usersInitDb
}