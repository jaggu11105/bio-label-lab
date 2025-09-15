import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopicCard } from "@/components/TopicCard";
import { GameInterface } from "@/components/GameInterface";
import { HelpDialog } from "@/components/HelpDialog";
import { GAME_TOPICS, GAME_LEVELS, GameTopic, GameLevel, NumberedPosition } from "@/types/game";
import { Microscope, BookOpen, Award, RotateCcw } from "lucide-react";

// Import biological diagrams
import digestiveSystemImage from "@/assets/digestive-system.jpg";
import flowerAnatomyImage from "@/assets/flower-anatomy.jpg";
import plantCellImage from "@/assets/plant-cell.jpg";
import foodWebImage from "@/assets/food-web.jpg";
import photosynthesisImage from "@/assets/photosynthesis.jpg";

const Index = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());
  const [topicProgress, setTopicProgress] = useState<Record<string, number>>({});

  // Generate numbered positions for each topic/level combination
  const getNumberedPositions = (topicId: string, level: number): NumberedPosition[] => {
    const gameLevel = GAME_LEVELS[topicId]?.[level - 1];
    if (!gameLevel) return [];

    return gameLevel.labels.map((label, index) => ({
      id: `position-${index + 1}`,
      number: index + 1,
      correctLabel: label
    }));
  };

  // Get diagram image for each topic
  const getDiagramImage = (topicId: string): string => {
    const images: Record<string, string> = {
      digestive: digestiveSystemImage,
      flower: flowerAnatomyImage,
      plantCell: plantCellImage,
      foodWeb: foodWebImage,
      photosynthesis: photosynthesisImage
    };
    return images[topicId] || digestiveSystemImage;
  };

  useEffect(() => {
    // Calculate progress for each topic
    const progress: Record<string, number> = {};
    Object.keys(GAME_TOPICS).forEach(topicId => {
      const topicLevels = GAME_LEVELS[topicId] || [];
      const completed = topicLevels.filter(level => 
        completedLevels.has(level.id)
      ).length;
      progress[topicId] = completed;
    });
    setTopicProgress(progress);
  }, [completedLevels]);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentLevel(1);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setCurrentLevel(1);
  };

  const handleLevelComplete = (levelId: string, score: number) => {
    setCompletedLevels(prev => new Set([...prev, levelId]));
    
    // Auto-advance to next level if available
    const topic = selectedTopic!;
    const levels = GAME_LEVELS[topic];
    if (currentLevel < levels.length) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, 2000);
    }
  };

  const handleNextLevel = () => {
    if (selectedTopic) {
      const levels = GAME_LEVELS[selectedTopic];
      if (currentLevel < levels.length) {
        setCurrentLevel(prev => prev + 1);
      }
    }
  };

  const handleResetProgress = () => {
    setCompletedLevels(new Set());
    setTopicProgress({});
  };

  const totalCompleted = Array.from(completedLevels).length;
  const totalLevels = Object.values(GAME_LEVELS).flat().length;

  if (selectedTopic) {
    const topic = GAME_TOPICS[selectedTopic];
    const levels = GAME_LEVELS[selectedTopic];
    const level = levels[currentLevel - 1];
    const hasNextLevel = currentLevel < levels.length;
    const diagramImage = getDiagramImage(selectedTopic);
    const numberedPositions = getNumberedPositions(selectedTopic, currentLevel);

    return (
      <GameInterface
        topic={topic}
        level={level}
        onBack={handleBackToTopics}
        onLevelComplete={handleLevelComplete}
        onNextLevel={handleNextLevel}
        hasNextLevel={hasNextLevel}
        diagramImage={diagramImage}
        numberedPositions={numberedPositions}
      />
    );
  }

  return (
    <div className="min-h-screen bg-game-bg">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Biology Explorer</h1>
                <p className="text-muted-foreground">Interactive system identification game</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalCompleted}</div>
                <div className="text-xs text-muted-foreground">Levels Completed</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetProgress}
                disabled={totalCompleted === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
              <HelpDialog />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{Object.keys(GAME_TOPICS).length}</div>
            <div className="text-sm text-muted-foreground">Topics Available</div>
          </Card>
          
          <Card className="p-4 text-center">
            <Award className="h-6 w-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalCompleted}</div>
            <div className="text-sm text-muted-foreground">Levels Completed</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{totalLevels}</div>
            <div className="text-sm text-muted-foreground">Total Levels</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {totalLevels > 0 ? Math.round((totalCompleted / totalLevels) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Progress</div>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Learning Journey</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${totalLevels > 0 ? (totalCompleted / totalLevels) * 100 : 0}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {totalCompleted} of {totalLevels} levels completed across all biology topics
          </p>
        </Card>

        {/* Topics Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Choose a Biology Topic</h2>
            <div className="flex gap-2">
              {Object.values(GAME_TOPICS).map(topic => (
                <Badge key={topic.category} variant="secondary" className="capitalize">
                  {topic.category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(GAME_TOPICS).map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                completedLevels={topicProgress[topic.id] || 0}
                totalLevels={GAME_LEVELS[topic.id]?.length || 4}
                onClick={() => handleTopicSelect(topic.id)}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <Card className="p-6 mt-8 bg-muted/50">
          <h3 className="text-lg font-semibold mb-3">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-foreground">🎯 Objective</h4>
              <p className="text-muted-foreground">
                Study numbered biological diagrams and drag labels to match each position. 
                Each topic has 4 levels with increasing difficulty.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-foreground">🏆 Scoring</h4>
              <p className="text-muted-foreground">
                Earn points based on accuracy. Fewer attempts mean higher scores. 
                Complete all levels to master each topic!
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-foreground">📱 Controls</h4>
              <p className="text-muted-foreground">
                Works on desktop and mobile. Drag labels with mouse or touch. 
                Get immediate feedback on your answers.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-foreground">🧬 Learning</h4>
              <p className="text-muted-foreground">
                Covers human anatomy, plant biology, cell structure, ecology, 
                and biochemical processes for comprehensive learning.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Index;
