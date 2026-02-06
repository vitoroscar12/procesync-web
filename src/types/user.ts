export type UserRole = 'Admin' | 'Standard';

export interface User {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface createUserInput{
    name:string;
    email:string;
    password: string;
    role:UserRole
}

export interface loginRequest{
    email: string;
    password:string
}