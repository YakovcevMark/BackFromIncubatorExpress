export type User = {
    id: number
    name: string
    destiny: string
    isCreated: boolean
}

export type UserViewModel = Omit<User, 'isCreated'>;