import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Section } from './sectionsData';

interface SectionDetailViewProps {
  section: Section;
  onBack: () => void;
}

export default function SectionDetailView({ section, onBack }: SectionDetailViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={onBack}
        >
          <Icon name="ArrowLeft" className="mr-2" size={16} />
          Назад к разделам
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Icon name={section.icon as any} size={32} />
              {section.title}
            </CardTitle>
            <p className="text-blue-100 mt-2">{section.description}</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Icon name="Target" size={20} className="text-blue-600" />
                Для чего нужен этот раздел?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {section.content.purpose}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Icon name="Star" size={20} className="text-yellow-600" />
                Полезные возможности
              </h3>
              <ul className="space-y-2">
                {section.content.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Icon name="ListOrdered" size={20} className="text-purple-600" />
                Как использовать?
              </h3>
              <div className="space-y-2 bg-purple-50 p-4 rounded-lg">
                {section.content.howTo.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Badge className="bg-purple-600 text-white flex-shrink-0">
                      {idx + 1}
                    </Badge>
                    <span>{step.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Icon name="Lightbulb" size={20} className="text-orange-600" />
                Примеры использования
              </h3>
              <div className="space-y-2">
                {section.content.examples.map((example, idx) => (
                  <div key={idx} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <p className="font-medium">{example}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                onClick={onBack}
              >
                Вернуться к списку разделов
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
