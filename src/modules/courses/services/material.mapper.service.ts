import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, In, Repository } from 'typeorm';
import MaterialMapper, { MaterialType } from '../entities/material-mapper';
import { LinkVideo } from '../entities/video.entity';
import VideoService from './video.service';
import ArticleService from './article.service';
import QuizGroupService from './quiz.group.service';
import { QuizGroupIF } from '../entities/quiz.group.entity';
import { LinkArticle } from '../entities/article.entity';

@Injectable()
export default class MaterialMapperService {
  constructor(
    @InjectRepository(MaterialMapper)
    private readonly lessonMapperRepo: Repository<MaterialMapper>,
    private readonly quizGroupService: QuizGroupService,
    private readonly videoService: VideoService,
    private readonly articleService: ArticleService
  ) {}

  create(map: DeepPartial<MaterialMapper>) {
    return this.lessonMapperRepo.save(this.lessonMapperRepo.create(map));
  }

  getMaterials(lesson_id: string): Promise<MaterialMapper[]> {
    return this.lessonMapperRepo.find({
      where: { lesson: { id: lesson_id } },
    });
  }

  async findAllMaterialsByLesson(lesson_id: string): Promise<{
    quiz_groups: QuizGroupIF[];
    videos: LinkVideo[];
    article: LinkArticle[];
  }> {
    const [videos, article] = await Promise.all([
      this.getTypedMaterials(lesson_id, MaterialType.VIDEO, this.videoService),
      this.getTypedMaterials(
        lesson_id,
        MaterialType.ARTICLE,
        this.articleService
      ),
    ]);

    const lessonMapper = await this.lessonMapperRepo.find({
      where: { lesson: { id: Equal(lesson_id) } },
    });

    const raw_quiz_groups = await this.quizGroupService.findAll({
      where: {
        id: In(
          lessonMapper
            .filter((m) => m.material_type == MaterialType.QUIZ_GROUP)
            .map((m) => m.material_id)
        ),
      },
      relations: { quizzes: true },
    });

    const quiz_groups: QuizGroupIF[] = raw_quiz_groups.map((mapper, ind) => ({
      id: mapper.id,
      title: mapper.title,
      quizzes: mapper.quizzes.map((quiz) => ({
        ...quiz,
        order: quiz.order,
        type: MaterialType.QUIZ,
      })),
      order: lessonMapper.find((m) => m.material_id == mapper.id).order ?? ind,
      type: MaterialType.QUIZ_GROUP,
    }));

    return { quiz_groups, videos, article };
  }

  getTypedMaterials = async <T extends { id: string }, U extends MaterialType>(
    lesson_id: string,
    type: U,
    service: { findAll: (options: any) => Promise<T[]> }
  ): Promise<(T & { order: number; type: U })[]> => {
    const material = await this.lessonMapperRepo.find({
      where: { lesson: { id: Equal(lesson_id) } },
    });
    const filtered = material.filter((m) => m.material_type == type);
    const items = await service.findAll({
      where: {
        id: In(filtered.map((m) => m.material_id)),
      },
    });

    return items.map((item) => {
      const matched = filtered.find((m) => m.material_id === item.id);
      return {
        ...item,
        order: matched?.order ?? 0,
        type,
      };
    });
  };
}
