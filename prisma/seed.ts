// prisma\seed.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log("Start seeding...");

  // 1. Clean up in the right order
  await prisma.watchlist_video.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.category_video.deleteMany();
  await prisma.video.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.avatar.deleteMany();

  // 2. Create some avatars (just null blobs for now)
  const avatars = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.avatar.create({ data: { image_data: null } }),
    ),
  );

  // 3. Create some users
  const users = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const plainPassword = faker.internet.password({ length: 12 });
      const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
      const avatar = faker.helpers.arrayElement(avatars);

      return prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: passwordHash,
          is_admin: faker.datatype.boolean(0.1), // ~10% admins
          avatar_id: avatar.avatar_id,
        },
      });
    }),
  );

  // Create Categories
  const categories = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.category.create({
        data: { category_name: faker.commerce.department() },
      }),
    ),
  );

  // 5. Create Videos
  const videos = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.video.create({
        data: {
          video_title: faker.lorem.words(3),
          video_description: faker.lorem.paragraph(),
          card_image_data: null,
          cover_image_data: null,
          video_data: null,
          video_duration: faker.date.recent(),
          release_date: faker.date.past(),
          is_available: faker.datatype.boolean(),
        },
      }),
    ),
  );

  // 6. Link videos to random categories
  for (const video of videos) {
    const shuffled = faker.helpers.shuffle(categories);
    const selected = shuffled.slice(0, faker.number.int({ min: 1, max: 3 }));
    for (const cat of selected) {
      await prisma.category_video.create({
        data: { video_id: video.video_id, category_id: cat.category_id },
      });
    }
  }

  // 7. Create comments
  for (let i = 0; i < 50; i++) {
    await prisma.comment.create({
      data: {
        user_id:
          users[faker.number.int({ min: 0, max: users.length - 1 })].user_id,
        video_id:
          videos[faker.number.int({ min: 0, max: videos.length - 1 })].video_id,
        comment_content: faker.lorem.sentences(2),
        written_at: faker.date.recent(),
      },
    });
  }

  // 8. Create favorites
  for (let i = 0; i < 50; i++) {
    await prisma.favorite.create({
      data: {
        user_id:
          users[faker.number.int({ min: 0, max: users.length - 1 })].user_id,
        video_id:
          videos[faker.number.int({ min: 0, max: videos.length - 1 })].video_id,
      },
    });
  }

  // 9. Create watchlists and watchlist_video
  const watchlists = await Promise.all(
    users.map((user) => {
      const randomVideo =
        videos[faker.number.int({ min: 0, max: videos.length - 1 })];
      return prisma.watchlist.create({
        data: {
          user_id: user.user_id,
          video_id: randomVideo.video_id,
        },
      });
    }),
  );

  // Link Watchlists to Videos
  for (const list of watchlists) {
    const selectedVideos = faker.helpers
      .shuffle(videos)
      .slice(0, faker.number.int({ min: 1, max: 5 }));
    for (const vid of selectedVideos) {
      await prisma.watchlist_video.create({
        data: { watchlist_id: list.watchlist_id, video_id: vid.video_id },
      });
    }
  }

  console.log("🌱 Database has been seeded with Faker data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
