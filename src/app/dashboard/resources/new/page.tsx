import { ResourceEditorForm } from "@/components/admin/ResourceEditorForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewResourcePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Resource</CardTitle>
                <CardDescription>Fill out the form below to add a new resource to the hub.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResourceEditorForm />
            </CardContent>
        </Card>
    );
}
