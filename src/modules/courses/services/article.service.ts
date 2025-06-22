import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import { ArticleDto } from '../entities/dto';
import { Article } from '../entities/article.entity';

@Injectable()
export default class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>
  ) {}

  async create(createArticlesDto: any): Promise<Article> {
    const article = this.articleRepository.create({
      duration: createArticlesDto.duration,
      data: createArticlesDto,
    });
    return await this.articleRepository.save(article);
  }

  async getAll(): Promise<Article[]> {
    return this.articleRepository.find();
  }

  findAll(where: FindManyOptions<Article>) {
    return this.articleRepository.find(where);
  }

  async findOne(id: string): Promise<Article> {
    return await this.articleRepository.findOne({
      where: {
        id: Equal(id),
      },
    });
  }
}
