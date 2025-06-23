import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import { ArticleDto } from '../entities/dto';
import { Article } from '../entities/article.entity';
import MaterialMapper, { MaterialType } from '../entities/material-mapper';

@Injectable()
export default class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(MaterialMapper)
    private readonly materialMapperRepository: Repository<MaterialMapper>
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

  async delete(articleId: string) {
    const deleteMapper = await this.materialMapperRepository.delete({
      material_id: articleId,
      material_type: MaterialType.ARTICLE,
    });
    if (deleteMapper.affected === 0) {
      throw new NotFoundException(
        `Material mapping for Arcticle ID ${articleId} not found`
      );
    }
    const result = await this.articleRepository.delete(articleId);
    if (result.affected === 0) {
      throw new NotFoundException(`Article with ID ${articleId} not found`);
    }
  }
}
