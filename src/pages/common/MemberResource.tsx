import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileEdit, ArrowRight, ArrowLeft } from "lucide-react";

const MemberResourceGate = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-page via-orange-50/20 to-page dark:from-page dark:via-orange-950/10 dark:to-page">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">

          {/* Lock / member-only visual */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-950/50">
              <FileEdit className="h-12 w-12 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-4xl font-bold text-foreground">
              Member resource
            </h2>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              This page is for members only.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              size="lg"
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2"
            >
              {/* Use an arrow-left icon, matching NotFound pattern */}
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/applications/new")}
              variant="default"
              className="gap-2"
            >
              Apply to join
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberResourceGate;
