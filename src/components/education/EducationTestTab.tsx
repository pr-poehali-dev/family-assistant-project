import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import type { TestQuestion } from '@/types/family.types';

interface EducationTestTabProps {
  activeTest: boolean;
  showResults: boolean;
  currentQuestion: number;
  selectedAnswer: number | null;
  testQuestions: TestQuestion[];
  testResults: any[];
  onStartTest: () => void;
  onAnswerSelect: (index: number) => void;
  onNextQuestion: () => void;
  onCancelTest: () => void;
}

export default function EducationTestTab({
  activeTest,
  showResults,
  currentQuestion,
  selectedAnswer,
  testQuestions,
  testResults,
  onStartTest,
  onAnswerSelect,
  onNextQuestion,
  onCancelTest
}: EducationTestTabProps) {
  const currentQuestionData = testQuestions[currentQuestion];

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      logic: '🧩',
      math: '🔢',
      language: '📚',
      memory: '🧠',
      attention: '🎯',
      creativity: '🎨'
    };
    return icons[category] || '📖';
  };

  if (!activeTest && !showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Доступные тесты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">🧠 IQ Тест</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Комплексный тест для оценки развития ребёнка
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    <Icon name="Clock" className="mr-1" size={12} />
                    ~10 мин
                  </Badge>
                  <Badge variant="outline">
                    <Icon name="Layers" className="mr-1" size={12} />
                    {testQuestions.length} вопросов
                  </Badge>
                </div>
              </div>
              <Button onClick={onStartTest} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Icon name="Play" className="mr-2" size={18} />
                Начать тест
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">🧩</div>
                <div className="text-xs font-medium">Логика</div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">🔢</div>
                <div className="text-xs font-medium">Математика</div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">📚</div>
                <div className="text-xs font-medium">Язык</div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">🧠</div>
                <div className="text-xs font-medium">Память</div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-xs font-medium">Внимание</div>
              </div>
              <div className="bg-white/60 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">🎨</div>
                <div className="text-xs font-medium">Творчество</div>
              </div>
            </div>
          </div>

          {testResults.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CheckCircle2" className="text-green-600" size={20} />
                <span className="font-semibold text-green-900">
                  Пройдено тестов: {testResults.length}
                </span>
              </div>
              <p className="text-sm text-green-700">
                Последний тест: {new Date(testResults[testResults.length - 1].date).toLocaleDateString('ru-RU')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (activeTest) {
    return (
      <Card className="border-2 border-purple-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Вопрос {currentQuestion + 1} из {testQuestions.length}
            </CardTitle>
            <Badge className="bg-purple-600">
              {getCategoryIcon(currentQuestionData.category)} {currentQuestionData.category}
            </Badge>
          </div>
          <Progress value={((currentQuestion + 1) / testQuestions.length) * 100} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-lg font-medium mb-4">{currentQuestionData.question}</p>
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-purple-500 bg-purple-100'
                      : 'border-gray-300 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
                    }`}>
                      {selectedAnswer === index && (
                        <Icon name="Check" className="text-white" size={16} />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancelTest}>
              <Icon name="X" className="mr-2" size={16} />
              Отменить
            </Button>
            <Button
              onClick={onNextQuestion}
              disabled={selectedAnswer === null}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {currentQuestion < testQuestions.length - 1 ? 'Следующий' : 'Завершить'}
              <Icon name="ArrowRight" className="ml-2" size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
