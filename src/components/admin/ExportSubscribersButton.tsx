"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download } from "lucide-react";
import { getSubscribersAsCsv } from "@/lib/newsletter";

export function ExportSubscribersButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const csvData = await getSubscribersAsCsv();

      if (!csvData) {
        toast({
          title: "No Subscribers",
          description: "There are no subscribers to export.",
          variant: "default",
        });
        return;
      }

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      const formattedDate = new Date().toISOString().split('T')[0];
      link.setAttribute("download", `finecoding-subscribers-${formattedDate}.csv`);
      document.body.appendChild(link);
      
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your subscriber list has been downloaded.",
      });

    } catch (error) {
      console.error("Failed to export subscribers:", error);
      toast({
        title: "Error",
        description: "Could not export subscribers. Please check the logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
      Export to CSV
    </Button>
  );
}
