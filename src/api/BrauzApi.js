import { createAxiosRequest } from "./Axios";

// constants
import { BRAUZ_NETLIFY_API_V2 } from "@/constants/env";

export async function getQuestionnaireById() {
  const url = `${BRAUZ_NETLIFY_API_V2}/thirdparty/questionnaires/get`;

  return createAxiosRequest({
    url,
    method: "GET",
  });
}

export async function submitQuestionnaireResponse(data = {}) {
  const url = `${BRAUZ_NETLIFY_API_V2}/thirdparty/questionnaires/submit-response`;

  return createAxiosRequest({
    url,
    method: "POST",
    data,
  });
}
