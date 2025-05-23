import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Users, Code, CalendarDays, Building } from "lucide-react";

interface ProjectInfoModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProjectInfoModal({ isOpen, onOpenChange }: ProjectInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground border-border shadow-xl rounded-lg">
        <DialogHeader className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-md">
              <Info className="w-6 h-6 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-primary">
              Informasi Proyek
            </DialogTitle>
          </div>
          <DialogDescription asChild className="text-sm text-muted-foreground space-y-3">
            <div>
              <div className="flex items-start gap-2">
                <CalendarDays className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  Proyek ini dibuat untuk Tugas Kelompok Mata Kuliah CSCE604135 •
                  Temu-Balik Informasi Semester Genap 2024/2025.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Building className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Fakultas Ilmu Komputer, Universitas Indonesia.</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-md">
              <Users className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h3 className="text-lg font-medium text-secondary-foreground">
              Dikembangkan oleh: <span className="font-bold text-primary">penyuram-tbi</span>
            </h3>
          </div>
          <ul className="space-y-2 pl-8 list-disc list-inside text-sm text-foreground">
            <li>Akmal Ramadhan - 2206081534</li>
            <li>Muh. Kemal Lathif Galih Putra - 2206081225</li>
            <li>Tsabit Coda Rafisukmawan - 2206081414</li>
          </ul>
        </div>

        <DialogFooter className="p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-primary text-primary hover:bg-primary/10"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
