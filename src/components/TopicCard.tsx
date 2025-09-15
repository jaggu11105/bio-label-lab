import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GameTopic } from "@/types/game";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  topic: GameTopic;
  completedLevels: number;
  totalLevels: number;
  onClick: () => void;
}

export const TopicCard = ({ topic, completedLevels, totalLevels, onClick }: TopicCardProps) => {
  const progressPercentage = (completedLevels / totalLevels) * 100;
  const isCompleted = completedLevels === totalLevels;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anatomy': return 'bg-red-500';
      case 'botany': return 'bg-green-500';
      case 'cellular': return 'bg-blue-500';
      case 'ecology': return 'bg-yellow-500';
      case 'biochemistry': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className={cn(
        "game-card cursor-pointer group relative overflow-hidden",
        isCompleted && "border-success"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{topic.icon}</div>
        <Badge 
          className={cn(
            "text-xs font-medium capitalize",
            getCategoryColor(topic.category)
          )}
        >
          {topic.category}
        </Badge>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {topic.title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {topic.description}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">
            {completedLevels}/{totalLevels} levels
          </span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {isCompleted && (
          <div className="flex items-center justify-center mt-3 text-success text-sm font-medium">
            ✓ Completed
          </div>
        )}
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  );
};