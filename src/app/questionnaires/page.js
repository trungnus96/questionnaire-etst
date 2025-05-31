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

// utilities
import { isEmpty } from "lodash";
import {
  processQuestionnaireData,
  processSubmittedQuestionnaireResponse,
} from "@/utilities/questionnaires";

export default async function QuestionnairePage({ searchParams } = {}) {
  const search_params = await searchParams;

  const {
    group_gid = "",
    service = "",
    corresponding_gid = "",
  } = search_params;

  if (!corresponding_gid || !group_gid || !service) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans py-8 px-4 sm:px-6 lg:px-8 leading-normal">
        <Alert className="max-w-lg m-auto" variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Missing Parameters</AlertTitle>
          <AlertDescription>
            The required parameters are missing.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { error_message = "", data: { questionnaires = [] } = {} } =
    await getQuestionnaires({
      group_gid,
      service,
      active: true,
      page_size: 1,
      page_index: 0,
    });

  // get the questionnaire response if it exists
  let submitted_questionnaire_response = {};
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
      submitted_questionnaire_response = questionnaire_responses[0];
    }
  }

  // constants
  const is_submitted = !isEmpty(submitted_questionnaire_response);

  let questionnaire_to_use = questionnaires[0] || {};

  if (
    submitted_questionnaire_response &&
    !isEmpty(submitted_questionnaire_response.questionnaire)
  ) {
    questionnaire_to_use = submitted_questionnaire_response.questionnaire;
  }

  // content render helper
  let content = null;
  if (error_message) {
    content = (
      <Alert className="max-w-lg m-auto" variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error_message}</AlertDescription>
      </Alert>
    );
  } else if (isEmpty(questionnaire_to_use)) {
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
    const {
      questionnaire = {},
      sections = [],
      questions = [],
    } = processQuestionnaireData({
      questionnaire: questionnaire_to_use,
    });

    const { submitted_answers = {} } = processSubmittedQuestionnaireResponse({
      questionnaire_response: submitted_questionnaire_response,
    });

    const shared_props = {
      questionnaire,
      sections,
      questions,
      submitted_answers,
      is_submitted,
      search_params,
      submitted_questionnaire_response: {
        g_id: submitted_questionnaire_response.g_id,
        created_at: submitted_questionnaire_response.created_at,
        modified_at: submitted_questionnaire_response.modified_at,
      },
      allow_updating: false,
    };

    content = <Questionnaire {...shared_props} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-8 px-4 sm:px-6 lg:px-8 leading-normal">
      {content}
    </div>
  );
}
