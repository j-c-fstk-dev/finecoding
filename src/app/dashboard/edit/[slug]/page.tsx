import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { PostEditorForm } from "@/components/admin/PostEditorForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Post</CardTitle>
                <CardDescription>Make changes to your article below.</CardDescription>
            </CardHeader>
            <CardContent>
                <PostEditorForm post={post} />
            </CardContent>
        </Card>
    );
}
