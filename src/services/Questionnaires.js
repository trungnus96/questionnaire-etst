// apis
import * as BrauzApi from "@/api/BrauzApi";

// utilities
import { makeAnAsyncRequest } from "@/utilities/api";

export async function getQuestionnaires(params = {}) {
  const { data = {}, error_message = "" } = await makeAnAsyncRequest({
    name: "Get Questionnaires",
    is_check_success: false,
    requestFunction: BrauzApi.getQuestionnaires,
    payload: { params },
  });

  return {
    error_message,
    data: data || {},
  };
}

export async function submitQuestionnaireResponse(payload = {}) {
  const { data = {}, error_message = "" } = await makeAnAsyncRequest({
    name: "Submit Questionnaire Response",
    is_check_success: false,
    requestFunction: BrauzApi.submitQuestionnaireResponse,
    payload,
  });

  return {
    error_message,
    data: data || {},
  };
}

export async function getQuestionnaireResponses(params = {}) {
  const { data = {}, error_message = "" } = await makeAnAsyncRequest({
    name: "Get Questionnaire Responses",
    is_check_success: false,
    requestFunction: BrauzApi.getQuestionnaireResponses,
    payload: { params },
  });

  return {
    error_message,
    data: data || {},
  };
}
