import SiteHeader from "./SiteHeader";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-blue-900 dark:selection:text-blue-100 print:bg-white print:text-black">
      <SiteHeader />
      {children}
    </div>
  );
}
