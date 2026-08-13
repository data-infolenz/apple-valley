'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  BedDouble,
  Package,
  MapPin,
  CreditCard,
  Tag,
  Settings,
  Star,
  ShieldCheck,
  Clock,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Bell,
  Search,
  Moon,
  Sun,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth-store';

const sidebarItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  {
    name: 'Rooms',
    icon: BedDouble,
    children: [
      { name: 'All Rooms', href: '/admin/rooms' },
      { name: 'Room Types', href: '/admin/rooms/types' },
      { name: 'Seasonal Pricing', href: '/admin/rooms/pricing' },
    ],
  },
  {
    name: 'Packages',
    icon: Package,
    children: [
      { name: 'All Packages', href: '/admin/packages' },
      { name: 'Create Package', href: '/admin/packages/create' },
    ],
  },
  { name: 'Attractions', href: '/admin/attractions', icon: MapPin },
  {
    name: 'Operations',
    icon: Settings,
    children: [
      { name: 'Check-in/Out', href: '/admin/operations/checkin' },
      { name: 'Housekeeping', href: '/admin/operations/housekeeping' },
      { name: 'Add-on Orders', href: '/admin/operations/addons' },
    ],
  },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'ID Verification', href: '/admin/verification', icon: ShieldCheck },
  { name: 'Reports', href: '/admin/reports', icon: Clock },
];

interface NotificationBooking {
  bookingId: string;
  createdAt: string;
  guestSnapshot: {
    name: string;
  };
  rooms: Array<{
    roomTypeName: string;
  }>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Rooms', 'Packages']);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);
  const [latestBookings, setLatestBookings] = useState<NotificationBooking[]>([]);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoginPage) return;

    const loadLatestBookings = async () => {
      try {
        const response = await fetch('/api/bookings?limit=5&status=all', {
          cache: 'no-store',
        });
        const result = await response.json();

        if (response.ok && result.success) {
          setLatestBookings(result.data);
        }
      } catch {
        setLatestBookings([]);
      }
    };

    loadLatestBookings();
    const interval = window.setInterval(loadLatestBookings, 10000);
    return () => window.clearInterval(interval);
  }, [isLoginPage]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    setMobileSidebarOpen(false);
    router.replace('/');
    router.refresh();
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      handleLogout();
    }, 30 * 60 * 1000);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-forest-950">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-forest-900 border-r border-forest-200 dark:border-forest-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden lg:block`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-forest-200 dark:border-forest-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-forest-600 flex items-center justify-center">
              <span className="text-white font-bold">AV</span>
            </div>
            {sidebarOpen && (
              <span className="font-heading font-semibold text-forest-800 dark:text-white">
                Admin
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800"
          >
            <Menu className="w-5 h-5 text-forest-600 dark:text-mist-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {sidebarItems.map((item) => (
            <div key={item.name}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-white'
                      : 'text-forest-600 dark:text-mist-400 hover:bg-forest-50 dark:hover:bg-forest-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      expandedItems.includes(item.name)
                        ? 'bg-forest-50 dark:bg-forest-800/50'
                        : ''
                    } text-forest-600 dark:text-mist-400 hover:bg-forest-50 dark:hover:bg-forest-800/50`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 shrink-0" />
                      {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                    </div>
                    {sidebarOpen && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedItems.includes(item.name) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  {sidebarOpen && expandedItems.includes(item.name) && item.children && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            pathname === child.href
                              ? 'bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-white'
                              : 'text-forest-600 dark:text-mist-400 hover:bg-forest-50 dark:hover:bg-forest-800/50'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-forest-900 z-50 lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-forest-200 dark:border-forest-800">
                <span className="font-heading font-semibold text-forest-800 dark:text-white">
                  Apple Valley Admin
                </span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X className="w-5 h-5 text-forest-600 dark:text-mist-400" />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {sidebarItems.map((item) => (
                  <div key={item.name}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          pathname === item.href
                            ? 'bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-white'
                            : 'text-forest-600 dark:text-mist-400'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleExpand(item.name)}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-forest-600 dark:text-mist-400"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedItems.includes(item.name) ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {expandedItems.includes(item.name) && item.children && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={() => setMobileSidebarOpen(false)}
                                className="block px-3 py-2 rounded-lg text-sm text-forest-600 dark:text-mist-400"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-forest-900 border-b border-forest-200 dark:border-forest-800 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800 lg:hidden"
            >
              <Menu className="w-5 h-5 text-forest-600 dark:text-mist-400" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
              <Input
                placeholder="Search bookings..."
                className="pl-9 w-64 bg-forest-50 dark:bg-forest-800 border-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-forest-100 dark:hover:bg-forest-800"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-forest-600 dark:text-mist-400" />
                ) : (
                  <Moon className="w-5 h-5 text-forest-600" />
                )}
              </button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative p-2">
                  <Bell className="w-5 h-5 text-forest-600 dark:text-mist-400" />
                  {latestBookings.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {latestBookings.length === 0 ? (
                  <DropdownMenuItem className="text-forest-500">
                    No booking notifications
                  </DropdownMenuItem>
                ) : (
                  latestBookings.map((booking) => (
                    <DropdownMenuItem key={booking.bookingId} className="flex flex-col items-start">
                      <span className="font-medium">New booking received</span>
                      <span className="text-xs text-forest-500">
                        {booking.bookingId} - {booking.guestSnapshot.name}
                      </span>
                      <span className="text-xs text-forest-500">
                        {booking.rooms[0]?.roomTypeName || 'Room booking'} - {new Date(booking.createdAt).toLocaleString('en-IN')}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-forest-600" onClick={() => router.push('/admin/bookings')}>
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-forest-600 text-white">AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-forest-800 dark:text-white">
                    Admin
                  </span>
                  <ChevronDown className="w-4 h-4 text-forest-600 dark:text-mist-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Hotel Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
