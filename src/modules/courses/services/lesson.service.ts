import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { Lesson } from '../entities/lessons.entity';
import MaterialMapper, { MaterialType } from '../entities/material-mapper';
import QuizService from './quiz.service';
import VideoService from './video.service';
import ResourceService from './resource.service';
import { Material } from '../entities/dto';
import { LinkQuiz } from '../entities/quiz.entity';
import { LinkVideo } from '../entities/video.entity';
import { LinkArticle } from '../entities/article.entity';
import ArticleService from './article.service';

@Injectable()
export default class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly quizService: QuizService,
    private readonly videoService: VideoService,
    private readonly resourceService: ResourceService,
    private readonly articleService: ArticleService
  ) {}

  async create(module: DeepPartial<Lesson>) {
    return this.lessonRepository.save(this.lessonRepository.create(module));
  }

  async findOne(id: string) {
    return this.lessonRepository.findOne({
      where: { id: Equal(id) },
    });
  }

  find(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  async getDetails(lesson: DeepPartial<Lesson>): Promise<{
    id: string;
    name: string;
    description: string;
    materials: Material[]; // MaterialIF;
  }> {
    return {
      id: lesson.id,
      name: lesson.name,
      description: lesson.description,
      materials: (
        await Promise.all(
          lesson.materialMapper?.map(
            async (material: MaterialMapper): Promise<Material | null> => {
              if (material.material_type === MaterialType.QUIZ) {
                const quiz = await this.quizService.findOne(
                  material.material_id
                );
                if (!quiz) return null;

                const result: LinkQuiz = {
                  ...quiz,
                  order: material.order,
                  type: MaterialType.QUIZ,
                };

                return result;
              }

              if (material.material_type === MaterialType.VIDEO) {
                const video = await this.videoService.findOne(
                  material.material_id
                );
                if (!video) return null;

                const result: LinkVideo = {
                  ...video,
                  order: material.order,
                  type: MaterialType.VIDEO,
                };

                return result;
              }

              if (material.material_type === MaterialType.ARTICLE) {
                const resource = await this.articleService.findOne(
                  material.material_id
                );
                if (!resource) return null;

                const result: LinkArticle = {
                  ...resource,
                  order: material.order,
                  type: MaterialType.ARTICLE,
                };

                return result;
              }

              return null;
            }
          ) ?? []
        )
      )
        .filter((m): m is Material => m !== null)
        .sort((a, b) => a.order - b.order),
    };
  }
}
