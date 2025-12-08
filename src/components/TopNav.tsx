import { Link } from 'react-router-dom';
import { Plus, Download, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import logoImage from '@/assets/images/taskora.png';

interface TopNavProps {
  onDownloadPDF: () => void;
}

export const TopNav = ({ onDownloadPDF }: TopNavProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-background sticky top-0 z-50">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={logoImage} 
            alt="Taskora Logo" 
            className="w-7 h-7 transition-transform group-hover:scale-105"
          />
          <span className="font-semibold text-base text-foreground tracking-tight">
            Taskora
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground h-8 w-8"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDownloadPDF}
            className="gap-1.5 text-muted-foreground hover:text-foreground hidden sm:flex h-8"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </Button>

          <Link to="/add-task">
            <Button size="sm" className="gap-1.5 h-8">
              <Plus className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">New Task</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
