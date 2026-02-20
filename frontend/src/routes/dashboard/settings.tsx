import { createFileRoute } from '@tanstack/react-router';
import { Settings as SettingsIcon } from 'lucide-react';

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
          <SettingsIcon className="w-6 h-6 text-slate-500" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-slate-400 text-sm max-w-sm">
          Settings for profile, notifications, and preferences are currently under development.
        </p>
      </div>
    </div>
  );
}
