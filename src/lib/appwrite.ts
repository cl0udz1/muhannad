import { Client, Account, Databases, Storage, Query } from 'appwrite';

export const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'dummy-project';

client
    .setEndpoint(endpoint)
    .setProject(projectId);

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
