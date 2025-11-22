const { Client, Databases, Storage, ID, Permission, Role } = require('node-appwrite');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DB_NAME = 'PortfolioDB';
const DB_ID = 'portfolio-db'; // Custom ID for easier reference
const BUCKET_ID = 'portfolio-assets';

async function setup() {
    try {
        console.log('Starting Appwrite Setup...');

        // 1. Create Database
        try {
            await databases.get(DB_ID);
            console.log('Database already exists.');
        } catch (error) {
            await databases.create(DB_ID, DB_NAME);
            console.log('Database created.');
        }

        // 2. Create Collections & Attributes
        await createCollection('hero-section', 'HeroSection', [
            { key: 'headline', type: 'string', size: 255, required: true },
            { key: 'subheadline', type: 'string', size: 1000, required: true },
            { key: 'ctaText', type: 'string', size: 50, required: false },
            { key: 'ctaLink', type: 'string', size: 255, required: false },
        ]);

        await createCollection('about-section', 'AboutSection', [
            { key: 'bio', type: 'string', size: 5000, required: true },
            { key: 'avatarId', type: 'string', size: 255, required: false },
        ]);

        await createCollection('projects', 'Projects', [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 5000, required: true },
            { key: 'coverImageId', type: 'string', size: 255, required: false },
            { key: 'liveUrl', type: 'string', size: 1000, required: false },
            { key: 'repoUrl', type: 'string', size: 1000, required: false },
            { key: 'tags', type: 'string', size: 255, array: true, required: false },
        ]);

        await createCollection('skills', 'Skills', [
            { key: 'name', type: 'string', size: 100, required: true },
            { key: 'icon', type: 'string', size: 255, required: false }, // Lucide icon name
            { key: 'category', type: 'string', size: 100, required: true }, // Frontend, Backend, etc.
        ]);

        await createCollection('experience', 'Experience', [
            { key: 'role', type: 'string', size: 255, required: true },
            { key: 'company', type: 'string', size: 255, required: true },
            { key: 'startDate', type: 'string', size: 50, required: true },
            { key: 'endDate', type: 'string', size: 50, required: false },
            { key: 'description', type: 'string', size: 5000, required: false },
        ]);
        
        await createCollection('settings', 'Settings', [
             { key: 'cvFileId', type: 'string', size: 255, required: false },
             { key: 'linkedinUrl', type: 'string', size: 1000, required: false },
             { key: 'githubUrl', type: 'string', size: 1000, required: false },
             { key: 'twitterUrl', type: 'string', size: 1000, required: false },
             { key: 'contactEmail', type: 'string', size: 255, required: false },
        ]);

        // 3. Create Storage Bucket
        try {
            await storage.getBucket(BUCKET_ID);
            console.log('Storage bucket already exists.');
        } catch (error) {
            await storage.createBucket(BUCKET_ID, 'PortfolioAssets', [Permission.read(Role.any())], true);
            console.log('Storage bucket created.');
        }

        // 4. Seed Dummy Data (Optional - only if collections are empty)
        await seedData();

        console.log('Setup complete!');

    } catch (error) {
        console.error('Error during setup:', error);
    }
}

async function createCollection(id, name, attributes) {
    try {
        await databases.getCollection(DB_ID, id);
        console.log(`Collection ${name} already exists.`);
    } catch (error) {
        await databases.createCollection(DB_ID, id, name, [Permission.read(Role.any())]);
        console.log(`Collection ${name} created.`);
        
        // Create attributes
        for (const attr of attributes) {
            try {
                if (attr.array) {
                     await databases.createStringAttribute(DB_ID, id, attr.key, attr.size, attr.required, undefined, true);
                } else {
                     await databases.createStringAttribute(DB_ID, id, attr.key, attr.size, attr.required);
                }
                // Wait a bit to avoid rate limits or race conditions
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (e) {
                console.log(`Attribute ${attr.key} might already exist or failed:`, e.message);
            }
        }
        console.log(`Attributes for ${name} created.`);
        // Wait for attributes to be available
        console.log(`Waiting for attributes to be indexed...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

async function seedData() {
    console.log('Seeding initial data...');
    try {
        // Check if Hero Section has data
        const heroDocs = await databases.listDocuments(DB_ID, 'hero-section');
        if (heroDocs.total === 0) {
            await databases.createDocument(DB_ID, 'hero-section', ID.unique(), {
                headline: "Building Digital Experiences",
                subheadline: "I'm a Full Stack Developer specializing in building exceptional digital experiences.",
                ctaText: "View Projects",
                ctaLink: "#projects"
            });
            console.log('Seeded Hero Section.');
        }

        // Check if Skills has data
        const skillsDocs = await databases.listDocuments(DB_ID, 'skills');
        if (skillsDocs.total === 0) {
            await databases.createDocument(DB_ID, 'skills', ID.unique(), { name: 'React', category: 'Frontend', icon: 'React' });
            await databases.createDocument(DB_ID, 'skills', ID.unique(), { name: 'Next.js', category: 'Frontend', icon: 'Nextjs' });
            await databases.createDocument(DB_ID, 'skills', ID.unique(), { name: 'Node.js', category: 'Backend', icon: 'Nodejs' });
            console.log('Seeded Skills.');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

setup();
