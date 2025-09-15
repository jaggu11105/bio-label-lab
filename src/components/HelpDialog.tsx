import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Target, Trophy, Smartphone, BookOpen } from "lucide-react";
import { GameTopic } from "@/types/game";

interface HelpDialogProps {
  topic?: GameTopic;
}

export const HelpDialog = ({ topic }: HelpDialogProps) => {
  const topicHints: Record<string, string[]> = {
    digestive: [
      "Start with the mouth where digestion begins",
      "The esophagus connects the mouth to the stomach",
      "The liver and pancreas are accessory organs that aid digestion",
      "The small intestine has three parts: duodenum, jejunum, and ileum"
    ],
    flower: [
      "Petals are the colorful parts that attract pollinators",
      "Sepals protect the flower bud before it opens",
      "The stamen consists of anther (pollen-producing) and filament (stalk)",
      "The carpel includes stigma (receives pollen), style (tube), and ovary (seeds)"
    ],
    plantCell: [
      "The cell wall provides structure and protection (unique to plants)",
      "The nucleus controls cell activities and contains DNA",
      "Chloroplasts contain chlorophyll for photosynthesis",
      "The vacuole stores water and maintains cell pressure"
    ],
    foodWeb: [
      "Producers (plants) make their own food through photosynthesis",
      "Primary consumers (herbivores) eat only plants",
      "Secondary consumers eat primary consumers",
      "Decomposers break down dead organisms and recycle nutrients"
    ],
    photosynthesis: [
      "Sunlight provides the energy for photosynthesis",
      "Carbon dioxide enters through stomata (leaf pores)",
      "Water is absorbed through roots and transported to leaves",
      "Chlorophyll in chloroplasts captures light energy"
    ]
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            How to Play Biology Explorer
          </DialogTitle>
          <DialogDescription>
            Learn biology through interactive drag-and-drop activities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Game Instructions */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Game Instructions
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Badge className="bg-primary/10 text-primary">1</Badge>
                <p>Choose a biology topic from the main menu</p>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-primary/10 text-primary">2</Badge>
                <p>Drag labels from the right panel onto the correct parts of the diagram</p>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-primary/10 text-primary">3</Badge>
                <p>Get immediate feedback - green for correct, red for incorrect placements</p>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-primary/10 text-primary">4</Badge>
                <p>Complete all 4 levels to master each topic</p>
              </div>
            </div>
          </Card>

          {/* Controls */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🖥️ Desktop</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Click and drag labels with mouse</li>
                  <li>• Drop labels on diagram points</li>
                  <li>• Use Reset button to start over</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">📱 Mobile</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Touch and drag labels with finger</li>
                  <li>• Drop on target points</li>
                  <li>• Works on tablets and phones</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Scoring */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Scoring System
            </h3>
            <div className="space-y-2 text-sm">
              <p>• <strong>100 points</strong> - Perfect accuracy on first try</p>
              <p>• <strong>90+ points</strong> - 1-2 incorrect attempts</p>
              <p>• <strong>80+ points</strong> - 3-4 incorrect attempts</p>
              <p>• <strong>Points decrease</strong> with more attempts</p>
              <p className="text-muted-foreground text-xs mt-2">
                Aim for accuracy over speed to maximize your learning and score!
              </p>
            </div>
          </Card>

          {/* Topic-specific hints */}
          {topic && topicHints[topic.id] && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                {topic.icon} {topic.title} - Study Tips
              </h3>
              <div className="space-y-2">
                {topicHints[topic.id].map((hint, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <Badge variant="secondary" className="text-xs">💡</Badge>
                    <p className="text-muted-foreground">{hint}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Educational Benefits */}
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-3">🎓 Educational Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Active Learning</h4>
                <p className="text-muted-foreground text-xs">
                  Hands-on interaction improves memory retention
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Visual Recognition</h4>
                <p className="text-muted-foreground text-xs">
                  Learn to identify biological structures
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Progressive Difficulty</h4>
                <p className="text-muted-foreground text-xs">
                  Build knowledge step by step
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Immediate Feedback</h4>
                <p className="text-muted-foreground text-xs">
                  Learn from mistakes instantly
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};