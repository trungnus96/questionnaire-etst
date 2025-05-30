// utilities
import { readErrorMessageFromError } from "@/utilities";

export async function makeAnAsyncRequest({
  requestFunction = () => {},
  payload = {},
  is_check_success = true,
  name = "",
}) {
  try {
    const response = await requestFunction(payload);

    if (is_check_success === true) {
      const { status, data } = response;
      if (status === 200 && data.success) {
        return response;
      } else {
        const message = data && data.message ? data.message : "Unknown error";
        const error_message = `Error [${status}: ${message}]`;

        return { error_message, status };
      }
    } else {
      return response;
    }
  } catch (e) {
    const error_message = readErrorMessageFromError(e);

    return { error_message };
  }
}
