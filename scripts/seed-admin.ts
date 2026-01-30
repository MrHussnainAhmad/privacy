import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

// Load env vars before importing db
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seed() {
    // Dynamic import to prevent hoisting issues
    const dbConnect = (await import('../src/lib/db')).default;
    const User = (await import('../src/models/User')).default;

    await dbConnect();
    const email = 'mrhussnainahmad@gmail.com';
    const password = 'AbdulHadi343.';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });
    if (existing) {
        console.log(`Admin user ${email} already exists. Updating password...`);
        existing.passwordHash = hashedPassword;
        await existing.save();
        console.log('Password updated.');
        process.exit(0);
    }

    await User.create({
        email,
        passwordHash: hashedPassword,
    });

    console.log(`Admin user created: ${email}`);
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
