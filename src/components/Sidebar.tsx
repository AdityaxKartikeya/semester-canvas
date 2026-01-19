import { useState, useEffect } from 'react';
import { FileImage, FileText, Trash2, Moon, Sun, ChevronDown, ChevronUp, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ALL_THEORY_SLOTS, ALL_LAB_SLOTS, SlotAssignment } from '@/types/timetable';
import { cn } from '@/lib/utils';

interface SidebarProps {
  courses: Array<{
    id: string;
    name: string;
    code: string;
    professor: string;
    color: string;
    slots: string[];
  }>;
  assignments: Record<string, SlotAssignment>;
  onClearAll: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
}

export function Sidebar({
  courses,
  assignments,
  onClearAll,
  onExportPNG,
  onExportPDF,
}: SidebarProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCourses, setShowCourses] = useState(true);
  const [showSlots, setShowSlots] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);
  const assignedSlots = Object.keys(assignments);
  const unassignedTheory = ALL_THEORY_SLOTS.filter(s => !assignedSlots.includes(s));
  const unassignedLab = ALL_LAB_SLOTS.filter(s => !assignedSlots.includes(s));

  // Collapsed sidebar - just shows expand button
  if (isCollapsed) {
    return (
      <aside className="w-12 border-r bg-card flex flex-col items-center py-4 gap-2 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} title="Expand sidebar">
          <PanelLeft className="h-5 w-5" />
        </Button>
        <Separator className="my-2 w-8" />
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} title={isDark ? "Light mode" : "Dark mode"}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onExportPNG} title="Export PNG">
          <FileImage className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onExportPDF} title="Export PDF">
          <FileText className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" onClick={onClearAll} className="text-destructive" title="Clear all">
          <Trash2 className="h-5 w-5" />
        </Button>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-primary">FFCS Builder</h1>
          <p className="text-xs text-muted-foreground">Freshers Winter 2025-26</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="shrink-0" title={isDark ? "Light mode" : "Dark mode"}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)} className="shrink-0" title="Collapse sidebar">
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        {/* Course Legend - Collapsible */}
        <div className="mb-4">
          <button 
            onClick={() => setShowCourses(!showCourses)}
            className="sidebar-section-title flex items-center justify-between w-full hover:text-primary transition-colors"
          >
            <span>Your Courses ({courses.length})</span>
            {showCourses ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showCourses && (
            <div className="mt-2">
              {courses.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Click any slot to add a course</p>
              ) : (
                <div className="space-y-2">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-2 rounded-lg border bg-card"
                      style={{ borderLeftColor: course.color, borderLeftWidth: '4px' }}
                    >
                      <div className="font-semibold text-sm">{course.code}</div>
                      <div className="text-xs text-muted-foreground truncate">{course.name}</div>
                      {course.professor && (
                        <div className="text-xs text-muted-foreground">{course.professor}</div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {course.slots.map((slot) => (
                          <span
                            key={slot}
                            className="text-[10px] px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: course.color }}
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {/* Available Slots - Collapsible */}
        <div className="mb-4">
          <button 
            onClick={() => setShowSlots(!showSlots)}
            className="sidebar-section-title flex items-center justify-between w-full hover:text-primary transition-colors"
          >
            <span>Available Slots</span>
            {showSlots ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showSlots && (
            <div className="mt-2 space-y-4">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Theory ({unassignedTheory.length})</p>
                <div className="flex flex-wrap gap-1">
                  {unassignedTheory.slice(0, 20).map((slot) => (
                    <span key={slot} className="slot-badge slot-badge-available">
                      {slot}
                    </span>
                  ))}
                  {unassignedTheory.length > 20 && (
                    <span className="text-xs text-muted-foreground">+{unassignedTheory.length - 20} more</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Lab ({unassignedLab.length})</p>
                <div className="flex flex-wrap gap-1">
                  {unassignedLab.slice(0, 12).map((slot) => (
                    <span key={slot} className="slot-badge slot-badge-lab">
                      {slot}
                    </span>
                  ))}
                  {unassignedLab.length > 12 && (
                    <span className="text-xs text-muted-foreground">+{unassignedLab.length - 12} more</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {/* Stats */}
        <div className="mb-6">
          <h3 className="sidebar-section-title">Statistics</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="stat-card">
              <div className="stat-value">{courses.length}</div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{assignedSlots.length}</div>
              <div className="stat-label">Slots Used</div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="sidebar-footer">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={onExportPNG} className="gap-1">
            <FileImage className="w-4 h-4" />
            PNG
          </Button>
          <Button variant="outline" size="sm" onClick={onExportPDF} className="gap-1">
            <FileText className="w-4 h-4" />
            PDF
          </Button>
        </div>
        <Button variant="destructive" size="sm" onClick={onClearAll} className="w-full gap-1">
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </div>
    </aside>
  );
}
