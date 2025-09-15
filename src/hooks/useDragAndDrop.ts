import { useState, useRef, useCallback } from 'react';

export interface DragState {
  isDragging: boolean;
  draggedItem: string | null;
  dragOffset: { x: number; y: number };
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragOffset: { x: 0, y: 0 }
  });

  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((item: string, e: React.DragEvent) => {
    setDragState({
      isDragging: true,
      draggedItem: item,
      dragOffset: { x: 0, y: 0 }
    });
    
    // Set up drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item);
    
    // Create custom drag image for better visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.transform = 'rotate(2deg) scale(1.05)';
      dragImage.style.opacity = '0.8';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 50, 25);
      
      // Clean up after drag starts
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOffset: { x: 0, y: 0 }
    });
  }, []);

  const handleTouchStart = useCallback((item: string, e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragState({
      isDragging: true,
      draggedItem: item,
      dragOffset: {
        x: touch.clientX,
        y: touch.clientY
      }
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (dragState.isDragging) {
      const touch = e.touches[0];
      setDragState(prev => ({
        ...prev,
        dragOffset: {
          x: touch.clientX,
          y: touch.clientY
        }
      }));
    }
  }, [dragState.isDragging]);

  const handleTouchEnd = useCallback((onDrop?: (item: string, x: number, y: number) => void) => {
    if (dragState.isDragging && dragState.draggedItem && onDrop) {
      onDrop(dragState.draggedItem, dragState.dragOffset.x, dragState.dragOffset.y);
    }
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOffset: { x: 0, y: 0 }
    });
  }, [dragState]);

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    dragRef
  };
};