// prisma\seed.js

import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create Avatars
  const avatars = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.avatar.create({
        data: { image_data: Buffer.from(faker.string.alphanumeric(20)) },
      }),
    ),
  );

  // Create Users
  const users = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: faker.internet.email().toLowerCase(),
          password: faker.internet.password({ length: 20 }),
          is_admin: faker.datatype.boolean(),
          avatar_id:
            avatars[faker.number.int({ min: 0, max: avatars.length - 1 })]
              .avatar_id,
        },
      }),
    ),
  );

  // Create Categories
  const categories = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.category.create({
        data: { category_name: faker.commerce.department() },
      }),
    ),
  );

  // Create Videos
  const videos = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.video.create({
        data: {
          video_title: faker.lorem.words(3),
          video_description: faker.lorem.paragraph(),
          card_image_data: Buffer.from(faker.string.alphanumeric(20)),
          cover_image_data: Buffer.from(faker.string.alphanumeric(20)),
          video_data: Buffer.from(faker.string.alphanumeric(20)),
          video_duration: faker.date.recent(),
          release_date: faker.date.past(),
          is_available: faker.datatype.boolean(),
        },
      }),
    ),
  );

  // Link Videos to Categories
  for (const video of videos) {
    const shuffled = faker.helpers.shuffle(categories);
    const selected = shuffled.slice(0, faker.number.int({ min: 1, max: 3 }));
    for (const cat of selected) {
      await prisma.category_video.create({
        data: { video_id: video.video_id, category_id: cat.category_id },
      });
    }
  }

  // Create Comments
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

  // Create Favorites
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

  // Create Watchlists
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

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
