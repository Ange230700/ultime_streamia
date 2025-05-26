// prisma\seed.ts

import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";
import { urlToBytes, dataUriToBytes } from "@/utils/seedUtils";

const SALT_ROUNDS = 10;

async function safeDelete(fn: () => Promise<unknown>, name: string) {
  const MAX = 5;
  let tries = 0;
  while (true) {
    try {
      await fn();
      console.log(`✔️ Cleared ${name}`);
      return;
    } catch (error: unknown) {
      // first narrow to PrismaClientKnownRequestError
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034" &&
        tries < MAX
      ) {
        tries++;
        console.warn(`⏳ Deadlock on ${name}, retrying (${tries}/${MAX})…`);
        continue;
      }
      // if it wasn’t the specific error (or maxed out), rethrow
      throw error;
    }
  }
}

async function cleanup() {
  await safeDelete(
    () => prisma.watchlist_video.deleteMany(),
    "watchlist_video",
  );
  await safeDelete(() => prisma.watchlist.deleteMany(), "watchlist");
  await safeDelete(() => prisma.favorite.deleteMany(), "favorite");
  await safeDelete(() => prisma.comment.deleteMany(), "comment");
  await safeDelete(() => prisma.category_video.deleteMany(), "category_video");
  await safeDelete(() => prisma.video.deleteMany(), "video");
  await safeDelete(() => prisma.category.deleteMany(), "category");
  await safeDelete(() => prisma.user.deleteMany(), "user");
  await safeDelete(() => prisma.avatar.deleteMany(), "avatar");
}

async function main() {
  console.log("🌱 Start seeding...");

  // 1. Clean up in the right order
  await cleanup();

  // 2. Create some avatars
  const avatars = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const bytes = await urlToBytes(faker.image.avatar());
      return prisma.avatar.create({
        data: {
          image_data: bytes,
          created_at: faker.date.past({ years: 2 }),
          updated_at: faker.date.recent({ days: 30 }),
        },
      });
    }),
  );
  console.log(`✔️  Created ${avatars.length} avatars`);

  // 3. Create some users
  const users = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const plain = faker.internet.password({ length: 12 });
      const hash = await bcrypt.hash(plain, SALT_ROUNDS);
      const maybeAvatar = faker.datatype.boolean(0.7)
        ? faker.helpers.arrayElement(avatars)
        : undefined;
      return prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: hash,
          is_admin: faker.datatype.boolean(0.1),
          avatar_id: maybeAvatar?.avatar_id ?? undefined,
        },
      });
    }),
  );
  console.log(`✔️  Created ${users.length} users`);

  // 4. Create Categories (unique names)
  const categoryNames = new Set<string>();
  while (categoryNames.size < 5) {
    categoryNames.add(faker.commerce.department());
  }

  const categories = await Promise.all(
    Array.from(categoryNames).map((name) =>
      prisma.category.create({
        data: { category_name: name },
      }),
    ),
  );
  console.log(`✔️  Created ${categories.length} categories`);

  // 5. Create Videos
  const videos = await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const coverUri = faker.image.dataUri({
        width: 384,
        height: 216,
        type: "svg-base64",
      });

      return prisma.video.create({
        data: {
          video_title: faker.lorem.words(3),
          video_description: faker.lorem.paragraph(),
          thumbnail: dataUriToBytes(coverUri),
          video_data: undefined,
          video_duration: faker.date.recent(),
          release_date: faker.date.past(),
          is_available: faker.datatype.boolean(),
        },
      });
    }),
  );
  console.log(`✔️  Created ${videos.length} videos`);

  const allIds = videos.map((v) => Number(v.video_id));
  const shuffled = faker.helpers.shuffle(allIds);
  const half = shuffled.slice(0, Math.floor(shuffled.length / 2));

  // make exactly these “half” open
  await prisma.video.updateMany({
    where: { video_id: { in: half.map((id) => BigInt(id)) } },
    data: { is_available: true },
  });
  // the other half stay false by our earlier updateMany
  console.log("🔐 Random half unlocked for visitors");

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
  const favSet = new Set<string>();
  const favData: { user_id: bigint; video_id: bigint }[] = [];

  while (favData.length < 50) {
    const u = faker.helpers.arrayElement(users).user_id;
    const v = faker.helpers.arrayElement(videos).video_id;
    const key = `${u.toString()}-${v.toString()}`;
    if (!favSet.has(key)) {
      favSet.add(key);
      favData.push({ user_id: u, video_id: v });
    }
  }

  const favoriteCreations = await Promise.all(
    favData.map((data) =>
      prisma.favorite.create({
        data,
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
