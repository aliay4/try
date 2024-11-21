export interface Password {
    id: string;
    title: string;
    username: string;
    password: string;
    website?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    strength: number;
    category: string;
}

export interface Vault {
    passwords: Password[];
    lastSync: Date;
}