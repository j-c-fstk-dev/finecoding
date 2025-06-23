import { PostEditorForm } from "@/components/admin/PostEditorForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPostPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Fill out the form below to publish a new article.</CardDescription>
            </CardHeader>
            <CardContent>
                <PostEditorForm />
            </CardContent>
        </Card>
    );
}
