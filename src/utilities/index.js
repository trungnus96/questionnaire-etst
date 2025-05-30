export function readErrorMessageFromError(e) {
  let error_message = e.toString();
  try {
    const { response } = e;
    const { status, data } = response;
    const { message, errors, error_message: _error_message } = data;

    if (typeof errors === "string") {
      return `${errors} (${status})`;
    }

    if (typeof _error_message === "string") {
      return `${_error_message} (${status})`;
    }

    if (typeof message === "string") {
      return `${message} (${status})`;
    }

    const { error_description, error } = message;
    if (error_description) {
      error_message = `${error_description} (${status})`;
    } else if (error) {
      error_message = `${error} (${status})`;
    }
  } catch (_e) {
    // do nothing
  }
  return error_message;
}
