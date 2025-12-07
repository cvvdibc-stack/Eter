import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const admin = await isAdmin(session.user.id);
  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/admin" className="text-xl font-bold text-white">
              Admin Panel
            </a>
            <div className="flex gap-4">
              <a href="/admin/news" className="text-slate-300 hover:text-white">News</a>
              <a href="/admin/roadmap" className="text-slate-300 hover:text-white">Roadmap</a>
              <a href="/admin/changelog" className="text-slate-300 hover:text-white">Changelog</a>
              <a href="/admin/forum" className="text-slate-300 hover:text-white">Forum</a>
              <a href="/admin/live-events" className="text-slate-300 hover:text-white">Live Events</a>
              <a href="/" className="text-slate-300 hover:text-white">Strona główna</a>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}



