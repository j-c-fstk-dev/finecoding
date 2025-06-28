import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPosts } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const posts = await getPosts();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Blog Posts</CardTitle>
                        <CardDescription>Manage your articles here. Add, edit, or delete posts.</CardDescription>
                    </div>
                    <Link href="/dashboard/new">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Post
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                {posts.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Tags</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map(post => (
                                <TableRow key={post.slug}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags.map(tag => (
                                                <Badge key={tag} variant="outline">{tag}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{format(post.date, 'MMM d, yyyy')}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/edit/${post.slug}`} className="w-full">Edit</Link>
                                                </DropdownMenuItem>
                                                {post.id && <DeletePostButton postId={post.id} postTitle={post.title} />}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>You haven't created any posts yet.</p>
                        <p className="text-sm mt-1">Click the "Add New Post" button to get started.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <div className="text-xs text-muted-foreground">
                    Showing <strong>{posts.length}</strong> {posts.length === 1 ? 'post' : 'posts'}.
                </div>
            </CardFooter>
        </Card>
    );
}
