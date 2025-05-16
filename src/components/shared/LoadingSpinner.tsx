import { Loader2 } from "lucide-react";

// components/ui/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center">
      <Loader2 size={32} className="animate-spin" />
    </div>
  );
}