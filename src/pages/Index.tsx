import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopicCard } from "@/components/TopicCard";
import { GameInterface } from "@/components/GameInterface";
import { HelpDialog } from "@/components/HelpDialog";
import { GAME_TOPICS, GAME_LEVELS, GameTopic, GameLevel, DiagramPoint } from "@/types/game";
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

  // Generate diagram points for each topic/level combination
  const getDiagramPoints = (topicId: string, level: number): DiagramPoint[] => {
    const gameLevel = GAME_LEVELS[topicId]?.[level - 1];
    if (!gameLevel) return [];

    // Predefined positions optimized for each biological diagram
    const positions: Record<string, Record<number, {x: number, y: number}[]>> = {
      digestive: {
        1: [
          { x: 20, y: 15 }, // Mouth
          { x: 40, y: 45 }, // Stomach  
          { x: 55, y: 70 }  // Intestine
        ],
        2: [
          { x: 20, y: 15 }, // Mouth
          { x: 30, y: 30 }, // Esophagus
          { x: 40, y: 45 }, // Stomach
          { x: 55, y: 60 }, // Small Intestine
          { x: 65, y: 75 }  // Large Intestine
        ],
        3: [
          { x: 20, y: 15 }, // Mouth
          { x: 30, y: 30 }, // Esophagus
          { x: 40, y: 45 }, // Stomach
          { x: 50, y: 55 }, // Duodenum
          { x: 55, y: 65 }, // Small Intestine
          { x: 70, y: 75 }, // Large Intestine
          { x: 75, y: 85 }  // Rectum
        ],
        4: [
          { x: 20, y: 15 }, // Mouth
          { x: 30, y: 30 }, // Esophagus
          { x: 40, y: 45 }, // Stomach
          { x: 15, y: 35 }, // Liver
          { x: 25, y: 50 }, // Pancreas
          { x: 35, y: 35 }, // Gallbladder
          { x: 50, y: 55 }, // Duodenum
          { x: 52, y: 65 }, // Jejunum
          { x: 58, y: 68 }, // Ileum
          { x: 70, y: 75 }, // Large Intestine
          { x: 75, y: 85 }, // Rectum
          { x: 78, y: 90 }  // Anus
        ]
      },
      flower: {
        1: [
          { x: 45, y: 25 }, // Petal
          { x: 50, y: 45 }, // Stamen
          { x: 50, y: 55 }  // Carpel
        ],
        2: [
          { x: 45, y: 25 }, // Petal
          { x: 45, y: 35 }, // Sepal
          { x: 50, y: 45 }, // Stamen
          { x: 50, y: 55 }  // Carpel
        ],
        3: [
          { x: 45, y: 25 }, // Petal
          { x: 45, y: 35 }, // Sepal
          { x: 48, y: 42 }, // Anther
          { x: 48, y: 48 }, // Filament
          { x: 52, y: 42 }, // Stigma
          { x: 52, y: 48 }, // Style
          { x: 50, y: 60 }  // Ovary
        ],
        4: [
          { x: 45, y: 25 }, // Petal
          { x: 45, y: 35 }, // Sepal
          { x: 48, y: 42 }, // Anther
          { x: 48, y: 48 }, // Filament
          { x: 52, y: 42 }, // Stigma
          { x: 52, y: 48 }, // Style
          { x: 50, y: 60 }, // Ovary
          { x: 50, y: 70 }, // Receptacle
          { x: 50, y: 80 }  // Pedicel
        ]
      },
      plantCell: {
        1: [
          { x: 50, y: 30 }, // Nucleus
          { x: 70, y: 60 }, // Vacuole
          { x: 20, y: 20 }  // Cell Wall
        ],
        2: [
          { x: 50, y: 30 }, // Nucleus
          { x: 70, y: 60 }, // Vacuole
          { x: 20, y: 20 }, // Cell Wall
          { x: 50, y: 50 }, // Cytoplasm
          { x: 25, y: 25 }  // Cell Membrane
        ],
        3: [
          { x: 50, y: 30 }, // Nucleus
          { x: 70, y: 60 }, // Vacuole
          { x: 20, y: 20 }, // Cell Wall
          { x: 50, y: 50 }, // Cytoplasm
          { x: 25, y: 25 }, // Cell Membrane
          { x: 30, y: 40 }, // Chloroplast
          { x: 75, y: 35 }  // Mitochondria
        ],
        4: [
          { x: 50, y: 30 }, // Nucleus
          { x: 70, y: 60 }, // Vacuole
          { x: 20, y: 20 }, // Cell Wall
          { x: 50, y: 50 }, // Cytoplasm
          { x: 25, y: 25 }, // Cell Membrane
          { x: 30, y: 40 }, // Chloroplast
          { x: 75, y: 35 }, // Mitochondria
          { x: 60, y: 40 }, // Ribosome
          { x: 40, y: 60 }, // Golgi Apparatus
          { x: 35, y: 25 }, // ER
          { x: 15, y: 50 }  // Plasmodesmata
        ]
      },
      foodWeb: {
        1: [
          { x: 25, y: 70 }, // Producer
          { x: 75, y: 30 }  // Consumer
        ],
        2: [
          { x: 25, y: 70 }, // Producer
          { x: 50, y: 50 }, // Primary Consumer
          { x: 75, y: 30 }  // Secondary Consumer
        ],
        3: [
          { x: 25, y: 70 }, // Producer
          { x: 45, y: 55 }, // Primary Consumer
          { x: 65, y: 40 }, // Secondary Consumer
          { x: 80, y: 20 }  // Tertiary Consumer
        ],
        4: [
          { x: 25, y: 75 }, // Producer
          { x: 40, y: 60 }, // Primary Consumer
          { x: 60, y: 45 }, // Secondary Consumer
          { x: 80, y: 25 }, // Tertiary Consumer
          { x: 30, y: 85 }, // Decomposer
          { x: 70, y: 60 }  // Omnivore
        ]
      },
      photosynthesis: {
        1: [
          { x: 20, y: 15 }, // Sun
          { x: 30, y: 30 }, // CO₂
          { x: 70, y: 60 }  // Glucose
        ],
        2: [
          { x: 20, y: 15 }, // Sun
          { x: 30, y: 30 }, // CO₂
          { x: 40, y: 70 }, // H₂O
          { x: 70, y: 60 }  // Glucose
        ],
        3: [
          { x: 20, y: 15 }, // Sun
          { x: 30, y: 30 }, // CO₂
          { x: 40, y: 70 }, // H₂O
          { x: 70, y: 60 }, // Glucose
          { x: 80, y: 40 }  // O₂
        ],
        4: [
          { x: 20, y: 15 }, // Sun
          { x: 30, y: 30 }, // CO₂
          { x: 40, y: 70 }, // H₂O
          { x: 70, y: 60 }, // Glucose
          { x: 80, y: 40 }, // O₂
          { x: 50, y: 45 }, // Chlorophyll
          { x: 35, y: 50 }, // Stomata
          { x: 55, y: 35 }  // Leaf Cell
        ]
      }
    };

    const topicPositions = positions[topicId]?.[level];
    if (!topicPositions) {
      // Fallback to circular distribution
      return gameLevel.labels.map((label, index) => {
        const angle = (index / gameLevel.labels.length) * 2 * Math.PI;
        const radiusX = 30;
        const radiusY = 25;
        const centerX = 50;
        const centerY = 50;
        
        return {
          id: `point-${index}`,
          x: Math.max(15, Math.min(85, centerX + radiusX * Math.cos(angle))),
          y: Math.max(15, Math.min(85, centerY + radiusY * Math.sin(angle))),
          correctLabel: label
        };
      });
    }

    return gameLevel.labels.map((label, index) => ({
      id: `point-${index}`,
      x: topicPositions[index].x,
      y: topicPositions[index].y,
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
    const diagramPoints = getDiagramPoints(selectedTopic, currentLevel);

    return (
      <GameInterface
        topic={topic}
        level={level}
        onBack={handleBackToTopics}
        onLevelComplete={handleLevelComplete}
        onNextLevel={handleNextLevel}
        hasNextLevel={hasNextLevel}
        diagramImage={diagramImage}
        diagramPoints={diagramPoints}
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
                Drag and drop labels onto the correct parts of biological diagrams. 
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
