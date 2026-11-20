import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateBookDto } from "./dto/create-book.dto.js";
import { UpdateBookDto } from "./dto/update-book.dto.js";

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(genreId?: string, search?: string, page?: string, limit?: string, sort?: string) {
    // work out page and limit (page starts at 1, limit is between 1 and 50)
    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 50);

    if (genreId && isNaN(Number(genreId))) {
      throw new BadRequestException("genreId must be a number");
    }

    const orderBy = sort === "author" ? { author: "asc" as const } : { title: "asc" as const };

    const where = {
      ...(genreId && { genreId: Number(genreId) }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { author: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [books, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        orderBy,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      page: pageNumber,
      limit: pageSize,
      total: total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async create(dto: CreateBookDto) {
    await this.checkGenreExists(dto.genreId);
    await this.checkIsbnFree(dto.isbn);

    return this.prisma.book.create({
      data: { ...dto, availableCopies: dto.totalCopies },
      include: { genre: true },
    });
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id);

    if (dto.genreId !== undefined) {
      await this.checkGenreExists(dto.genreId);
    }
    if (dto.isbn && dto.isbn !== book.isbn) {
      await this.checkIsbnFree(dto.isbn);
    }

    // if the total changes, move the available copies by the same amount
    let availableCopies = book.availableCopies;
    if (dto.totalCopies !== undefined) {
      availableCopies = Math.max(0, book.availableCopies + (dto.totalCopies - book.totalCopies));
    }

    return this.prisma.book.update({
      where: { id },
      data: { ...dto, availableCopies },
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // reviews point to the book, so they have to go first
    const [, deleted] = await this.prisma.$transaction([
      this.prisma.review.deleteMany({ where: { bookId: id } }),
      this.prisma.book.delete({ where: { id } }),
    ]);
    return deleted;
  }

  private async checkGenreExists(genreId: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre) throw new BadRequestException(`Genre ${genreId} does not exist`);
  }

  private async checkIsbnFree(isbn: string) {
    const existing = await this.prisma.book.findUnique({ where: { isbn } });
    if (existing) throw new ConflictException("A book with that ISBN already exists");
  }
}