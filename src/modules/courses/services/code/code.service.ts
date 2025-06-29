import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { TestCase } from '../../entities/code/test-case.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeLesson } from '../../entities/code/code-lesson.entity';

@Injectable()
export class CodeLessonService {
  constructor(
    @InjectRepository(CodeLesson)
    private codeLessonRepository: Repository<CodeLesson>
  ) {}

  async createLesson(createDto: any): Promise<CodeLesson> {
    const queryRunner =
      this.codeLessonRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const codeLesson = this.buildCodeLesson(createDto);

      const savedLesson = await queryRunner.manager.save(
        CodeLesson,
        codeLesson
      );

      const testCases = this.buildTestCases(
        createDto.testCases,
        savedLesson.id
      );
      await queryRunner.manager.save(TestCase, testCases);

      await queryRunner.commitTransaction();
      return await this.findOne(savedLesson.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log({ error });
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private buildCodeLesson(dto: any): CodeLesson {
    return this.codeLessonRepository.create({
      main_title: dto.main_title,
      duration: dto.duration,
      hint: dto.hint,
      initialCode: dto.initialCode,
      data: dto.data.containers.map((section) => ({
        ...section,
      })),
    });
  }

  private buildTestCases(testCases: any[], lessonId: string): TestCase[] {
    return testCases.map((testCase) =>
      this.codeLessonRepository.manager.create(TestCase, {
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        description: testCase.description,
        lessonId,
      })
    );
  }

  async getAll(page: number = 1, limit: number = 10): Promise<any> {
    const [lessons, total] = await this.codeLessonRepository.findAndCount({
      relations: ['testCases'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return lessons;
  }

  // async deleteLesson(id: string): Promise<void> {
  //   const lesson = await this.codeLessonRepository.findOne({ where: { id } });

  //   if (!lesson) {
  //     throw new Error('Lesson not found');
  //   }

  //   // Soft delete
  //   lesson.isActive = false;
  //   await this.codeLessonRepository.save(lesson);
  // }

  // async findAll(
  //   page: number = 1,
  //   limit: number = 10
  // ): Promise<{
  //   lessons: CodeLesson[];
  //   total: number;
  //   page: number;
  //   totalPages: number;
  // }> {
  //   const [lessons, total] = await this.codeLessonRepository.findAndCount({
  //     where: { isActive: true },
  //     relations: ['codeSnippets', 'testCases'],
  //     order: { createdAt: 'DESC' },
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });

  //   return {
  //     lessons,
  //     total,
  //     page,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  async findOne(id: string): Promise<CodeLesson> {
    const lesson = await this.codeLessonRepository.findOne({
      where: { id },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  // async validateUserCode(
  //   lessonId: string,
  //   userCode: string
  // ): Promise<ValidationResult> {
  //   const lesson = await this.findOne(lessonId);
  //   const startTime = Date.now();

  //   try {
  //     // Execute the user's code
  //     const executionResult: ExecutionResult =
  //       await this.codeExecutionService.executeCode(
  //         userCode,
  //         lesson.programmingLanguage,
  //         lesson.timeLimit as any,
  //         lesson.memoryLimit
  //       );

  //     if (!executionResult.success) {
  //       return {
  //         passed: false,
  //         totalTests: lesson.testCases.length,
  //         passedTests: 0,
  //         results: [],
  //         executionTime: executionResult.executionTime,
  //         error: executionResult.error || 'Code execution failed',
  //       };
  //     }

  //     // Compare output with test cases
  //     const results = lesson.testCases.map((testCase, index) => {
  //       const actualOutput = executionResult.output.trim();
  //       const expectedOutput = testCase.expectedOutput.trim();
  //       const passed = this.compareOutputs(actualOutput, expectedOutput);

  //       return {
  //         testCase: `Test Case ${index + 1}`,
  //         expected: expectedOutput,
  //         actual: actualOutput,
  //         passed,
  //         isHidden: testCase.isHidden,
  //         description: testCase.description,
  //       };
  //     });

  //     const passedTests = results.filter((r) => r.passed).length;

  //     return {
  //       passed: passedTests === lesson.testCases.length,
  //       totalTests: lesson.testCases.length,
  //       passedTests,
  //       results,
  //       executionTime: Date.now() - startTime,
  //     };
  //   } catch (error) {
  //     return {
  //       passed: false,
  //       totalTests: lesson.testCases.length,
  //       passedTests: 0,
  //       results: [],
  //       executionTime: Date.now() - startTime,
  //       error: error.message,
  //     };
  //   }
  // }

  // private compareOutputs(actual: string, expected: string): boolean {
  //   // Normalize outputs for comparison
  //   const normalizeOutput = (output: string) => {
  //     return output
  //       .trim()
  //       .replace(/\r\n/g, '\n') // Normalize line endings
  //       .replace(/\s+/g, ' ') // Normalize whitespace
  //       .toLowerCase();
  //   };

  //   return normalizeOutput(actual) === normalizeOutput(expected);
  // }

  // async remove(id: string): Promise<void> {
  //   const lesson = await this.codeLessonRepository.findOne({ where: { id } });
  //   if (!lesson) {
  //     throw new NotFoundException('Lesson not found');
  //   }

  //   // Soft delete
  //   lesson.isActive = false;
  //   await this.codeLessonRepository.save(lesson);
  // }

  findAll(where: FindManyOptions<CodeLesson>) {
    return this.codeLessonRepository.find(where);
  }
}
