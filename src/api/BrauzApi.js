import { createAxiosRequest } from "./Axios";

// constants
import { BRAUZ_NETLIFY_API_V2 } from "@/constants/env";

export async function getQuestionnaires({ params = {} } = {}) {
  const url = `${BRAUZ_NETLIFY_API_V2}/thirdparty/questionnaires`;

  return createAxiosRequest({
    url,
    method: "GET",
    params,
  });
}

export async function submitQuestionnaireResponse(data = {}) {
  const url = `${BRAUZ_NETLIFY_API_V2}/thirdparty/questionnaire-responses`;

  return createAxiosRequest({
    url,
    method: "POST",
    data,
  });
}

export async function updateQuestionnaireResponse(data = {}) {
  const { g_id = "", ...rest } = data;
  const url = `${BRAUZ_NETLIFY_API_V2}/thirdparty/questionnaire-responses/${g_id}`;

  return createAxiosRequest({
    url,
    method: "PUT",
    data: rest,
  });
}

export async function getQuestionnaireResponses({ params = {} } = {}) {
  const url = `${BRAUZ_NETLIFY_API_V2}/thirdparty/questionnaire-responses`;

  return createAxiosRequest({
    url,
    method: "GET",
    params,
  });
}
