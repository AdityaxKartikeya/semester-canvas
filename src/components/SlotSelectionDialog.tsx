import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SlotSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slotCode: string;
    onSelect: (selectedSlot: string) => void;
}

export function SlotSelectionDialog({
    open,
    onOpenChange,
    slotCode,
    onSelect,
}: SlotSelectionDialogProps) {
    // Split the slot code by '/' to get options (e.g., "G1/TE1" -> ["G1", "TE1"])
    const options = slotCode.split('/');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Select Slot Preference</DialogTitle>
                    <DialogDescription>
                        This slot has multiple options. Please select which one you want to use.
                        This choice will be remembered for all future assignments.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {options.map((option) => (
                        <Button
                            key={option}
                            variant="outline"
                            className="h-20 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => onSelect(option)}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
