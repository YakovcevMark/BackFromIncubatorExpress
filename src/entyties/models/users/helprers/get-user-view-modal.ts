import type {User, UserViewModel} from "../types/user-types.js";

export const getUserViewModal = (user: User): UserViewModel => {
    return {
        destiny: user.destiny,
        name: user.name,
        id: user.id,
    }
}