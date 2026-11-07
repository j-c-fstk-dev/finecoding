import { notFound } from "next/navigation";
import { getResourceById } from "@/lib/resources";
import { ResourceEditorForm } from "@/components/admin/ResourceEditorForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const resource = await getResourceById(id);

    if (!resource) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Resource</CardTitle>
                <CardDescription>Make changes to the resource below.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResourceEditorForm resource={resource} />
            </CardContent>
        </Card>
    );
}
