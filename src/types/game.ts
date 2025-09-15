export interface GameTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'anatomy' | 'botany' | 'cellular' | 'ecology' | 'biochemistry';
}

export interface GameLevel {
  id: string;
  level: number;
  title: string;
  labels: string[];
  totalLabels: number;
  description: string;
}

export interface LabelPosition {
  id: string;
  label: string;
  x: number;
  y: number;
  isCorrect?: boolean;
}

export interface GameState {
  currentTopic: string | null;
  currentLevel: number;
  score: number;
  completedLevels: Set<string>;
  labelPositions: LabelPosition[];
  draggedLabels: Set<string>;
  feedback: {
    show: boolean;
    type: 'success' | 'error';
    message: string;
  };
}

export interface DiagramPoint {
  id: string;
  x: number;
  y: number;
  correctLabel: string;
  isAssigned?: boolean;
  assignedLabel?: string;
}

export const GAME_TOPICS: Record<string, GameTopic> = {
  digestive: {
    id: 'digestive',
    title: 'Human Digestive System',
    description: 'Learn the anatomy of the human digestive system',
    icon: '🫁',
    category: 'anatomy'
  },
  flower: {
    id: 'flower',
    title: 'Plant Flower Anatomy',
    description: 'Identify parts of a flowering plant',
    icon: '🌸',
    category: 'botany'
  },
  plantCell: {
    id: 'plantCell',
    title: 'Plant Cell Structure',
    description: 'Explore organelles in plant cells',
    icon: '🔬',
    category: 'cellular'
  },
  foodWeb: {
    id: 'foodWeb',
    title: 'Ecological Food Web',
    description: 'Understand ecosystem relationships',
    icon: '🌿',
    category: 'ecology'
  },
  photosynthesis: {
    id: 'photosynthesis',
    title: 'Photosynthesis Pathway',
    description: 'Follow the process of photosynthesis',
    icon: '☀️',
    category: 'biochemistry'
  }
};

export const GAME_LEVELS: Record<string, GameLevel[]> = {
  digestive: [
    {
      id: 'digestive-1',
      level: 1,
      title: 'Basic Organs',
      labels: ['Mouth', 'Stomach', 'Intestine'],
      totalLabels: 3,
      description: 'Identify the three main digestive organs'
    },
    {
      id: 'digestive-2',
      level: 2,
      title: 'Extended System',
      labels: ['Mouth', 'Esophagus', 'Stomach', 'Small Intestine', 'Large Intestine'],
      totalLabels: 5,
      description: 'Add the esophagus and separate intestinal sections'
    },
    {
      id: 'digestive-3',
      level: 3,
      title: 'Detailed Structure',
      labels: ['Mouth', 'Esophagus', 'Stomach', 'Duodenum', 'Small Intestine', 'Large Intestine', 'Rectum'],
      totalLabels: 7,
      description: 'Include specific intestinal regions'
    },
    {
      id: 'digestive-4',
      level: 4,
      title: 'Complete System',
      labels: ['Mouth', 'Esophagus', 'Stomach', 'Liver', 'Pancreas', 'Gallbladder', 'Duodenum', 'Jejunum', 'Ileum', 'Large Intestine', 'Rectum', 'Anus'],
      totalLabels: 12,
      description: 'Master the complete digestive system anatomy'
    }
  ],
  flower: [
    {
      id: 'flower-1',
      level: 1,
      title: 'Basic Parts',
      labels: ['Petal', 'Stamen', 'Carpel'],
      totalLabels: 3,
      description: 'Identify the main reproductive structures'
    },
    {
      id: 'flower-2',
      level: 2,
      title: 'Protective Parts',
      labels: ['Petal', 'Sepal', 'Stamen', 'Carpel'],
      totalLabels: 4,
      description: 'Add the protective sepals'
    },
    {
      id: 'flower-3',
      level: 3,
      title: 'Detailed Structure',
      labels: ['Petal', 'Sepal', 'Anther', 'Filament', 'Stigma', 'Style', 'Ovary'],
      totalLabels: 7,
      description: 'Break down reproductive organs into components'
    },
    {
      id: 'flower-4',
      level: 4,
      title: 'Complete Anatomy',
      labels: ['Petal', 'Sepal', 'Anther', 'Filament', 'Stigma', 'Style', 'Ovary', 'Receptacle', 'Pedicel'],
      totalLabels: 9,
      description: 'Master all flower parts including support structures'
    }
  ],
  plantCell: [
    {
      id: 'plantCell-1',
      level: 1,
      title: 'Basic Structure',
      labels: ['Nucleus', 'Vacuole', 'Cell Wall'],
      totalLabels: 3,
      description: 'Identify fundamental plant cell features'
    },
    {
      id: 'plantCell-2',
      level: 2,
      title: 'Cell Boundaries',
      labels: ['Nucleus', 'Vacuole', 'Cell Wall', 'Cytoplasm', 'Cell Membrane'],
      totalLabels: 5,
      description: 'Add cellular boundaries and interior'
    },
    {
      id: 'plantCell-3',
      level: 3,
      title: 'Energy Organelles',
      labels: ['Nucleus', 'Vacuole', 'Cell Wall', 'Cytoplasm', 'Cell Membrane', 'Chloroplast', 'Mitochondria'],
      totalLabels: 7,
      description: 'Include energy-producing organelles'
    },
    {
      id: 'plantCell-4',
      level: 4,
      title: 'Complete Organelles',
      labels: ['Nucleus', 'Vacuole', 'Cell Wall', 'Cytoplasm', 'Cell Membrane', 'Chloroplast', 'Mitochondria', 'Ribosome', 'Golgi Apparatus', 'ER', 'Plasmodesmata'],
      totalLabels: 11,
      description: 'Master all major plant cell organelles'
    }
  ],
  foodWeb: [
    {
      id: 'foodWeb-1',
      level: 1,
      title: 'Basic Roles',
      labels: ['Producer', 'Consumer'],
      totalLabels: 2,
      description: 'Understand basic energy flow roles'
    },
    {
      id: 'foodWeb-2',
      level: 2,
      title: 'Consumer Types',
      labels: ['Producer', 'Primary Consumer', 'Secondary Consumer'],
      totalLabels: 3,
      description: 'Distinguish between consumer levels'
    },
    {
      id: 'foodWeb-3',
      level: 3,
      title: 'Extended Chain',
      labels: ['Producer', 'Primary Consumer', 'Secondary Consumer', 'Tertiary Consumer'],
      totalLabels: 4,
      description: 'Add apex predators to the chain'
    },
    {
      id: 'foodWeb-4',
      level: 4,
      title: 'Complete Web',
      labels: ['Producer', 'Primary Consumer', 'Secondary Consumer', 'Tertiary Consumer', 'Decomposer', 'Omnivore'],
      totalLabels: 6,
      description: 'Master complex ecological relationships'
    }
  ],
  photosynthesis: [
    {
      id: 'photosynthesis-1',
      level: 1,
      title: 'Basic Components',
      labels: ['Sun', 'CO₂', 'Glucose'],
      totalLabels: 3,
      description: 'Identify energy source, input, and output'
    },
    {
      id: 'photosynthesis-2',
      level: 2,
      title: 'Water Addition',
      labels: ['Sun', 'CO₂', 'H₂O', 'Glucose'],
      totalLabels: 4,
      description: 'Add water as an essential input'
    },
    {
      id: 'photosynthesis-3',
      level: 3,
      title: 'Oxygen Production',
      labels: ['Sun', 'CO₂', 'H₂O', 'Glucose', 'O₂'],
      totalLabels: 5,
      description: 'Include oxygen as a byproduct'
    },
    {
      id: 'photosynthesis-4',
      level: 4,
      title: 'Complete Process',
      labels: ['Sun', 'CO₂', 'H₂O', 'Glucose', 'O₂', 'Chlorophyll', 'Stomata', 'Leaf Cell'],
      totalLabels: 8,
      description: 'Master all components and structures involved'
    }
  ]
};