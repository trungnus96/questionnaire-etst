export async function makeAsyncRequest(url = "", options = {}) {
  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body,
      next: options.next, // Next.js specific revalidation options
      cache: options.cache, // e.g., 'force-cache', 'no-store'
      signal: options.signal, // For cancellation
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return {
      data,
      error_message: "",
      status: response.status,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      data: {},
      error_message: error.message || "Unknown error",
      status: error.status || 500,
    };
  }
}
