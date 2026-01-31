import { Spinner } from "../spinner";

export function AuthLoadingSkeleton() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
      </div>
    </div>
  );
}
