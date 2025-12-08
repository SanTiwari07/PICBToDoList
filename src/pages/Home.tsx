import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { jsPDF } from 'jspdf';
import { Task, Priority } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import { TopNav } from '@/components/TopNav';
import { FilterBar, FilterType } from '@/components/FilterBar';
import { PriorityColumn } from '@/components/PriorityColumn';
import { TaskCard } from '@/components/TaskCard';
import { EditTaskDialog } from '@/components/EditTaskDialog';
import { useToast } from '@/hooks/use-toast';

const columns: { id: Priority; title: string }[] = [
  { id: 'high', title: 'High Priority' },
  { id: 'medium', title: 'Medium Priority' },
  { id: 'low', title: 'Low Priority' },
];

const Home = () => {
  const { tasks, isLoaded, toggleComplete, updateTask, deleteTask, moveTask } = useTasks();
  const { toast } = useToast();
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Filter tasks
  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case 'active':
        return tasks.filter(t => !t.completed);
      case 'completed':
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  }, [tasks, activeFilter]);

  // Group by priority
  const tasksByPriority = useMemo(() => {
    return columns.reduce((acc, col) => {
      acc[col.id] = filteredTasks.filter(t => t.priority === col.id);
      return acc;
    }, {} as Record<Priority, Task[]>);
  }, [filteredTasks]);

  // Counts
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    if (columns.some(c => c.id === overId)) {
      moveTask(taskId, overId as Priority);
      toast({
        title: 'Task moved',
        description: `Task moved to ${columns.find(c => c.id === overId)?.title}`,
      });
    }
  };

  const handleDelete = useCallback((id: string) => {
    deleteTask(id);
    toast({
      title: 'Task deleted',
      description: 'The task has been removed',
    });
  }, [deleteTask, toast]);

  const handleDownloadPDF = useCallback(() => {
    const doc = new jsPDF();
    
    // Only include incomplete tasks
    const incompleteTasks = tasks.filter(t => !t.completed);
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(37, 37, 37);
    doc.text('Taskora', 20, 25);
    
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 120);
    doc.text(`Task Report • ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 20, 34);
    
    // Divider line
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 42, 190, 42);
    
    let yPos = 55;
    
    const priorityColors: Record<Priority, [number, number, number]> = {
      high: [255, 76, 76],
      medium: [255, 204, 61],
      low: [76, 175, 80],
    };

    columns.forEach(column => {
      const columnTasks = incompleteTasks.filter(t => t.priority === column.id);
      
      // Column header with colored dot
      const color = priorityColors[column.id];
      doc.setFillColor(color[0], color[1], color[2]);
      doc.circle(24, yPos - 1.5, 3, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(37, 37, 37);
      doc.text(`${column.title}`, 32, yPos);
      
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`${columnTasks.length} task${columnTasks.length !== 1 ? 's' : ''}`, 32, yPos + 6);
      
      yPos += 16;
      
      if (columnTasks.length === 0) {
        doc.setFontSize(10);
        doc.setTextColor(180, 180, 180);
        doc.text('No remaining tasks', 32, yPos);
        yPos += 12;
      } else {
        columnTasks.forEach(task => {
          // Task container
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          doc.text(`• ${task.title}`, 32, yPos);
          yPos += 6;
          
          if (task.description) {
            doc.setFontSize(9);
            doc.setTextColor(130, 130, 130);
            const lines = doc.splitTextToSize(task.description, 150);
            doc.text(lines.slice(0, 2), 36, yPos);
            yPos += lines.slice(0, 2).length * 4 + 2;
          }
          
          if (task.dueDate) {
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Due: ${new Date(task.dueDate).toLocaleDateString()}`, 36, yPos);
            yPos += 5;
          }
          
          yPos += 4;
          
          if (yPos > 270) {
            doc.addPage();
            yPos = 25;
          }
        });
      }
      
      yPos += 8;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text('Generated by Taskora', 20, 285);
    
    doc.save('taskora-tasks.pdf');
    toast({
      title: 'PDF Downloaded',
      description: 'Your remaining tasks have been exported',
    });
  }, [tasks, toast]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav onDownloadPDF={handleDownloadPDF} />
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        taskCounts={taskCounts}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {columns.map(column => (
              <PriorityColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={tasksByPriority[column.id]}
                onToggleComplete={toggleComplete}
                onEdit={setEditingTask}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="task-card task-card-dragging">
                <TaskCard
                  task={activeTask}
                  onToggleComplete={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
      />
    </div>
  );
};

export default Home;
