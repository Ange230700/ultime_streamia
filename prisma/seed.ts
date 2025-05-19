// prisma\seed.ts

import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";
import { urlToBytes, dataUriToBytes } from "@/utils/seedUtils";

const SALT_ROUNDS = 10;

async function main() {
  console.log("🌱 Start seeding...");

  // 1. Clean up in the right order
  await Promise.all([
    prisma.watchlist_video.deleteMany(),
    prisma.watchlist.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.category_video.deleteMany(),
    prisma.video.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
    prisma.avatar.deleteMany(),
  ]);

  // 2. Create some avatars
  const avatars = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const bytes = await urlToBytes(faker.image.avatar());
      return prisma.avatar.create({ data: { image_data: bytes } });
    }),
  );
  console.log(`✔️  Created ${avatars.length} avatars`);

  // 3. Create some users
  const users = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const plain = faker.internet.password({ length: 12 });
      const hash = await bcrypt.hash(plain, SALT_ROUNDS);
      const avatar = faker.helpers.arrayElement(avatars);
      return prisma.user.create({
        data: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: hash,
          is_admin: faker.datatype.boolean(0.1),
          avatar_id: avatar.avatar_id,
        },
      });
    }),
  );
  console.log(`✔️  Created ${users.length} users`);

  // Create Categories
  const categories = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.category.create({
        data: { category_name: faker.commerce.department() },
      }),
    ),
  );
  console.log(`✔️  Created ${categories.length} categories`);

  // 5. Create Videos
  const videos = await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const cardUri = faker.image.dataUri({
        width: 384,
        height: 216,
        type: "svg-base64",
      });

      const coverUri = faker.image.dataUri({
        width: 384,
        height: 216,
        type: "svg-base64",
      });

      return prisma.video.create({
        data: {
          video_title: faker.lorem.words(3),
          video_description: faker.lorem.paragraph(),
          card_image_data: dataUriToBytes(cardUri),
          cover_image_data: dataUriToBytes(coverUri),
          video_data: null,
          video_duration: faker.date.recent(),
          release_date: faker.date.past(),
          is_available: faker.datatype.boolean(),
        },
      });
    }),
  );
  console.log(`✔️  Created ${videos.length} videos`);

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
  console.log(`✔️  Linked videos to categories`);

  // 7. Create comments
  const commentCreations = await Promise.all(
    Array.from({ length: 50 }).map(() =>
      prisma.comment.create({
        data: {
          user_id: faker.helpers.arrayElement(users).user_id,
          video_id: faker.helpers.arrayElement(videos).video_id,
          comment_content: faker.lorem.sentences(2),
          written_at: faker.date.recent(),
        },
      }),
    ),
  );
  console.log(`✔️  Created ${commentCreations.length} comments`);

  // 8. Create favorites
  const favoriteCreations = await Promise.all(
    Array.from({ length: 50 }).map(() =>
      prisma.favorite.create({
        data: {
          user_id: faker.helpers.arrayElement(users).user_id,
          video_id: faker.helpers.arrayElement(videos).video_id,
        },
      }),
    ),
  );
  console.log(`✔️  Created ${favoriteCreations.length} favorites`);

  // 9. Create watchlists and watchlist_video
  const watchlists = await Promise.all(
    users.map((user) =>
      prisma.watchlist.create({
        data: {
          user_id: user.user_id,
          video_id: faker.helpers.arrayElement(videos).video_id,
        },
      }),
    ),
  );
  console.log(`✔️  Created ${watchlists.length} watchlists`);

  await Promise.all(
    watchlists.map((wl) => {
      const vids = faker.helpers
        .shuffle(videos)
        .slice(0, faker.number.int({ min: 1, max: 5 }));
      return Promise.all(
        vids.map((vid) =>
          prisma.watchlist_video.create({
            data: {
              watchlist_id: wl.watchlist_id,
              video_id: vid.video_id,
            },
          }),
        ),
      );
    }),
  );
  console.log(`✔️  Linked videos into watchlists`);

  console.log("🎉 Database has been seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
