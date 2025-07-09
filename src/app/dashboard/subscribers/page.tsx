import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportSubscribersButton } from "@/components/admin/ExportSubscribersButton";
import { Users } from "lucide-react";

export default function SubscribersPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Newsletter Subscribers</CardTitle>
                        <CardDescription>Export your full list of subscribers to a CSV file for manual import or backup.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ExportSubscribersButton />
            </CardContent>
        </Card>
    );
}
