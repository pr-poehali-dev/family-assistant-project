import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface InDevelopmentProps {
  title: string;
  description: string;
  icon: string;
  features: Feature[];
  mockupImage?: string;
}

export default function InDevelopment({ 
  title, 
  description, 
  icon, 
  features,
  mockupImage 
}: InDevelopmentProps) {
  const [hasVoted, setHasVoted] = useState(() => {
    const votes = localStorage.getItem('featureVotes');
    if (!votes) return false;
    const votesData = JSON.parse(votes);
    return votesData[title] === true;
  });

  const [voteCount, setVoteCount] = useState(() => {
    const votes = localStorage.getItem('featureVoteCounts');
    if (!votes) return 42;
    const votesData = JSON.parse(votes);
    return votesData[title] || 42;
  });

  const handleVote = () => {
    if (hasVoted) return;
    
    const newCount = voteCount + 1;
    setVoteCount(newCount);
    setHasVoted(true);

    const votes = JSON.parse(localStorage.getItem('featureVotes') || '{}');
    votes[title] = true;
    localStorage.setItem('featureVotes', JSON.stringify(votes));

    const counts = JSON.parse(localStorage.getItem('featureVoteCounts') || '{}');
    counts[title] = newCount;
    localStorage.setItem('featureVoteCounts', JSON.stringify(counts));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Icon name="Construction" size={14} className="mr-1" />
          В разработке
        </Badge>

        <Card className="shadow-2xl border-2 border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">
            <CardTitle className="flex items-center gap-3 text-3xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <Icon name={icon as any} size={32} />
              </div>
              <div>
                <h1>{title}</h1>
                <p className="text-sm font-normal text-amber-50 mt-1">{description}</p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Sparkles" size={24} className="text-blue-600" />
                <h2 className="text-2xl font-bold text-blue-900">Что будет в этом разделе?</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Мы работаем над созданием этого функционала! Скоро здесь появятся полезные возможности для управления и организации.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="ListChecks" size={24} className="text-purple-600" />
                Планируемые функции
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <Card key={idx} className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{feature.icon}</div>
                        <div>
                          <h4 className="font-bold mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {mockupImage && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="Image" size={24} className="text-green-600" />
                  Предварительный дизайн
                </h3>
                <div className="border-4 border-green-200 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={mockupImage} 
                    alt="Макет раздела" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="ThumbsUp" size={28} className="text-green-600" />
                <h3 className="text-2xl font-bold text-green-900">Поддержите создание раздела!</h3>
              </div>
              
              <p className="text-gray-700 mb-4">
                Ваш голос поможет нам понять насколько этот функционал нужен пользователям и приоритизировать разработку.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Голосов за создание:</span>
                      <span className="font-bold text-green-600">{voteCount} чел.</span>
                    </div>
                    <Progress value={Math.min(voteCount / 2, 100)} className="h-3" />
                  </div>
                </div>

                <Button
                  onClick={handleVote}
                  disabled={hasVoted}
                  className={`w-full ${
                    hasVoted 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  }`}
                  size="lg"
                >
                  {hasVoted ? (
                    <>
                      <Icon name="CheckCircle2" className="mr-2" size={20} />
                      Вы проголосовали
                    </>
                  ) : (
                    <>
                      <Icon name="ThumbsUp" className="mr-2" size={20} />
                      Хочу этот функционал!
                    </>
                  )}
                </Button>

                {hasVoted && (
                  <p className="text-center text-sm text-green-700 animate-fade-in">
                    ✅ Спасибо! Ваше мнение учтено
                  </p>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={24} className="text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Когда будет готово?</h4>
                  <p className="text-amber-800">
                    Мы активно работаем над разработкой. Следите за обновлениями! 
                    Время реализации зависит от количества голосов и технической сложности.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
