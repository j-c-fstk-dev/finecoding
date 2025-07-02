"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ProtectedRoute, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { IconFC } from "@/components/icons/IconFC";
import { LogOut, Menu, Newspaper, Library } from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Posts", icon: Newspaper },
    { href: "/dashboard/resources", label: "Resources", icon: Library },
];

function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { logout, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        router.push('/admin');
    };

    const NavContent = () => (
        <nav className="grid items-start gap-2 text-sm font-medium">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))) && "bg-muted text-primary"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                            <IconFC className="h-6 w-6 text-primary" />
                            <span>Dashboard</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <NavContent />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <NavContent />
                        </SheetContent>
                    </Sheet>

                    <div className="w-full flex-1">
                        {/* Could add a search bar here in the future */}
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeSwitch />
                        <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
                        <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function ProtectedDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
    );
}
