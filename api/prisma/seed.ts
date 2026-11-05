import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// The ISBNs below are made up, they are only here so every book has a unique one.
const genres = [
  { name: "Fiction", slug: "fiction" },
  { name: "Science Fiction", slug: "science-fiction" },
  { name: "History", slug: "history" },
  { name: "Technology", slug: "technology" },
  { name: "Fantasy", slug: "fantasy" },
];

const books = [
  { title: "Things Fall Apart", author: "Chinua Achebe", isbn: "9781000000001", copies: 3, genre: "fiction" },
  { title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie", isbn: "9781000000002", copies: 2, genre: "fiction" },
  { title: "The Kite Runner", author: "Khaled Hosseini", isbn: "9781000000003", copies: 2, genre: "fiction" },
  { title: "A Grain of Wheat", author: "Ngugi wa Thiong'o", isbn: "9781000000004", copies: 1, genre: "fiction" },

  { title: "Dune", author: "Frank Herbert", isbn: "9781000000005", copies: 4, genre: "science-fiction" },
  { title: "Neuromancer", author: "William Gibson", isbn: "9781000000006", copies: 2, genre: "science-fiction" },
  { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", isbn: "9781000000007", copies: 1, genre: "science-fiction" },
  { title: "Foundation", author: "Isaac Asimov", isbn: "9781000000008", copies: 3, genre: "science-fiction" },

  { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9781000000009", copies: 3, genre: "history" },
  { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "9781000000010", copies: 2, genre: "history" },
  { title: "A People's History of the United States", author: "Howard Zinn", isbn: "9781000000011", copies: 1, genre: "history" },
  { title: "Africa: A Biography of the Continent", author: "John Reader", isbn: "9781000000012", copies: 1, genre: "history" },

  { title: "Clean Code", author: "Robert C. Martin", isbn: "9781000000013", copies: 3, genre: "technology" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt and David Thomas", isbn: "9781000000014", copies: 2, genre: "technology" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", isbn: "9781000000015", copies: 2, genre: "technology" },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "9781000000016", copies: 1, genre: "technology" },

  { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "9781000000017", copies: 4, genre: "fantasy" },
  { title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", isbn: "9781000000018", copies: 2, genre: "fantasy" },
  { title: "Mistborn: The Final Empire", author: "Brandon Sanderson", isbn: "9781000000019", copies: 2, genre: "fantasy" },
];

async function main() {
  // genres first, because every book needs a genreId
  const genreIds: Record<string, number> = {};
  for (const g of genres) {
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    genreIds[g.slug] = genre.id;
  }

  for (const b of books) {
    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: {
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        totalCopies: b.copies,
        availableCopies: b.copies,
        genreId: genreIds[b.genre],
      },
    });
  }

  // two users so there is someone to test with later
  await prisma.user.upsert({
    where: { email: "librarian@example.com" },
    update: {},
    create: { email: "librarian@example.com", name: "Lena Librarian", role: Role.LIBRARIAN },
  });
  await prisma.user.upsert({
    where: { email: "patron@example.com" },
    update: {},
    create: { email: "patron@example.com", name: "Peter Patron" },
  });

  console.log(`Seeded ${genres.length} genres, ${books.length} books and 2 users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });