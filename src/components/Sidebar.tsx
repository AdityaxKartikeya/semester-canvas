import { Download, FileImage, FileText, Trash2, RotateCcw, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ALL_THEORY_SLOTS, ALL_LAB_SLOTS, SlotAssignment } from '@/types/timetable';

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
  onExportJSON: () => void;
  onImportJSON: () => void;
}

export function Sidebar({
  courses,
  assignments,
  onClearAll,
  onExportPNG,
  onExportPDF,
  onExportJSON,
  onImportJSON,
}: SidebarProps) {
  const assignedSlots = Object.keys(assignments);
  const unassignedTheory = ALL_THEORY_SLOTS.filter(s => !assignedSlots.includes(s));
  const unassignedLab = ALL_LAB_SLOTS.filter(s => !assignedSlots.includes(s));

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="text-lg font-bold text-primary">FFCS Builder</h1>
        <p className="text-xs text-muted-foreground">Freshers Winter 2025-26</p>
      </div>

      <ScrollArea className="flex-1 px-4">
        {/* Course Legend */}
        <div className="mb-6">
          <h3 className="sidebar-section-title">Your Courses</h3>
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

        <Separator className="my-4" />

        {/* Available Slots */}
        <div className="mb-6">
          <h3 className="sidebar-section-title">Available Theory Slots</h3>
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

        <div className="mb-6">
          <h3 className="sidebar-section-title">Available Lab Slots</h3>
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
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={onExportJSON} className="gap-1">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={onImportJSON} className="gap-1">
            <Upload className="w-4 h-4" />
            Load
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
