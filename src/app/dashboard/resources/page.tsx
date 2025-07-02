import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getResources } from "@/lib/resources";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { DeleteResourceButton } from "@/components/admin/DeleteResourceButton";

export default async function ResourcesDashboardPage() {
    const resources = await getResources();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Resource Hub</CardTitle>
                        <CardDescription>Manage your community resources here.</CardDescription>
                    </div>
                    <Link href="/dashboard/resources/new">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Resource
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                {resources.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden md:table-cell">Category</TableHead>
                                <TableHead className="hidden md:table-cell">Pricing</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resources.map(resource => (
                                <TableRow key={resource.id}>
                                    <TableCell className="font-medium">
                                        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                                            {resource.name}
                                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                        </a>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline">{resource.category}</Badge>
                                    </TableCell>
                                     <TableCell className="hidden md:table-cell">
                                        <Badge variant="secondary">{resource.pricing}</Badge>
                                    </TableCell>
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
                                                    <Link href={`/dashboard/resources/edit/${resource.id}`} className="w-full">Edit</Link>
                                                </DropdownMenuItem>
                                                {resource.id && <DeleteResourceButton resourceId={resource.id} resourceName={resource.name} />}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>You haven't added any resources yet.</p>
                        <p className="text-sm mt-1">Click the "Add New Resource" button to get started.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
