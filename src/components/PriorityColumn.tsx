import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Priority } from '@/types/task';
import { TaskCard } from './TaskCard';
import { cn } from '@/utils/utils';

interface PriorityColumnProps {
  id: Priority;
  title: string;
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const columnConfig: Record<Priority, { accentColor: string; dotClass: string }> = {
  high: { 
    accentColor: 'border-l-priority-high', 
    dotClass: 'bg-priority-high',
  },
  medium: { 
    accentColor: 'border-l-priority-medium', 
    dotClass: 'bg-priority-medium',
  },
  low: { 
    accentColor: 'border-l-priority-low', 
    dotClass: 'bg-priority-low',
  },
};

export const PriorityColumn = ({
  id,
  title,
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}: PriorityColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = columnConfig[id];

  const taskIds = tasks.map(task => task.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'priority-column border-l-4 transition-all duration-200',
        config.accentColor,
        isOver && 'ring-2 ring-primary/20 bg-primary/5'
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={cn('w-2.5 h-2.5 rounded-full', config.dotClass)} />
            <h2 className="font-medium text-sm text-foreground">{title}</h2>
          </div>
          <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="p-3 flex-1 overflow-y-auto scrollbar-thin">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">No tasks</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Drop tasks here</p>
              </div>
            ) : (
              tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
