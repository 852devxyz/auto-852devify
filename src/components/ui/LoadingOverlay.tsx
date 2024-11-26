import { Loader2Icon } from 'lucide-react';

export function LoadingOverlay() {
  return (
    <div className="fixed left-0 top-0 right-0 bottom-0 min-h-screen w-screen z-[9999] flex items-center justify-center bg-black/50" style={{ margin: 0, padding: 0 }}>
      <div className="flex flex-col items-center gap-2 text-white">
        <Loader2Icon className="h-8 w-8 animate-spin" />
        <span>Processing image...</span>
      </div>
    </div>
  );
}
