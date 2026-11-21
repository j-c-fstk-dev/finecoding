import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/icons/LogoMark";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <LogoMark glow className="mx-auto mb-5 h-16 w-16" title="Fine Coding" />
            <h1 className="text-2xl font-bold font-headline text-foreground">Admin Access</h1>
            <p className="text-muted-foreground">Log in to manage Fine Coding content.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
