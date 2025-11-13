import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { TestResult, FamilyMember } from '@/types/family.types';

interface EducationResultsTabProps {
  child: FamilyMember;
  testResults: TestResult[];
  onStartTest: () => void;
}

export default function EducationResultsTab({
  child,
  testResults,
  onStartTest
}: EducationResultsTabProps) {
  const getLatestResult = () => testResults[testResults.length - 1];

  const getRadarData = () => {
    const latest = getLatestResult();
    if (!latest) return [];

    return [
      { category: 'Логика', value: latest.scores.logic, fullMark: 100 },
      { category: 'Математика', value: latest.scores.math, fullMark: 100 },
      { category: 'Язык', value: latest.scores.language, fullMark: 100 },
      { category: 'Память', value: latest.scores.memory, fullMark: 100 },
      { category: 'Внимание', value: latest.scores.attention, fullMark: 100 },
      { category: 'Творчество', value: latest.scores.creativity, fullMark: 100 }
    ];
  };

  const getProgressData = () => {
    return testResults.map((result, idx) => ({
      test: `Тест ${idx + 1}`,
      date: new Date(result.date).toLocaleDateString('ru-RU'),
      общий: Math.round((result.totalScore / result.maxScore) * 100),
      логика: result.scores.logic,
      математика: result.scores.math,
      язык: result.scores.language
    }));
  };

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

  if (testResults.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Icon name="BarChart3" className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-lg text-muted-foreground mb-4">
            Результатов пока нет
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Пройдите первый тест, чтобы увидеть статистику развития
          </p>
          <Button onClick={onStartTest} className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Icon name="Play" className="mr-2" size={16} />
            Пройти тест
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" className="text-green-600" size={24} />
            Текущий уровень развития
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={getRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name={child.name}
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {testResults.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="LineChart" className="text-blue-600" size={24} />
              Прогресс по тестам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="общий" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="логика" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="математика" stroke="#10b981" />
                  <Line type="monotone" dataKey="язык" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(getLatestResult().scores).map(([category, score]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                {category === 'logic' && 'Логика'}
                {category === 'math' && 'Математика'}
                {category === 'language' && 'Язык'}
                {category === 'memory' && 'Память'}
                {category === 'attention' && 'Внимание'}
                {category === 'creativity' && 'Творчество'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{score}%</span>
                <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
                  {score >= 80 ? 'Отлично' : score >= 60 ? 'Хорошо' : 'Нужно улучшить'}
                </Badge>
              </div>
              <Progress value={score} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
