import AppOrbitLoader from "./AppOrbitLoader";

interface SiteLoadingProps {
  variant?: "fullscreen" | "content";
}

export default function SiteLoading({ variant = "fullscreen" }: SiteLoadingProps) {
  const wrapperClass =
    variant === "fullscreen"
      ? "flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950"
      : "flex min-h-[60vh] items-center justify-center py-16 sm:py-20";

  return (
    <div className={wrapperClass}>
      <AppOrbitLoader />
    </div>
  );
}
