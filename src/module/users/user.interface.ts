
export interface IUser {
    id: string;
    name : string;
    email: string;
    password: string;
    age: string;
    role?: "user" | "moderator" | "admin";
    is_active?: boolean
}