// icons
import { Send, AlertTriangle, CheckCircle2, CalendarIcon } from "lucide-react";

// shadcn/ui components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// components
import Questionnaire from "@/components/Questionnaire";

// apis
import { getQuestionnaireById } from "@/api/BrauzApi";

export default async function FillQuestionnairePage() {
  const trung = await getQuestionnaireById();

  const { data: { message = "" } = {} } = trung;

  return (
    <div>
      {/* <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert className="max-w-lg">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Questionnaire Not Found</AlertTitle>
          <AlertDescription>
            The questionnaire you are looking for could not be found.
          </AlertDescription>
        </Alert>
      </div> */}

      <Questionnaire />
    </div>
  );
}
