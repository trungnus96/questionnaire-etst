// icons
import { AlertTriangle } from "lucide-react";

// shadcn/ui components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// components
import Questionnaire from "@/components/Questionnaire";

// services
import {
  getQuestionnaires,
  getQuestionnaireResponses,
} from "@/services/Questionnaires";

export default async function FillQuestionnairePage({ searchParams } = {}) {
  const {
    group_gid = "",
    service = "",
    corresponding_gid = "",
  } = await searchParams;

  const { error_message = "", data: { questionnaires = [] } = {} } =
    await getQuestionnaires({
      group_gid,
      service,
      active: true,
      page_size: 1,
      page_index: 0,
    });

  let questionnaire_response = {};
  if (questionnaires.length > 0) {
    const { data: { questionnaire_responses = [] } = {} } =
      await getQuestionnaireResponses({
        questionnaire_gid: questionnaires[0].g_id,
        group_gid,
        service,
        corresponding_gid,
        page_size: 1,
        page_index: 0,
      });

    if (questionnaire_responses.length > 0) {
      questionnaire_response = questionnaire_responses[0];
    }
  }

  // constants
  const shared_props = {
    group_gid,
    service,
    corresponding_gid,
    questionnaire_response,
  };

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
  } else if (questionnaires.length === 0) {
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
    shared_props.questionnaire = questionnaires[0];
    content = <Questionnaire {...shared_props} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-8 px-4 sm:px-6 lg:px-8 leading-normal">
      {content}
    </div>
  );
}
