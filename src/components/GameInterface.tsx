import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { GameTopic, GameLevel, NumberedPosition, LabelPosition } from "@/types/game";
import { HelpDialog } from "@/components/HelpDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GameInterfaceProps {
  topic: GameTopic;
  level: GameLevel;
  onBack: () => void;
  onLevelComplete: (levelId: string, score: number) => void;
  onNextLevel: () => void;
  hasNextLevel: boolean;
  diagramImage: string;
  numberedPositions: NumberedPosition[];
}

export const GameInterface = ({ 
  topic, 
  level, 
  onBack, 
  onLevelComplete, 
  onNextLevel, 
  hasNextLevel,
  diagramImage,
  numberedPositions 
}: GameInterfaceProps) => {
  const [numberedAssignments, setNumberedAssignments] = useState<Record<number, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });
  const [completedNumbers, setCompletedNumbers] = useState<Set<number>>(new Set());
  const [attempts, setAttempts] = useState(0);

  const availableLabels = level.labels.filter(
    label => !Object.values(numberedAssignments).includes(label)
  );

  const handleDragStart = (e: React.DragEvent, label: string) => {
    setDraggedItem(label);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', label);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, position: NumberedPosition) => {
    e.preventDefault();
    const label = e.dataTransfer.getData('text/plain');
    
    if (!label || numberedAssignments[position.number]) return;

    setAttempts(prev => prev + 1);

    if (label === position.correctLabel) {
      // Correct match
      setNumberedAssignments(prev => ({
        ...prev,
        [position.number]: label
      }));
      setCompletedNumbers(prev => new Set([...prev, position.number]));
      
      setFeedback({
        show: true,
        type: 'success',
        message: `Correct! ${label} matches position ${position.number}.`
      });

      toast.success(`✓ Position ${position.number}`, {
        description: `${label} correctly placed!`
      });

      // Check if level is complete
      if (completedNumbers.size + 1 === level.totalLabels) {
        const score = Math.max(0, 100 - Math.floor((attempts / level.totalLabels) * 10));
        setTimeout(() => {
          onLevelComplete(level.id, score);
        }, 1500);
      }
    } else {
      // Incorrect match
      setFeedback({
        show: true,
        type: 'error',
        message: `Incorrect. ${label} doesn't belong in position ${position.number}.`
      });

      toast.error(`✗ Position ${position.number}`, {
        description: "Try a different label!"
      });
    }

    setDraggedItem(null);
    
    // Clear feedback after 2 seconds
    setTimeout(() => {
      setFeedback({ show: false, type: 'success', message: '' });
    }, 2000);
  };

  const handleReset = () => {
    setNumberedAssignments({});
    setCompletedNumbers(new Set());
    setAttempts(0);
    setFeedback({ show: false, type: 'success', message: '' });
    toast.info("Game reset");
  };

  const isCompleted = completedNumbers.size === level.totalLabels;
  const progress = (completedNumbers.size / level.totalLabels) * 100;

  return (
    <div className="min-h-screen bg-game-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{topic.icon}</span>
                <h1 className="text-2xl font-bold text-foreground">{topic.title}</h1>
              </div>
              <p className="text-muted-foreground">{level.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="level-badge">
              Level {level.level}/4
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              disabled={Object.keys(numberedAssignments).length === 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <HelpDialog topic={topic} />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {completedNumbers.size}/{level.totalLabels} completed
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Diagram */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-game-diagram">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Study the numbered diagram
              </h3>
              
              <div className="relative bg-white rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img 
                  src={diagramImage} 
                  alt={`${topic.title} diagram with numbered positions`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <p className="text-sm text-muted-foreground mt-2 text-center">
                The diagram shows numbered positions from 1 to {level.totalLabels}. 
                Drag the correct labels to match each number in the answer area.
              </p>
            </Card>
          </div>

          {/* Answer Area */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Answer Area</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag labels to their corresponding numbered positions:
              </p>
              
              <div className="space-y-2">
                {numberedPositions.map(position => (
                  <div
                    key={position.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border-2 border-dashed rounded-lg transition-all",
                      numberedAssignments[position.number] 
                        ? "border-success bg-success/10" 
                        : "border-muted-foreground/30 hover:border-primary/50"
                    )}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, position)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {position.number}
                    </div>
                    <div className="flex-1 min-h-[2rem] flex items-center">
                      {numberedAssignments[position.number] ? (
                        <span className="font-medium text-success">
                          {numberedAssignments[position.number]}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Drop label here
                        </span>
                      )}
                    </div>
                    {numberedAssignments[position.number] && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Available Labels
                <Badge variant="secondary">{availableLabels.length}</Badge>
              </h3>
              
              <div className="space-y-2">
                {availableLabels.map(label => (
                  <div
                    key={label}
                    draggable
                    onDragStart={(e) => handleDragStart(e, label)}
                    className={cn(
                      "drag-label",
                      draggedItem === label && "opacity-50"
                    )}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {availableLabels.length === 0 && !isCompleted && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  All labels are placed. Check your answers!
                </p>
              )}
            </Card>

            {/* Feedback */}
            {feedback.show && (
              <Card className={cn(
                "p-4 border-2",
                feedback.type === 'success' 
                  ? "feedback-success border-success" 
                  : "feedback-error border-destructive"
              )}>
                <div className="flex items-center gap-2">
                  {feedback.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <p className="font-medium">{feedback.message}</p>
                </div>
              </Card>
            )}

            {/* Level Complete */}
            {isCompleted && (
              <Card className="p-4 bg-success/10 border-success">
                <div className="text-center space-y-4">
                  <div className="text-success text-4xl">🎉</div>
                  <h3 className="text-lg font-bold text-success">Level Complete!</h3>
                  <p className="text-sm text-muted-foreground">
                    Attempts: {attempts} | Score: {Math.max(0, 100 - Math.floor((attempts / level.totalLabels) * 10))}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onBack}
                      className="flex-1"
                    >
                      Topics
                    </Button>
                    {hasNextLevel && (
                      <Button 
                        size="sm" 
                        onClick={onNextLevel}
                        className="flex-1 btn-gradient"
                      >
                        Next Level
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Stats */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Game Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attempts:</span>
                  <span className="font-medium">{attempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-medium">
                    {attempts > 0 ? Math.round((completedNumbers.size / attempts) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-medium">{availableLabels.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};