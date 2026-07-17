import { useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Key,
  ArrowLeftRight,
  Bell,
  Image,
  Settings,
  Activity,
  LogOut,
  Menu,
  Wifi,
  ChevronLeft,
  Shield,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { useClickOutside } from '@/shared/hooks';
const adminSidebarLinks = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Plans', to: '/admin/plans', icon: CreditCard },
  { label: 'Access Codes', to: '/admin/access-codes', icon: Key },
  { label: 'Transactions', to: '/admin/transactions', icon: ArrowLeftRight },
  { label: 'Notifications', to: '/admin/notifications', icon: Bell },
  { label: 'Gallery', to: '/admin/gallery', icon: Image },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
  { label: 'Activity Logs', to: '/admin/activity-logs', icon: Activity },
];

function AdminLayoutInner() {
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  useClickOutside(sidebarRef, () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300',
          'lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <Link to="/admin" className="flex items-center gap-2">
            <Wifi className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-gray-900">YAROTECH</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Admin Panel
          </p>
          <ul className="space-y-1">
            {adminSidebarLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-3">
          <Link
            to="/dashboard"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            Customer View
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1">
              <Shield className="h-3.5 w-3.5 text-amber-700" />
              <span className="text-xs font-semibold text-amber-700">
                Admin
              </span>
            </div>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {user?.full_name?.[0]?.toUpperCase() ||
                  user?.username?.[0]?.toUpperCase() ||
                  'A'}
              </div>
              <div className="hidden text-sm sm:block">
                <p className="font-medium text-gray-900">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminLayout() {
  return <AdminLayoutInner />;
}
