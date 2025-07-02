import { LoginForm } from "@/components/admin/LoginForm";
import { IconFC } from "@/components/icons/IconFC";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-primary rounded-full p-3 mb-4">
                <IconFC className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-headline text-foreground">Admin Access</h1>
            <p className="text-muted-foreground">Log in to manage Fine Coding content.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
