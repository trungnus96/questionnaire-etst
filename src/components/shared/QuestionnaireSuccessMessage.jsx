// shadcn/ui components
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// icons
import { CheckCircle2 } from "lucide-react";

function QuestionnaireSuccessMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-800/30 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-xl">Thank You!</CardTitle>
          <CardDescription>
            Your responses have been submitted successfully.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default QuestionnaireSuccessMessage;
