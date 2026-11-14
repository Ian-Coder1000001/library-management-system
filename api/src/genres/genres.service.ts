import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateGenreDto } from "./dto/create-genre.dto.js";
import { UpdateGenreDto } from "./dto/update-genre.dto.js";

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.genre.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { books: true } } },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });
    if (!genre) throw new NotFoundException(`Genre ${id} not found`);
    return genre;
  }

  async create(dto: CreateGenreDto) {
    const existing = await this.prisma.genre.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
    });
    if (existing) {
      throw new ConflictException("A genre with that name or slug already exists");
    }
    return this.prisma.genre.create({ data: dto });
  }

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id);

    const checks: { name?: string; slug?: string }[] = [];
    if (dto.name) checks.push({ name: dto.name });
    if (dto.slug) checks.push({ slug: dto.slug });

    const clash = await this.prisma.genre.findFirst({
      where: { id: { not: id }, OR: checks },
    });
    if (clash) {
      throw new ConflictException("A genre with that name or slug already exists");
    }

    return this.prisma.genre.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    const bookCount = await this.prisma.book.count({ where: { genreId: id } });
    if (bookCount > 0) {
      throw new ConflictException("This genre still has books, move or delete them first");
    }
    return this.prisma.genre.delete({ where: { id } });
  }
}