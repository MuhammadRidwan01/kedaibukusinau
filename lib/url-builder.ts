export function buildFilterUrl(
  currentParams: Record<string, string>,
  updates: Record<string, string | null>
): string {
  const params = new URLSearchParams(currentParams);
  
  // If we're updating a filter (not page or sort), reset to page 1
  const isFilterUpdate = Object.keys(updates).some(k => k !== 'page' && k !== 'sort');
  if (isFilterUpdate) {
    params.delete("page");
  }

  // Apply updates
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  return `/catalog?${params.toString()}`;
}
