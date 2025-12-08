import { cn } from '@/utils/utils';

export type FilterType = 'all' | 'active' | 'completed';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: { all: number; active: number; completed: number };
}

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export const FilterBar = ({ activeFilter, onFilterChange, taskCounts }: FilterBarProps) => {
  return (
    <div className="border-b border-border bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-1">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                activeFilter === filter.id
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              {filter.label}
              <span className="ml-1.5 text-xs text-muted-foreground">
                {taskCounts[filter.id]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
