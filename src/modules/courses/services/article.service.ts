import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import Article from '../entities/article.entity';

@Injectable()
export default class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>
  ) {}

  create(createArticlesDto: Partial<Article>): Promise<Article> {
    return this.articleRepository.save(
      this.articleRepository.create(createArticlesDto)
    );
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
