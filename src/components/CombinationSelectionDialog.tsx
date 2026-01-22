import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CombinationSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slotCode: string;
    combinations: string[][];
    onSelect: (combination: string[]) => void;
}

export function CombinationSelectionDialog({
    open,
    onOpenChange,
    slotCode,
    combinations,
    onSelect,
}: CombinationSelectionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Select Slot Combination</DialogTitle>
                    <DialogDescription>
                        The slot <strong>{slotCode}</strong> has multiple possible combinations.
                        Please select which combination you want to use.
                        All slots in the chosen combination will be assigned together.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-4">
                    {combinations.map((combo, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className="h-auto py-4 text-base font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => onSelect(combo)}
                        >
                            <div className="flex flex-wrap gap-2 justify-center">
                                {combo.map((slot, idx) => (
                                    <span key={slot}>
                                        {slot}
                                        {idx < combo.length - 1 && <span className="ml-2">+</span>}
                                    </span>
                                ))}
                            </div>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
