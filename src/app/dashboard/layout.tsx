"use client";

import { ProtectedRoute, useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Code2, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { logout, user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/admin');
    };

    return (
        <div className="min-h-screen bg-muted/40">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                    <Code2 className="h-6 w-6 text-primary" />
                    <span>Dashboard</span>
                </Link>
                <div className="ml-auto flex items-center gap-4">
                    <ThemeToggle />
                    <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
                    <Button variant="outline" size="icon" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        <span className="sr-only">Logout</span>
                    </Button>
                </div>
            </header>
            <main className="p-4 sm:px-6 sm:py-0">{children}</main>
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
