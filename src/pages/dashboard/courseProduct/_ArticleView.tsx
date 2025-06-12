import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Heart,
  Share,
  BookOpen,
  Clock,
  User,
  Code,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
}

interface QuoteProps {
  text: string;
  author?: string;
}

interface InfoCardProps {
  type: "info" | "tip" | "warning" | "success" | "error";
  title: string;
  content: string;
}

interface ArticleSlide {
  id: number;
  type: "hero" | "intro" | "section" | "code" | "quote" | "info" | "conclusion";
  title?: string;
  content?: string;
  code?: { code: string; language: string };
  quote?: { text: string; author?: string };
  info?: InfoCardProps;
  sectionNumber?: number;
}

export default function ArticleView(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(127);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const slides: ArticleSlide[] = [
    {
      id: 1,
      type: "hero",
      title: "دليل شامل لتطوير تطبيقات React مع TypeScript",
      content: "تعلم كيفية بناء تطبيقات حديثة وقوية باستخدام أفضل الممارسات",
    },
    {
      id: 2,
      type: "intro",
      title: "لماذا React مع TypeScript؟",
      content:
        "React هو مكتبة JavaScript الأكثر شعبية لبناء واجهات المستخدم، بينما TypeScript يضيف الأمان والوضوح للكود من خلال نظام الأنواع.",
    },
    {
      id: 3,
      type: "section",
      sectionNumber: 1,
      title: "ما ستتعلمه في هذا الدليل",
      content:
        "سنغطي إعداد المشروع من الصفر، إنشاء مكونات آمنة، إدارة الحالة، أفضل الممارسات، والنصائح المتقدمة للمطورين المحترفين.",
    },
    {
      id: 4,
      type: "section",
      sectionNumber: 2,
      title: "متطلبات البدء",
      content:
        "تحتاج إلى معرفة أساسية بـ JavaScript وHTML وCSS. خبرة سابقة مع React مفيدة لكن ليست ضرورية.",
    },
    {
      id: 5,
      type: "section",
      sectionNumber: 3,
      title: "إعداد بيئة التطوير",
      content:
        "سنستخدم Vite كأداة بناء لأنه أسرع وأحدث من Create React App. Vite يوفر تحديث فوري وأداء ممتاز مع TypeScript.",
    },
    {
      id: 6,
      type: "code",
      code: {
        language: "bash",
        code: `# إنشاء مشروع جديد
npm create vite@latest my-react-app -- --template react-ts

# الانتقال للمجلد
cd my-react-app

# تثبيت المكتبات
npm install

# تشغيل المشروع
npm run dev`,
      },
    },
    {
      id: 7,
      type: "info",
      info: {
        type: "tip",
        title: "لماذا Vite؟",
        content:
          "Vite أسرع بـ 10-100 مرة من Create React App في التطوير، ويدعم TypeScript بشكل أصلي، ويوفر Hot Module Replacement فوري.",
      },
    },
    {
      id: 8,
      type: "section",
      sectionNumber: 4,
      title: "هيكل المشروع",
      content:
        "بعد إنشاء المشروع، ستجد مجلد src يحتوي على ملفات TypeScript، وملف tsconfig.json لإعدادات TypeScript، وملف vite.config.ts للإعدادات.",
    },
    {
      id: 9,
      type: "code",
      code: {
        language: "text",
        code: `my-react-app/
├── src/
│   ├── components/     # المكونات
│   ├── hooks/         # Custom Hooks  
│   ├── types/         # تعريفات الأنواع
│   ├── utils/         # دوال مساعدة
│   ├── App.tsx        # المكون الرئيسي
│   └── main.tsx       # نقطة البداية
├── tsconfig.json      # إعدادات TypeScript
└── vite.config.ts     # إعدادات Vite`,
      },
    },
    {
      id: 10,
      type: "section",
      sectionNumber: 5,
      title: "إنشاء أول مكون TypeScript",
      content:
        "المكونات في React مع TypeScript تحتاج لتعريف أنواع البيانات للـ props. هذا يساعد في اكتشاف الأخطاء مبكراً ويحسن تجربة التطوير.",
    },
    {
      id: 11,
      type: "code",
      code: {
        language: "TypeScript",
        code: `// تعريف أنواع البيانات للمكون
interface WelcomeProps {
  name: string;
  age?: number;  // اختياري
  isStudent: boolean;
}`,
      },
    },
    {
      id: 12,
      type: "code",
      code: {
        language: "TypeScript",
        code: `// المكون نفسه
const Welcome: React.FC<WelcomeProps> = ({ 
  name, 
  age, 
  isStudent 
}) => {
  return (
    <div className="welcome-card">
      <h2>مرحباً {name}!</h2>
      {age && <p>العمر: {age} سنة</p>}
      <p>
        {isStudent ? '🎓 طالب' : '💼 محترف'}
      </p>
    </div>
  );
};

export default Welcome;`,
      },
    },
    {
      id: 13,
      type: "info",
      info: {
        type: "info",
        title: "فائدة الأنواع الاختيارية",
        content:
          "استخدام علامة الاستفهام (?) يجعل الخاصية اختيارية. هذا يعني أن المكون سيعمل حتى لو لم تمرر هذه القيمة.",
      },
    },
    {
      id: 14,
      type: "section",
      sectionNumber: 6,
      title: "استخدام المكون",
      content:
        "بعد إنشاء المكون، يمكنك استخدامه في أي مكان. TypeScript سيتأكد من أنك تمرر البيانات الصحيحة.",
    },
    {
      id: 15,
      type: "code",
      code: {
        language: "TypeScript",
        code: `function App() {
  return (
    <div>
      <Welcome 
        name="أحمد" 
        age={25} 
        isStudent={true} 
      />
      
      <Welcome 
        name="فاطمة" 
        isStudent={false} 
        // age غير مطلوب لأنه اختياري
      />
    </div>
  );
}`,
      },
    },
    {
      id: 16,
      type: "quote",
      quote: {
        text: "TypeScript يحول أخطاء وقت التشغيل إلى أخطاء وقت الكتابة، مما يوفر ساعات من التصحيح.",
        author: "أندرس هيجلسبرغ، مبتكر TypeScript",
      },
    },
    {
      id: 17,
      type: "section",
      sectionNumber: 7,
      title: "إدارة الحالة مع useState",
      content:
        "useState هو أهم Hook في React. مع TypeScript، نحتاج لتحديد نوع البيانات التي سنخزنها في الحالة.",
    },
    {
      id: 18,
      type: "code",
      code: {
        language: "TypeScript",
        code: `import { useState } from 'react';

// حالة بسيطة للعداد
const [count, setCount] = useState<number>(0);

// حالة للنص
const [message, setMessage] = useState<string>('');

// حالة للبيانات المعقدة
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);`,
      },
    },
    {
      id: 19,
      type: "section",
      sectionNumber: 8,
      title: "مثال عملي: تطبيق المهام",
      content:
        "لنبني تطبيق بسيط لإدارة المهام. سنستخدم TypeScript لضمان أمان البيانات وتحسين تجربة التطوير.",
    },
    {
      id: 20,
      type: "code",
      code: {
        language: "TypeScript",
        code: `// تعريف نوع البيانات للمهمة
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// تعريف أنواع الفلاتر
type FilterType = 'all' | 'active' | 'completed';`,
      },
    },
    {
      id: 21,
      type: "code",
      code: {
        language: "TypeScript",
        code: `const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addTodo = (): void => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos(prev => [...prev, newTodo]);
      setInputValue('');
    }
  };

  return (
    <div className="todo-app">
    </div>
  );
};`,
      },
    },
    {
      id: 22,
      type: "code",
      code: {
        language: "TypeScript",
        code: `  // تبديل حالة المهمة
  const toggleTodo = (id: number): void => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // حذف مهمة
  const deleteTodo = (id: number): void => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // فلترة المهام
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });`,
      },
    },
    {
      id: 23,
      type: "info",
      info: {
        type: "warning",
        title: "تجنب هذا الخطأ الشائع",
        content:
          "لا تستخدم any للأنواع! استخدم أنواع محددة أو union types مثل string | number. هذا يحافظ على أمان الكود.",
      },
    },
    {
      id: 24,
      type: "section",
      sectionNumber: 9,
      title: "التعامل مع الأحداث",
      content:
        "TypeScript يوفر أنواع محددة للأحداث في React. هذا يساعد في الحصول على IntelliSense أفضل وأمان أكثر.",
    },
    {
      id: 25,
      type: "code",
      code: {
        language: "TypeScript",
        code: `// للمدخلات النصية
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  setInputValue(e.target.value);
};

// للأزرار
const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  addTodo();
};

// للنماذج
const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
  addTodo();
};`,
      },
    },
    {
      id: 26,
      type: "section",
      sectionNumber: 10,
      title: "أفضل الممارسات - التنظيم",
      content:
        "نظم كودك في ملفات منفصلة. ضع الأنواع في مجلد types، والمكونات في components، والدوال المساعدة في utils.",
    },
    {
      id: 27,
      type: "code",
      code: {
        language: "TypeScript",
        code: `// src/types/todo.ts
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';

// src/components/TodoItem.tsx
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}`,
      },
    },
    {
      id: 28,
      type: "section",
      sectionNumber: 11,
      title: "أفضل الممارسات - الأداء",
      content:
        "استخدم React.memo للمكونات التي لا تحتاج إعادة رسم كثيراً، وuseCallback و useMemo لتحسين الأداء.",
    },
    {
      id: 29,
      type: "code",
      code: {
        language: "TypeScript",
        code: `import React, { memo, useCallback } from 'react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = memo(({ 
  todo, 
  onToggle, 
  onDelete 
}) => {
  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [todo.id, onDelete]);

  return (
    <div className="todo-item">
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.text}
      </span>
      <button onClick={handleDelete}>حذف</button>
    </div>
  );
});`,
      },
    },
    {
      id: 30,
      type: "info",
      info: {
        type: "tip",
        title: "نصيحة للأداء",
        content:
          "استخدم React.memo فقط للمكونات التي تُرسم كثيراً. القاعدة: قس أولاً، ثم حسّن. التحسين المبكر قد يضر أكثر مما ينفع.",
      },
    },
    {
      id: 31,
      type: "section",
      sectionNumber: 12,
      title: "التعامل مع البيانات من API",
      content:
        "عند جلب البيانات من خادم، عرّف أنواع البيانات المتوقعة مسبقاً. هذا يساعد في اكتشاف أخطاء البيانات مبكراً.",
    },
    {
      id: 32,
      type: "code",
      code: {
        language: "TypeScript",
        code: `// تعريف نوع الاستجابة من API
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

// Custom Hook لجلب المستخدمين
const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        const result: ApiResponse<User[]> = await response.json();
        
        if (result.success) {
          setUsers(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('حدث خطأ في جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};`,
      },
    },
    {
      id: 33,
      type: "section",
      sectionNumber: 13,
      title: "إعدادات TypeScript المهمة",
      content:
        "تأكد من تفعيل strict mode في tsconfig.json. هذا يمنع معظم الأخطاء الشائعة ويحسن جودة الكود بشكل كبير.",
    },
    {
      id: 34,
      type: "code",
      code: {
        language: "JSON",
        code: `// tsconfig.json
{
  "compilerOptions": {
    "strict": true,              // تفعيل الوضع الصارم
    "noUnusedLocals": true,      // تحذير من المتغيرات غير المستخدمة
    "noUnusedParameters": true,  // تحذير من المعاملات غير المستخدمة
    "noImplicitReturns": true,   // تحذير من الإرجاع الضمني
    "noFallthroughCasesInSwitch": true, // تحذير من switch cases
    "exactOptionalPropertyTypes": true  // دقة أكثر للخصائص الاختيارية
  }
}`,
      },
    },
    {
      id: 35,
      type: "info",
      info: {
        type: "success",
        title: "أحسنت!",
        content:
          "لقد تعلمت الأساسيات المهمة لـ React مع TypeScript. الآن أنت جاهز لبناء تطبيقات احترافية وآمنة!",
      },
    },
    {
      id: 36,
      type: "section",
      sectionNumber: 14,
      title: "أدوات مفيدة للتطوير",
      content:
        "هناك أدوات وإضافات تساعدك في التطوير بـ React و TypeScript بشكل أكثر فعالية وإنتاجية.",
    },
    {
      id: 37,
      type: "code",
      code: {
        language: "bash",
        code: `# أدوات مفيدة للتثبيت
npm install -D @types/react @types/react-dom

# لفحص الكود
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# لتنسيق الكود
npm install -D prettier

# لاختبار المكونات
npm install -D @testing-library/react @testing-library/jest-dom vitest`,
      },
    },
    {
      id: 38,
      type: "quote",
      quote: {
        text: "الكود الجيد يُكتب للإنسان ليقرأه، وليس للآلة لتنفذه فقط.",
        author: "مارتن فاولر، مهندس برمجيات",
      },
    },
    {
      id: 39,
      type: "conclusion",
      title: "خلاصة ونصائح أخيرة",
      content:
        "تذكر أن التعلم عملية مستمرة. ابدأ بمشاريع صغيرة، واقرأ الوثائق، وشارك في المجتمع. TypeScript مع React يوفر أساساً قوياً لبناء تطبيقات احترافية.",
    },
  ];

  const CodeBlock = ({ code, language }: CodeBlockProps) => {
    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
      <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <Code className="text-blue-400" size={20} />
            <span className="text-gray-300 font-medium">{language}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all rounded-lg"
          >
            {copiedCode === code ? (
              <>
                <Check size={16} />
                تم النسخ
              </>
            ) : (
              <>
                <Copy size={16} />
                نسخ
              </>
            )}
          </button>
        </div>
        <pre className="p-6 text-gray-100 overflow-x-auto text-sm leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  const Quote = ({ text, author }: QuoteProps) => (
    <div className="text-center py-8">
      <div className="text-6xl text-blue-500 mb-6">"</div>
      <blockquote className="text-2xl italic text-gray-700 dark:text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto">
        {text}
      </blockquote>
      {author && (
        <cite className="text-lg font-medium text-blue-600 dark:text-blue-400">
          — {author}
        </cite>
      )}
    </div>
  );

  const InfoCard = ({ type, title, content }: InfoCardProps) => {
    const configs = {
      info: {
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        icon: <Lightbulb size={32} />,
      },
      tip: {
        bg: "bg-gradient-to-br from-green-500 to-green-600",
        icon: <CheckCircle size={32} />,
      },
      warning: {
        bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
        icon: <AlertTriangle size={32} />,
      },
      success: {
        bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        icon: <CheckCircle size={32} />,
      },
      error: {
        bg: "bg-gradient-to-br from-red-500 to-red-600",
        icon: <XCircle size={32} />,
      },
    };

    const config = configs[type];

    return (
      <div
        className={`${config.bg} text-white rounded-3xl p-8 shadow-2xl text-center`}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
          {config.icon}
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-lg leading-relaxed opacity-90">{content}</p>
      </div>
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") nextSlide();
    if (e.key === "ArrowRight") prevSlide();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const renderSlide = (slide: ArticleSlide) => {
    switch (slide.type) {
      case "hero":
        return (
          <div className="text-center bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 text-white rounded-3xl p-12 shadow-2xl">
            <BookOpen className="mx-auto mb-6 text-blue-200" size={64} />
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl opacity-90 mb-8">{slide.content}</p>

            <div className="flex items-center justify-center gap-6 text-sm opacity-80 mb-8">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>أحمد محمد</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>15 دقيقة قراءة</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium ${
                  isLiked
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                }`}
              >
                <Heart size={16} className={isLiked ? "fill-current" : ""} />
                <span>{likes}</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all font-medium">
                <Share size={16} />
                <span>مشاركة</span>
              </button>
            </div>
          </div>
        );

      case "intro":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full mb-6 text-2xl font-bold">
              ✨
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {slide.title}
            </h2>
            <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {slide.content}
            </p>
          </div>
        );

      case "section":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full mb-6 text-2xl font-bold">
              {slide.sectionNumber}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {slide.title}
            </h2>
            <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {slide.content?.split("\n").map((line, index) => (
                <p key={index} className="mb-3">
                  {line}
                </p>
              ))}
            </div>
          </div>
        );

      case "code":
        return (
          <div className="max-w-4xl mx-auto">
            <CodeBlock
              code={slide.code!.code}
              language={slide.code!.language}
            />
          </div>
        );

      case "quote":
        return <Quote text={slide.quote!.text} author={slide.quote!.author} />;

      case "info":
        return (
          <div className="max-w-2xl mx-auto">
            <InfoCard {...slide.info!} />
          </div>
        );

      case "conclusion":
        return (
          <div className="text-center bg-gradient-to-br from-green-500 via-teal-600 to-blue-600 text-white rounded-3xl p-12 shadow-2xl">
            <CheckCircle className="mx-auto mb-6 text-green-200" size={64} />
            <h2 className="text-3xl font-bold mb-6">{slide.title}</h2>
            <p className="text-xl leading-relaxed opacity-90 mb-8 max-w-3xl mx-auto">
              {slide.content}
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <h4 className="font-bold mb-4">الخطوات التالية:</h4>
              <div className="text-left space-y-2 text-sm">
                <p>• تعلم React Router للتنقل بين الصفحات</p>
                <p>• اكتشف مكتبات إدارة الحالة مثل Zustand</p>
                <p>• تعلم استخدام React Query لإدارة البيانات</p>
                <p>• اكتب اختبارات شاملة لمكوناتك</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{currentSlide + 1}</span>
              <span>/</span>
              <span>{slides.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main
        className="relative h-[calc(100vh-80px)] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full flex items-center justify-center p-6">
          <div className="w-full max-w-5xl mx-auto">
            {renderSlide(slides[currentSlide])}
          </div>
        </div>

        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`absolute left-6 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all ${
            currentSlide === 0
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110"
          }`}
        >
          <ChevronRight size={24} />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`absolute right-6 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all ${
            currentSlide === slides.length - 1
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110"
          }`}
        >
          <ChevronLeft size={24} />
        </button>
      </main>

      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-blue-500 scale-125"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
          />
        ))}
      </div>

      <div className="fixed top-40 right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-xs text-gray-600 dark:text-gray-400 hidden md:block">
        <p>← → للتنقل</p>
        <p>أو اسحب يسار/يمين</p>
      </div>
    </div>
  );
}
