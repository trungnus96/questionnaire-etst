// apis
import * as BrauzApi from "@/api/BrauzApi";

// utilities
import { makeAnAsyncRequest } from "@/utilities/api";

export async function getQuestionnaire(params = {}) {
  const { data = {}, error_message = "" } = await makeAnAsyncRequest({
    name: "Get Questionnaire By Id",
    is_check_success: false,
    requestFunction: BrauzApi.getQuestionnaire,
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
