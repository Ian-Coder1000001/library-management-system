# Library Management System

This is the backend for a library's book catalog. It uses NestJS, a PostgreSQL database on Neon, and Prisma. For this week I only did the data layer: the models, the migration and a seed script. There are no API endpoints yet.

## What's in it

- User, Genre and Book models (users have a role, either PATRON or LIBRARIAN)
- A Review model as the extra task
- A seed script that adds 5 genres, 19 books and 2 users
- A PrismaService that connects Nest to the database

## How to run it

1. Go into the api folder with `cd api`
2. Run `npm install`
3. Copy `.env.example` to `.env` and put your own Postgres connection string in `DATABASE_URL`
4. Run `npx prisma migrate dev` to create the tables
5. Run `npx prisma db seed` to add the sample data
6. Run `npx prisma studio` if you want to look at the data in the browser
7. Run `npm run start:dev` to start the app on http://localhost:3000

You can run the seed more than once. It checks for existing rows first, so nothing gets added twice.

I used Prisma 6 because that is the version the course notes are written for.

## Schema Decisions

**Why Book points to Genre instead of having the genre inside the book**

Each book has a `genreId` that points to a row in the Genre table. I didn't just write the genre name inside every book.

My main reason is that one genre has lots of books. If every book had its own copy of the name, "Fantasy" would be saved over and over. One spelling mistake would then make a second genre by accident, like "Sci-Fi" and "Science Fiction" for the same thing. With a reference, the genre is stored in one place, and if I want to rename it I change one row and every book gets the new name.

The second reason is that the database checks it for me. I can't add a book with a genre that doesn't exist, and I can't delete a genre that still has books. It also makes it easy to ask for all the books in a genre, because I only have to filter by `genreId`.

**Other choices**

- Role is an enum, so a user can only be PATRON or LIBRARIAN. PATRON is the default.
- `isbn` is unique because two books shouldn't have the same one. The seed also uses it to avoid adding duplicates.
- A book has `totalCopies` and `availableCopies`. The library might own 3 copies while only 1 is on the shelf, and I think I'll need that when borrowing is added.
- Genre has a unique `slug` as well as a unique name, so it can go in a URL later.

**Review model (extra task)**

A review has a rating, an optional comment, and points to both a Book and a User. I made the book and user pair unique so one person can't review the same book twice.

**Prisma compared to a document database**

The big difference is that the relationship is written in the schema and the database enforces it. In MongoDB I would probably just have put the genre name inside each book without thinking about it. In Prisma I had to decide at the start that Genre is its own table. It was more work at first but it feels safer.

## What I learned

- How a NestJS project is organised, and how dependency injection gives `PrismaService` to the classes that need it.
- How `schema.prisma` turns into real tables when you run a migration.
- A seed script should be safe to run twice, so I used `upsert`.
- Problems I ran into: `ts-node` wasn't installed, so the seed failed and I switched to `tsx`. I also found `node_modules` was being tracked by git, so I added a `.gitignore` and removed it.