/**
 * Validate the foundation health contract before showing a connected state.
 * @param {unknown} value
 * @returns {boolean}
 */
export function isHealthResponse(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.keys(value).length === 4 &&
    value.schemaVersion === "0.1" &&
    value.service === "breast-ai-api" &&
    value.status === "ok" &&
    value.modelStatus === "not_loaded"
  );
}
