import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userWithoutPersonnel = await prisma.user.create({
        data: {
            username: 'admin@gmail.com',
            password: '$2b$05$ec6S.lNJvCCvR.sgjAVurOaqwH0A5WqQ74sbdenMdUZY77ul08Hi.',
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ',
        },
    });


    await prisma.personnel.create({
        data: {
            name: 'Admin',
            user: {
                connect: {
                    id: userWithoutPersonnel.id,
                },
            },
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
