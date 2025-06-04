// icons
import { AlertTriangle } from "lucide-react";

// shadcn/ui components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// components
import QuestionnaireForm from "./QuestionnaireForm";

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

export default async function QuestionnairePage({
  searchParams,
  include_staff_only_items,
} = {}) {
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
      include_staff_only_items,
    });

  // get the questionnaire response if it exists
  let submitted_questionnaire_response = {};

  // related_questionnaire_response means the responses that are not related to the current corresponding_gid but are related to the same questionnaire
  let related_questionnaire_response = {};

  if (questionnaires.length > 0) {
    const {
      data: {
        questionnaire_responses = [],
        related_questionnaire_responses = [],
      } = {},
    } = await getQuestionnaireResponses({
      questionnaire_gid: questionnaires[0].g_id,
      group_gid,
      service,
      corresponding_gid,
      page_size: 1,
      page_index: 0,
      include_related_responses: true,
      include_staff_only_items,
    });

    if (questionnaire_responses.length > 0) {
      submitted_questionnaire_response = questionnaire_responses[0];
    }

    if (related_questionnaire_responses.length > 0) {
      related_questionnaire_response = related_questionnaire_responses[0];
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
        <AlertTitle>QuestionnaireForm Not Found</AlertTitle>
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

    const { submitted_answers: related_submitted_answers = {} } =
      processSubmittedQuestionnaireResponse({
        questionnaire_response: related_questionnaire_response,
        related_submitted_answer: true,
      });

    const shared_props = {
      search_params,
      questionnaire,
      sections,
      questions,
      is_submitted,
      submitted_answers,
      submitted_questionnaire_response: {
        g_id: submitted_questionnaire_response.g_id,
        created_at: submitted_questionnaire_response.created_at,
        modified_at: submitted_questionnaire_response.modified_at,
      },
      // related_questionnaire_response means the responses that are not related to the current corresponding_gid but are related to the same questionnaire for this customer
      related_submitted_answers,
      related_questionnaire_response: {
        g_id: related_questionnaire_response.g_id,
        created_at: related_questionnaire_response.created_at,
        modified_at: related_questionnaire_response.modified_at,
      },
      // update after submission
      allow_updating: true,
    };

    content = <QuestionnaireForm {...shared_props} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-8 px-4 sm:px-6 lg:px-8 leading-normal">
      {content}
    </div>
  );
}
