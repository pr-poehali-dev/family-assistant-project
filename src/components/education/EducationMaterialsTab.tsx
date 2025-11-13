import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { LearningMaterial } from '@/types/family.types';

interface EducationMaterialsTabProps {
  materials: LearningMaterial[];
}

export default function EducationMaterialsTab({ materials }: EducationMaterialsTabProps) {
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-500',
      medium: 'bg-yellow-500',
      hard: 'bg-red-500'
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {materials.map((material) => (
        <Card key={material.id} className="hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="text-4xl mb-2">{material.icon}</div>
              <Badge className={getDifficultyColor(material.difficulty)}>
                {material.difficulty === 'easy' && 'Легко'}
                {material.difficulty === 'medium' && 'Средне'}
                {material.difficulty === 'hard' && 'Сложно'}
              </Badge>
            </div>
            <CardTitle className="text-lg">{material.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{material.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                <Icon name="Users" className="mr-1" size={12} />
                {material.ageRange} лет
              </Badge>
              <Badge variant="outline">
                <Icon name="Clock" className="mr-1" size={12} />
                {material.duration}
              </Badge>
              <Badge variant="outline">
                {material.type === 'video' && '🎥 Видео'}
                {material.type === 'article' && '📄 Статья'}
                {material.type === 'exercise' && '✏️ Упражнение'}
                {material.type === 'game' && '🎮 Игра'}
              </Badge>
            </div>
            <Button className="w-full" variant="outline">
              <Icon name="Play" className="mr-2" size={16} />
              Начать
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
