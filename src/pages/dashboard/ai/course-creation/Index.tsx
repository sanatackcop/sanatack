export interface CourseCreationPromptDto {
  prompt: string;
  settings: {
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    topic: 'Artificial_Intelligence' | 'MACHINE_LEARNING' | 'BACKEND' | 'FRONTEND';
    duration_hours: number;
    include_code_lessons: boolean;
    include_quizzes: boolean;
    include_articles: boolean;
    language: 'ar' | 'en';
    max_modules: number;
    max_lessons_per_module: number;
  };
}

// We want to create a ai view compents 
// we will have the input prmote and after entering it we will show the setting underthidne it 
// make sure the UI look like changpt cloud ai, make it better there will be up the dto to send to the backend api 
// after that you will resive the repsonce with the resitl o
export default function AiCourseGeneration() {
  return <>
  
  
  </>;
}
