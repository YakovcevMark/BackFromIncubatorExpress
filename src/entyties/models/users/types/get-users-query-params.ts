import type {User} from "./user-types.js";

export type GetUsersQueryParams = Pick<User, 'name' | 'destiny'>