import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import type { FamilyMember, TestResult, LearningMaterial, AIRecommendationForChild } from '@/types/family.types';

interface EducationRecommendationsTabProps {
  child: FamilyMember;
  testResults: TestResult[];
  learningMaterials: LearningMaterial[];
  onStartTest: () => void;
}

export default function EducationRecommendationsTab({
  child,
  testResults,
  learningMaterials,
  onStartTest
}: EducationRecommendationsTabProps) {
  const getLatestResult = () => testResults[testResults.length - 1];

  const getWeakAreas = () => {
    const latest = getLatestResult();
    if (!latest) return [];

    const areas = Object.entries(latest.scores)
      .map(([key, value]) => ({ category: key, score: value }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 2);

    return areas;
  };

  const getRecommendations = () => {
    const weakAreas = getWeakAreas();
    const recommendations: AIRecommendationForChild[] = [];

    weakAreas.forEach(area => {
      const categoryMap: Record<string, string> = {
        logic: 'Логическое мышление',
        math: 'Математические навыки',
        language: 'Языковые способности',
        memory: 'Память',
        attention: 'Внимание',
        creativity: 'Творчество'
      };

      const rec: AIRecommendationForChild = {
        id: Date.now().toString() + area.category,
        childId: child.id,
        category: categoryMap[area.category] || area.category,
        weakArea: area.category,
        currentLevel: area.score,
        targetLevel: 80,
        recommendations: [
          `Уделите 15-20 минут в день на развитие ${categoryMap[area.category]?.toLowerCase()}`,
          'Используйте игровые методики для повышения интереса',
          'Постепенно увеличивайте сложность заданий',
          'Поощряйте каждый успех ребёнка'
        ],
        suggestedMaterials: learningMaterials
          .filter(m => m.category === area.category)
          .map(m => m.id),
        estimatedTimeToImprove: '2-3 недели',
        createdAt: new Date().toISOString()
      };

      recommendations.push(rec);
    });

    return recommendations;
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
          <Icon name="Lightbulb" className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-lg text-muted-foreground mb-4">
            Рекомендации появятся после первого теста
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            ИИ-помощник проанализирует результаты и даст персональные советы
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
      <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Sparkles" className="text-yellow-600" size={24} />
            ИИ-рекомендации для {child.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            На основе анализа результатов теста, ИИ-помощник выявил области для развития
          </p>
          
          {getWeakAreas().length > 0 && (
            <div className="bg-white/60 border border-yellow-300 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Target" className="text-orange-600" size={20} />
                <span className="font-semibold">Области для улучшения:</span>
              </div>
              <div className="flex gap-2">
                {getWeakAreas().map((area) => (
                  <Badge key={area.category} variant="outline" className="bg-orange-100">
                    {getCategoryIcon(area.category)} {area.category} ({area.score}%)
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {getRecommendations().map((rec) => (
        <Card key={rec.id} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg mb-2">{rec.category}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    Текущий: {rec.currentLevel}%
                  </Badge>
                  <Badge className="bg-green-600">
                    Цель: {rec.targetLevel}%
                  </Badge>
                </div>
              </div>
              <Icon name="TrendingUp" className="text-blue-600" size={32} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Progress value={rec.currentLevel} className="mb-2" />
              <p className="text-xs text-muted-foreground text-right">
                До цели: {rec.targetLevel - rec.currentLevel}%
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Lightbulb" className="text-blue-600" size={18} />
                <span className="font-semibold text-sm">Рекомендации:</span>
              </div>
              <ul className="space-y-2">
                {rec.recommendations.map((recommendation, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Icon name="CheckCircle2" className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="BookOpen" className="text-purple-600" size={18} />
                <span className="font-semibold text-sm">Рекомендуемые материалы:</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {learningMaterials
                  .filter(m => rec.suggestedMaterials.includes(m.id))
                  .map(material => (
                    <button
                      key={material.id}
                      className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-all text-left"
                    >
                      <span className="text-2xl">{material.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{material.title}</p>
                        <p className="text-xs text-muted-foreground">{material.duration}</p>
                      </div>
                      <Icon name="ChevronRight" className="text-purple-600" size={18} />
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Icon name="Clock" className="text-green-600" size={18} />
                <span className="text-sm font-medium">Время до улучшения:</span>
              </div>
              <Badge className="bg-green-600">{rec.estimatedTimeToImprove}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
