import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-10 text-white">
      <h1 className="text-4xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
        Settings
      </h1>

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-xl">
        <p>More settings coming soon...</p>
      </div>
    </div>
  );
}
