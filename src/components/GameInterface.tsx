import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { GameTopic, GameLevel, DiagramPoint, LabelPosition } from "@/types/game";
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
  diagramPoints: DiagramPoint[];
}

export const GameInterface = ({ 
  topic, 
  level, 
  onBack, 
  onLevelComplete, 
  onNextLevel, 
  hasNextLevel,
  diagramImage,
  diagramPoints 
}: GameInterfaceProps) => {
  const [assignedLabels, setAssignedLabels] = useState<LabelPosition[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });
  const [completedPoints, setCompletedPoints] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const diagramRef = useRef<HTMLDivElement>(null);

  const availableLabels = level.labels.filter(
    label => !assignedLabels.some(assigned => assigned.label === label)
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

  const handleDrop = (e: React.DragEvent, point: DiagramPoint) => {
    e.preventDefault();
    const label = e.dataTransfer.getData('text/plain');
    
    if (!label || completedPoints.has(point.id)) return;

    setAttempts(prev => prev + 1);

    if (label === point.correctLabel) {
      // Correct match
      const rect = diagramRef.current?.getBoundingClientRect();
      if (rect) {
        const newAssignment: LabelPosition = {
          id: point.id,
          label,
          x: point.x,
          y: point.y,
          isCorrect: true
        };
        
        setAssignedLabels(prev => [...prev, newAssignment]);
        setCompletedPoints(prev => new Set([...prev, point.id]));
        
        setFeedback({
          show: true,
          type: 'success',
          message: `Correct! ${label} is in the right place.`
        });

        toast.success(`✓ ${label}`, {
          description: "Correctly placed!"
        });

        // Check if level is complete
        if (completedPoints.size + 1 === level.totalLabels) {
          const score = Math.max(0, 100 - Math.floor((attempts / level.totalLabels) * 10));
          setTimeout(() => {
            onLevelComplete(level.id, score);
          }, 1500);
        }
      }
    } else {
      // Incorrect match
      setFeedback({
        show: true,
        type: 'error',
        message: `Incorrect. ${label} doesn't belong here.`
      });

      toast.error(`✗ ${label}`, {
        description: "Try a different location!"
      });
    }

    setDraggedItem(null);
    
    // Clear feedback after 2 seconds
    setTimeout(() => {
      setFeedback({ show: false, type: 'success', message: '' });
    }, 2000);
  };

  const handleReset = () => {
    setAssignedLabels([]);
    setCompletedPoints(new Set());
    setAttempts(0);
    setFeedback({ show: false, type: 'success', message: '' });
    toast.info("Game reset");
  };

  const isCompleted = completedPoints.size === level.totalLabels;
  const progress = (completedPoints.size / level.totalLabels) * 100;

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
              disabled={assignedLabels.length === 0}
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
              {completedPoints.size}/{level.totalLabels} completed
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
                Drag labels to the correct positions
              </h3>
              
              <div 
                ref={diagramRef}
                className="relative bg-white rounded-lg overflow-hidden"
                style={{ aspectRatio: '4/3' }}
              >
                <img 
                  src={diagramImage} 
                  alt={`${topic.title} diagram`}
                  className="w-full h-full object-contain"
                />
                
                {/* Diagram Points */}
                {diagramPoints.map(point => (
                  <div
                    key={point.id}
                    className={cn(
                      "absolute diagram-pointer",
                      completedPoints.has(point.id) && "bg-success border-success-foreground"
                    )}
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, point)}
                  >
                    {completedPoints.has(point.id) && (
                      <CheckCircle className="w-3 h-3 text-success-foreground" />
                    )}
                  </div>
                ))}

                {/* Assigned Labels */}
                {assignedLabels.map(assignment => (
                  <div
                    key={assignment.id}
                    className={cn(
                      "absolute px-2 py-1 rounded text-xs font-medium shadow-md",
                      assignment.isCorrect 
                        ? "bg-success text-success-foreground" 
                        : "bg-destructive text-destructive-foreground"
                    )}
                    style={{
                      left: `${assignment.x}%`,
                      top: `${assignment.y + 8}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {assignment.label}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Labels Panel */}
          <div className="space-y-4">
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
                    {attempts > 0 ? Math.round((completedPoints.size / attempts) * 100) : 0}%
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