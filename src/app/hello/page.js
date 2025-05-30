// icons
import { AlertTriangle } from "lucide-react";

// shadcn/ui components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// components
import Questionnaire from "@/components/Questionnaire";

// services
import { getQuestionnaire } from "@/services/Questionnaires";

// utilities
import { isEmpty } from "lodash";

export default async function FillQuestionnairePage({ searchParams } = {}) {
  const { service = "", corresponding_gid = "" } = await searchParams;

  const {
    error_message = "",
    data: { questionnaire = {}, previous_questionnaire_response = {} } = {},
  } = await getQuestionnaire({
    service,
    corresponding_gid,
  });

  // content render helper
  let content = null;
  if (error_message) {
    content = (
      <Alert className="max-w-lg m-auto border-0" variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error_message}</AlertDescription>
      </Alert>
    );
  } else if (isEmpty(questionnaire)) {
    content = (
      <Alert className="max-w-lg m-auto" variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Questionnaire Not Found</AlertTitle>
        <AlertDescription>
          The questionnaire you are looking for could not be found.
        </AlertDescription>
      </Alert>
    );
  } else {
    content = (
      <Questionnaire
        questionnaire={questionnaire}
        previous_questionnaire_response={previous_questionnaire_response}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-8 px-4 sm:px-6 lg:px-8 leading-normal">
      {content}
    </div>
  );
}
