import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Estimator() {
  const estimatorUrl = "https://carbonstockestimation.mgx.world/";

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Carbon Stock Estimator</h1>
          <p className="text-gray-600 text-lg">
            Use our external carbon stock estimation model. If the embedded view is blocked by the site, open it in a new tab.
          </p>
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between space-y-0">
            <div>
              <CardTitle>Embedded Estimator</CardTitle>
              <CardDescription>Interactive tool from carbonstockestimation.mgx.world</CardDescription>
            </div>
            <Button asChild variant="outline">
              <a href={estimatorUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                Open in new tab
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[80vh] rounded-lg overflow-hidden border">
              <iframe
                title="Carbon Stock Estimator"
                src={estimatorUrl}
                className="w-full h-full"
                loading="lazy"
                allow="fullscreen; clipboard-read; clipboard-write"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
