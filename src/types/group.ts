export interface Group {
    uid: string;
    description: string;
    creatad_at: Date;
    updated_at: Date;
}

export interface CreateGroup {
    description: string;
}

export interface UpdateGroup {
    description?: string;
}