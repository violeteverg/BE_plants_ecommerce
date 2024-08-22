export function paginate<T>(items: T[], page: number, limit: number) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);

  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    data: paginatedItems,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
    },
  };
}
