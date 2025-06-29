import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TestCase } from '../../entities/code/test-case.entity';

export class CreateCodeSnippetDto {
  title?: string;
  language: string;
  code: string;
}

export class CreateTestCaseDto {
  input: string;
  expectedOutput: string;
  description?: string;
  isHidden: boolean;
}

export class CreateCodeLessonDto {
  title: string;
  description?: string;
  body: string;
  data: any;
  imageUrl?: string;
  videoUrl?: string;
  resourceUrl?: string;
  hint?: string;
  duration?: number;
  programmingLanguage: string;
  initialCode?: string;
  testCases: CreateTestCaseDto[];
}

export class UpdateCodeLessonDto extends CreateCodeLessonDto {
  id: string;
}

export class CodeLessonResponseDto {
  id: string;
  title: string;
  description?: string;
  body: string;
  imageUrl?: string;
  videoUrl?: string;
  resourceUrl?: string;
  hint?: string;
  programmingLanguage: string;
  initialCode?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  memoryLimit: number;
  isActive: boolean;
  testCases: TestCase[];
  createdAt: Date;
  updatedAt: Date;
}

export class ExecuteCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(30000)
  timeLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(16)
  @Max(1024)
  memoryLimit?: number;
}

export class ValidateCodeDto extends ExecuteCodeDto {
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}

export interface ValidationResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  results: Array<{
    testCase: string;
    expected: string;
    actual: string;
    passed: boolean;
    isHidden: boolean;
    description?: string;
  }>;
  executionTime: number;
  error?: string;
}
