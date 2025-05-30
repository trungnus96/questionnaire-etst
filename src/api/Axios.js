import axios from "axios";

import isEmpty from "lodash/isEmpty";

export function createAxiosRequest({
  url = "",
  method = "",
  params = {},
  data = {},
  headers = {},
}) {
  let config = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (!isEmpty(data)) {
    config = {
      ...config,
      data,
    };
  }

  if (!isEmpty(params)) {
    config = {
      ...config,
      params,
    };
  }

  return axios(config);
}
