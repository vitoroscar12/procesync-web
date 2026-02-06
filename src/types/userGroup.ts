export interface UserGroup {
    uid?: string;
    grupo_uid: string;
    usuario_uid: string;
    nome:string;
    created_at?: Date;
}

export interface CreateUserGroup {
    usuario_uid: string;
}