import { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Code,
  BookOpen,
  Save,
  Target,
  Lightbulb,
  Image,
  Video,
  GripVertical,
  TestTube,
  Type,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  FolderPlus,
  Folder,
} from "lucide-react";
import { creaetNewCodeLesson } from "@/utils/_apis/admin-api";

interface BasicInfo {
  main_title: string;
  duration: number;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface TextData {
  title?: string;
  content?: string;
}

interface CodeData {
  title?: string;
  language?: string;
  code?: string;
}

interface ImageData {
  title?: string;
  url?: string;
}

interface VideoData {
  title?: string;
  url?: string;
}

interface ExerciseData {
  title?: string;
  difficulty?: "easy" | "medium" | "hard";
  description?: string;
  initialCode?: string;
}

interface HintData {
  hint?: string;
}

type ComponentData =
  | TextData
  | CodeData
  | ImageData
  | VideoData
  | ExerciseData
  | HintData;

interface Component {
  id: number;
  type: ComponentType;
  data: ComponentData;
}

interface Container {
  id: number;
  title: string;
  components: Component[];
}

interface CodeMaterialCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateTable: () => void;
}

interface ComponentProps<T = ComponentData> {
  data: T;
  onChange: (index: number, newData: T) => void;
  onRemove: () => void;
  index: number;
}

interface TestCaseComponentProps {
  data: TestCase;
  onChange: (index: number, updatedData: TestCase) => void;
  onRemove: () => void;
  index: number;
}

const COMPONENT_TYPES = {
  TEXT: "text",
  CODE: "code",
  IMAGE: "image",
  VIDEO: "video",
  EXERCISE: "exercise",
  HINT: "hint",
} as const;

type ComponentType = (typeof COMPONENT_TYPES)[keyof typeof COMPONENT_TYPES];

export default function CodeMaterialCreate({
  open,
  onOpenChange,
  updateTable,
}: CodeMaterialCreateProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    main_title: "",
    duration: 0,
  });

  const [containers, setContainers] = useState<Container[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      input: "",
      expectedOutput: "",
      description: "",
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);

  const componentMap = {
    [COMPONENT_TYPES.TEXT]: TextComponent,
    [COMPONENT_TYPES.CODE]: CodeComponent,
    [COMPONENT_TYPES.IMAGE]: ImageComponent,
    [COMPONENT_TYPES.VIDEO]: VideoComponent,
    [COMPONENT_TYPES.EXERCISE]: ExerciseComponent,
    [COMPONENT_TYPES.HINT]: HintComponent,
  };

  const addContainer = (): void => {
    const newContainer: Container = {
      id: Date.now(),
      title: "",
      components: [],
    };
    setContainers((prev) => [...prev, newContainer]);
  };

  const updateContainerTitle = (
    containerIndex: number,
    title: string
  ): void => {
    setContainers((prev) =>
      prev.map((container, i) =>
        i === containerIndex ? { ...container, title } : container
      )
    );
  };

  const removeContainer = (containerIndex: number): void => {
    setContainers((prev) => prev.filter((_, i) => i !== containerIndex));
  };

  const moveContainer = (fromIndex: number, toIndex: number): void => {
    setContainers((prev) => {
      const newContainers = [...prev];
      const [movedContainer] = newContainers.splice(fromIndex, 1);
      newContainers.splice(toIndex, 0, movedContainer);
      return newContainers;
    });
  };

  const addComponentToContainer = (
    containerIndex: number,
    type: ComponentType
  ): void => {
    const newComponent: Component = {
      id: Date.now(),
      type,
      data: {},
    };
    setContainers((prev) =>
      prev.map((container, i) =>
        i === containerIndex
          ? {
              ...container,
              components: [...container.components, newComponent],
            }
          : container
      )
    );
  };

  const updateComponent = (
    containerIndex: number,
    componentIndex: number,
    newData: ComponentData
  ): void => {
    setContainers((prev) =>
      prev.map((container, i) =>
        i === containerIndex
          ? {
              ...container,
              components: container.components.map((comp, j) =>
                j === componentIndex ? { ...comp, data: newData } : comp
              ),
            }
          : container
      )
    );
  };

  const removeComponent = (
    containerIndex: number,
    componentIndex: number
  ): void => {
    setContainers((prev) =>
      prev.map((container, i) =>
        i === containerIndex
          ? {
              ...container,
              components: container.components.filter(
                (_, j) => j !== componentIndex
              ),
            }
          : container
      )
    );
  };

  const moveComponent = (
    containerIndex: number,
    fromIndex: number,
    toIndex: number
  ): void => {
    setContainers((prev) =>
      prev.map((container, i) =>
        i === containerIndex
          ? {
              ...container,
              components: (() => {
                const newComponents = [...container.components];
                const [movedComponent] = newComponents.splice(fromIndex, 1);
                newComponents.splice(toIndex, 0, movedComponent);
                return newComponents;
              })(),
            }
          : container
      )
    );
  };

  const addTestCase = (): void => {
    setTestCases((prev) => [
      ...prev,
      { input: "", expectedOutput: "", description: "" },
    ]);
  };

  const removeTestCase = (index: number): void => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTestCase = (index: number, updatedData: TestCase): void => {
    setTestCases((prev) =>
      prev.map((testCase, i) => (i === index ? updatedData : testCase))
    );
  };

  const validateStep1 = (): boolean => {
    if (!basicInfo.main_title.trim() || basicInfo.duration <= 0) {
      alert("Please fill in the main title and duration");
      return false;
    }

    if (containers.length === 0) {
      alert("Please add at least one container");
      return false;
    }

    const hasComponentsInContainers = containers.some(
      (container) => container.components.length > 0
    );

    if (!hasComponentsInContainers) {
      alert("Please add at least one component to your containers");
      return false;
    }

    return true;
  };

  const nextStep = (): void => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const previousStep = (): void => {
    setCurrentStep(1);
  };

  const handleSubmit = async (): Promise<void> => {
    const hasValidTestCases = testCases.some(
      (testCase) => testCase.input.trim() && testCase.expectedOutput.trim()
    );

    if (!hasValidTestCases) {
      alert("Please add at least one complete test case");
      return;
    }

    setLoading(true);

    try {
      const transformedData = {
        main_title: basicInfo.main_title,
        duration: basicInfo.duration,
        data: {
          containers: containers,
        },
        testCases: testCases,
      };

      const res = await creaetNewCodeLesson(transformedData);
      if (res) {
        alert("Lesson created successfully!");

        setBasicInfo({ main_title: "", duration: 0 });
        setContainers([]);
        setTestCases([{ input: "", expectedOutput: "", description: "" }]);
        setCurrentStep(1);
        onOpenChange(false);
        updateTable();
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      alert("Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  const totalComponents = containers.reduce(
    (total, container) => total + container.components.length,
    0
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Create Code Material
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span
                className={`px-3 py-1.5 rounded-full ${
                  currentStep === 1
                    ? "bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white font-medium"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                Step 1: Content Structure
              </span>
              <ChevronRight size={16} />
              <span
                className={`px-3 py-1.5 rounded-full ${
                  currentStep === 2
                    ? "bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white font-medium"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                Step 2: Test Cases & Validation
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <BookOpen className="mr-2" size={20} />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Main Title *
                    </label>
                    <input
                      type="text"
                      value={basicInfo.main_title}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          main_title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Python Variables and Data Types"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      value={basicInfo.duration}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="30"
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Add Container Button */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Content Structure
                  </h3>
                  <button
                    onClick={addContainer}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                  >
                    <FolderPlus size={16} className="mr-2" />
                    Add Container
                  </button>
                </div>

                {containers.length === 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                    <Folder size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No containers yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Create containers to organize your lesson content into
                      sections
                    </p>
                  </div>
                )}
              </div>

              {/* Containers List */}
              <div className="space-y-4">
                {containers.map((container, containerIndex) => (
                  <div
                    key={container.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
                  >
                    {/* Container Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-semibold">
                            {containerIndex + 1}
                          </div>
                          <div className="flex space-x-1">
                            {containerIndex > 0 && (
                              <button
                                onClick={() =>
                                  moveContainer(
                                    containerIndex,
                                    containerIndex - 1
                                  )
                                }
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Move up"
                              >
                                <ChevronUp size={16} />
                              </button>
                            )}
                            {containerIndex < containers.length - 1 && (
                              <button
                                onClick={() =>
                                  moveContainer(
                                    containerIndex,
                                    containerIndex + 1
                                  )
                                }
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Move down"
                              >
                                <ChevronDown size={16} />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={container.title}
                            onChange={(e) =>
                              updateContainerTitle(
                                containerIndex,
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder={`Container ${
                              containerIndex + 1
                            } Title`}
                          />
                        </div>
                        <button
                          onClick={() => removeContainer(containerIndex)}
                          className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Add Component Buttons */}
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Add Components to Container {containerIndex + 1}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                          <button
                            onClick={() =>
                              addComponentToContainer(
                                containerIndex,
                                COMPONENT_TYPES.TEXT
                              )
                            }
                            className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all group"
                          >
                            <Type
                              size={20}
                              className="text-blue-600 group-hover:text-blue-700 mb-1"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Text
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              addComponentToContainer(
                                containerIndex,
                                COMPONENT_TYPES.CODE
                              )
                            }
                            className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-500 transition-all group"
                          >
                            <Code
                              size={20}
                              className="text-green-600 group-hover:text-green-700 mb-1"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Code
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              addComponentToContainer(
                                containerIndex,
                                COMPONENT_TYPES.IMAGE
                              )
                            }
                            className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-500 transition-all group"
                          >
                            <Image
                              size={20}
                              className="text-purple-600 group-hover:text-purple-700 mb-1"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Image
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              addComponentToContainer(
                                containerIndex,
                                COMPONENT_TYPES.VIDEO
                              )
                            }
                            className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-500 transition-all group"
                          >
                            <Video
                              size={20}
                              className="text-red-600 group-hover:text-red-700 mb-1"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Video
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              addComponentToContainer(
                                containerIndex,
                                COMPONENT_TYPES.EXERCISE
                              )
                            }
                            className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-500 transition-all group"
                          >
                            <Target
                              size={20}
                              className="text-orange-600 group-hover:text-orange-700 mb-1"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Exercise
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              addComponentToContainer(
                                containerIndex,
                                COMPONENT_TYPES.HINT
                              )
                            }
                            className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300 dark:hover:border-yellow-500 transition-all group"
                          >
                            <Lightbulb
                              size={20}
                              className="text-yellow-600 group-hover:text-yellow-700 mb-1"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Hint
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Components in Container */}
                      {container.components.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Components ({container.components.length})
                          </h4>
                          {container.components.map(
                            (component, componentIndex) => {
                              const ComponentRenderer =
                                componentMap[component.type];
                              return (
                                <div key={component.id} className="group">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                                      {componentIndex + 1}
                                    </div>
                                    <div className="flex space-x-1">
                                      {componentIndex > 0 && (
                                        <button
                                          onClick={() =>
                                            moveComponent(
                                              containerIndex,
                                              componentIndex,
                                              componentIndex - 1
                                            )
                                          }
                                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                          title="Move up"
                                        >
                                          <ChevronUp size={14} />
                                        </button>
                                      )}
                                      {componentIndex <
                                        container.components.length - 1 && (
                                        <button
                                          onClick={() =>
                                            moveComponent(
                                              containerIndex,
                                              componentIndex,
                                              componentIndex + 1
                                            )
                                          }
                                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                          title="Move down"
                                        >
                                          <ChevronDown size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <ComponentRenderer
                                    data={component.data}
                                    onChange={(_, newData) =>
                                      updateComponent(
                                        containerIndex,
                                        componentIndex,
                                        newData
                                      )
                                    }
                                    onRemove={() =>
                                      removeComponent(
                                        containerIndex,
                                        componentIndex
                                      )
                                    }
                                    index={componentIndex}
                                  />
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}

                      {container.components.length === 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No components in this container yet. Add components
                            using the buttons above.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <TestTube className="mr-2" size={20} />
                    Test Cases & Validation
                  </h3>
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Test Case
                  </button>
                </div>

                <div className="space-y-4">
                  {testCases.map((testCase, index) => (
                    <TestCaseComponent
                      key={index}
                      data={testCase}
                      onChange={updateTestCase}
                      onRemove={() => removeTestCase(index)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={previousStep}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center font-medium"
                >
                  <ChevronLeft size={16} className="mr-2" />
                  Previous
                </button>
              )}

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {containers.length} container
                {containers.length !== 1 ? "s" : ""} •{totalComponents}{" "}
                component{totalComponents !== 1 ? "s" : ""} •{testCases.length}{" "}
                test case{testCases.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>

              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium shadow-sm"
                >
                  Next: Test Cases
                  <ChevronRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Create Lesson
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextComponent({
  data,
  onChange,
  onRemove,
  index,
}: ComponentProps<TextData>) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <GripVertical size={16} className="text-gray-400 mr-2 cursor-move" />
          <Type size={16} className="text-blue-600 mr-2" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Text Content
          </h4>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) =>
              onChange(index, { ...data, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Section title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            value={data.content || ""}
            onChange={(e) =>
              onChange(index, { ...data, content: e.target.value })
            }
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Write your content here..."
          />
        </div>
      </div>
    </div>
  );
}

function CodeComponent({
  data,
  onChange,
  onRemove,
  index,
}: ComponentProps<CodeData>) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <GripVertical size={16} className="text-gray-400 mr-2 cursor-move" />
          <Code size={16} className="text-green-600 mr-2" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Code Snippet
          </h4>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) =>
                onChange(index, { ...data, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Code example title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language
            </label>
            <select
              value={data.language || "javascript"}
              onChange={(e) =>
                onChange(index, { ...data, language: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="sql">SQL</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Code
          </label>
          <textarea
            value={data.code || ""}
            onChange={(e) => onChange(index, { ...data, code: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm bg-gray-900 text-gray-100 placeholder-gray-500"
            placeholder="// Your code here..."
          />
        </div>
      </div>
    </div>
  );
}

function ImageComponent({
  data,
  onChange,
  onRemove,
  index,
}: ComponentProps<ImageData>) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <GripVertical size={16} className="text-gray-400 mr-2 cursor-move" />
          <Image size={16} className="text-purple-600 mr-2" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Image
          </h4>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title/Caption
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) =>
              onChange(index, { ...data, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Image caption"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={data.url || ""}
            onChange={(e) => onChange(index, { ...data, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        {data.url && (
          <div className="mt-2">
            <img
              src={data.url}
              alt={data.title}
              className="w-full rounded border max-h-48 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function VideoComponent({
  data,
  onChange,
  onRemove,
  index,
}: ComponentProps<VideoData>) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <GripVertical size={16} className="text-gray-400 mr-2 cursor-move" />
          <Video size={16} className="text-red-600 mr-2" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Video
          </h4>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) =>
              onChange(index, { ...data, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Video title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video URL (YouTube, Vimeo, etc.)
          </label>
          <input
            type="url"
            value={data.url || ""}
            onChange={(e) => onChange(index, { ...data, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>
    </div>
  );
}

function ExerciseComponent({
  data,
  onChange,
  onRemove,
  index,
}: ComponentProps<ExerciseData>) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <GripVertical size={16} className="text-gray-400 mr-2 cursor-move" />
          <Target size={16} className="text-orange-600 mr-2" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Exercise
          </h4>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exercise Title
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) =>
                onChange(index, { ...data, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Exercise title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              value={data.difficulty || "easy"}
              onChange={(e) =>
                onChange(index, {
                  ...data,
                  difficulty: e.target.value as "easy" | "medium" | "hard",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={data.description || ""}
            onChange={(e) =>
              onChange(index, { ...data, description: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Describe what students need to do..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Initial Code Template
          </label>
          <textarea
            value={data.initialCode || ""}
            onChange={(e) =>
              onChange(index, { ...data, initialCode: e.target.value })
            }
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm bg-gray-900 text-gray-100 placeholder-gray-500"
            placeholder="# Initial code template for students..."
          />
        </div>
      </div>
    </div>
  );
}

function HintComponent({
  data,
  onChange,
  onRemove,
  index,
}: ComponentProps<HintData>) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <GripVertical size={16} className="text-gray-400 mr-2 cursor-move" />
          <Lightbulb size={16} className="text-yellow-600 mr-2" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Hint</h4>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hint Text
          </label>
          <textarea
            value={data.hint || ""}
            onChange={(e) => onChange(index, { ...data, hint: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Provide a helpful hint for students..."
          />
        </div>
      </div>
    </div>
  );
}

function TestCaseComponent({
  data,
  onChange,
  onRemove,
  index,
}: TestCaseComponentProps) {
  const handleFieldChange = (field: keyof TestCase, value: string): void => {
    const updatedData = { ...data, [field]: value };
    onChange(index, updatedData);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
            {index + 1}
          </div>
          Test Case
        </h4>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input *
            </label>
            <textarea
              value={data.input || ""}
              onChange={(e) => handleFieldChange("input", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-50 dark:bg-gray-700 transition-all resize-none text-gray-900 dark:text-gray-100"
              placeholder="Alice&#10;25&#10;New York"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Output *
            </label>
            <textarea
              value={data.expectedOutput || ""}
              onChange={(e) =>
                handleFieldChange("expectedOutput", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-50 dark:bg-gray-700 transition-all resize-none text-gray-900 dark:text-gray-100"
              placeholder="Name: Alice&#10;Age: 25&#10;City: New York"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            value={data.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Test case for basic variable assignment and printing"
          />
        </div>
      </div>
    </div>
  );
}
