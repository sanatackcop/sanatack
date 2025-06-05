import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { Lesson } from '../entities/lessons.entity';
import { MaterialMapper, MaterialType } from '../entities/material-mapper';
import QuizService from './quiz.service';
import VideoService from './video.service';
import ResourceService from './resource.service';

@Injectable()
export default class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly quizService: QuizService,
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

  async getDetails(lesson: DeepPartial<Lesson>): Promise<{
    id: string;
    name: string;
    description: string;
    order: number;
    materials: any; // MaterialIF;
  }> {
    return {
      id: lesson.id,
      name: lesson.name,
      description: lesson.description,
      order: lesson.order,
      materials: (
        await Promise.all(
          lesson.materialMapper?.map(async (material: MaterialMapper) => {
            if (material.material_type === MaterialType.QUIZ) {
              const quiz = await this.quizService.findOne(material.material_id);
              return quiz
                ? {
                    order: material.order,
                    type: MaterialType.QUIZ,
                    quiz: {
                      id: quiz.id,
                      question: quiz.question,
                      options: quiz.options,
                      correctAnswer: quiz.correctAnswer,
                      explanation: quiz.explanation,
                    },
                  }
                : null;
            } else if (material.material_type === MaterialType.VIDEO) {
              const video = await this.videoService.findOne(
                material.material_id
              );
              return video
                ? {
                    order: material.order,
                    type: MaterialType.VIDEO,
                    video: {
                      id: video.id,
                      title: video.title,
                      youtubeId: video.youtubeId,
                      duration: video.duration,
                      description: video.description,
                    },
                  }
                : null;
            } else if (material.material_type === MaterialType.RESOURCE) {
              const resource = await this.resourceService.findOne(
                material.material_id
              );
              console.log({ resource });
              return resource
                ? {
                    order: material.order,
                    type: MaterialType.RESOURCE,
                    resource: {
                      id: resource.id,
                      title: resource.title,
                      url: resource.url,
                      content: resource.content,
                      description: resource.description,
                    },
                  }
                : null;
            }
            return null;
          }) ?? []
        )
      ).sort((a, b) => {
        return a.order - b.order;
      }),
    };
  }
}
