// Define item type and in-memory storage

export interface Item {
    id: number;
    name: string;
}

export const items: Item[] = [];

export interface Users {
    id: number;
    password: string & { length: 10 };
    role: 'Customer' | 'Agent' | 'Store' | 'Admin';
}

