import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { Lesson } from '../entities/lessons.entity';
import MaterialMapper, { MaterialType } from '../entities/material-mapper';
import VideoService from './video.service';
import ResourceService from './resource.service';
import { Material } from '../entities/dto';
import { LinkVideo } from '../entities/video.entity';
import { LinkResource } from '../entities/resource.entity';
import QuizGroupService from './quiz.group.service';
import { QuizGroupIF } from '../entities/quiz.group.entity';

@Injectable()
export default class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly quizGroupService: QuizGroupService,
    private readonly videoService: VideoService,
    private readonly resourceService: ResourceService
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
              if (material.material_type === MaterialType.QUIZ_GROUP) {
                const quizGroup = await this.quizGroupService.findOne(
                  material.material_id
                );
                if (!quizGroup) return null;

                const result: QuizGroupIF = {
                  ...quizGroup,
                  quizzes: (
                    await this.quizGroupService.getQuizzes(quizGroup.id)
                  ).quizzes.map((quiz) => ({
                    ...quiz,
                    type: MaterialType.QUIZ,
                  })),
                  order: material.order,
                  type: MaterialType.QUIZ_GROUP,
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

              if (material.material_type === MaterialType.RESOURCE) {
                const resource = await this.resourceService.findOne(
                  material.material_id
                );
                if (!resource) return null;

                const result: LinkResource = {
                  ...resource,
                  order: material.order,
                  type: MaterialType.RESOURCE,
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
