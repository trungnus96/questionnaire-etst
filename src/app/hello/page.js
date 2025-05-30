// icons
import { AlertTriangle } from "lucide-react";

// shadcn/ui components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// components
import Questionnaire from "@/components/Questionnaire";

// services
import { getQuestionnaireById } from "@/services/Questionnaires";

// utilities
import { isEmpty } from "lodash";

export default async function FillQuestionnairePage() {
  const { error_message = "", data: { questionnaire = {} } = {} } =
    await getQuestionnaireById();

  // content render helper
  let content = null;
  if (error_message) {
    content = (
      <Alert className="max-w-lg">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error_message}</AlertDescription>
      </Alert>
    );
  } else if (isEmpty(questionnaire)) {
    content = (
      <Alert className="max-w-lg">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Questionnaire Not Found</AlertTitle>
        <AlertDescription>
          The questionnaire you are looking for could not be found.
        </AlertDescription>
      </Alert>
    );
  } else {
    content = <Questionnaire questionnaire={questionnaire} />;
  }

  return content;
}
