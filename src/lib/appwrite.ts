import { Client, Account, Databases, Storage, Query } from 'appwrite';

export const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DB_ID = 'portfolio-db';
export const COLLECTIONS = {
    HERO: 'hero-section',
    ABOUT: 'about-section',
    PROJECTS: 'projects',
    SKILLS: 'skills',
    EXPERIENCE: 'experience',
    SETTINGS: 'settings',
};
export const BUCKET_ID = 'portfolio-assets';
