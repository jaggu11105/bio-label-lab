import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameLevel } from "@/types/game";
import { Lock, CheckCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelSelectorProps {
  levels: GameLevel[];
  completedLevels: Set<string>;
  currentLevel: number;
  onLevelSelect: (level: number) => void;
}

export const LevelSelector = ({ 
  levels, 
  completedLevels, 
  currentLevel, 
  onLevelSelect 
}: LevelSelectorProps) => {
  const isLevelUnlocked = (levelNum: number) => {
    if (levelNum === 1) return true;
    const previousLevel = levels[levelNum - 2];
    return previousLevel ? completedLevels.has(previousLevel.id) : false;
  };

  const isLevelCompleted = (level: GameLevel) => {
    return completedLevels.has(level.id);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {levels.map((level, index) => {
        const levelNum = index + 1;
        const unlocked = isLevelUnlocked(levelNum);
        const completed = isLevelCompleted(level);
        const active = levelNum === currentLevel;

        return (
          <Card
            key={level.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 relative overflow-hidden",
              unlocked ? "hover:shadow-md" : "opacity-50 cursor-not-allowed",
              active && "ring-2 ring-primary",
              completed && "border-success bg-success/5"
            )}
            onClick={() => unlocked && onLevelSelect(levelNum)}
          >
            <div className="flex items-center justify-between mb-2">
              <Badge 
                className={cn(
                  "text-xs",
                  completed ? "bg-success" : unlocked ? "bg-primary" : "bg-muted"
                )}
              >
                Level {levelNum}
              </Badge>
              
              {completed && <CheckCircle className="h-4 w-4 text-success" />}
              {!unlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              {unlocked && !completed && active && (
                <Play className="h-4 w-4 text-primary" />
              )}
            </div>

            <h4 className="font-medium text-sm mb-1">{level.title}</h4>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {level.description}
            </p>

            <div className="text-xs text-muted-foreground">
              {level.totalLabels} labels
            </div>

            {active && (
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            )}
          </Card>
        );
      })}
    </div>
  );
};