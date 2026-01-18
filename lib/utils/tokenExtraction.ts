// Utility to extract `token` from a searchParams-like object or a
// location search string. Used by unit tests and client code.
export function getToken(
  searchParams: { get: (key: string) => string | null } | null,
  locationSearch?: string | null
) {
  const fromSearchParams =
    searchParams && typeof searchParams.get === "function"
      ? searchParams.get("token")
      : null;

  if (fromSearchParams) return fromSearchParams;

  if (typeof locationSearch === "string") {
    try {
      return new URLSearchParams(locationSearch).get("token");
    } catch (err) {
      return null;
    }
  }

  return null;
}
