interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export async function paginate<T>(
  query: (skip: number, take: number) => Promise<T[]>,
  countQuery: () => Promise<number>,
  { page = 1, pageSize = 10 }: PaginationParams = {}
): Promise<PaginatedResponse<T>> {
  if (page < 1 || pageSize < 1 || pageSize > 100) {
    throw new Error('Invalid pagination parameters');
  }

  const skip = (page - 1) * pageSize;

  try {
    const [data, total] = await Promise.all([
      query(skip, pageSize),
      countQuery(),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      hasMore: skip + data.length < total,
    };
  } catch (error) {
    // You could wrap and rethrow here with additional metadata if needed
    throw error;
  }
}

// export async function paginate<T>(
//   query: (skip: number, take: number) => Promise<T[]>,
//   countQuery: () => Promise<number>,
//   { page = 1, pageSize = 10 }: PaginationParams = {}
// ): Promise<PaginatedResponse<T>> {
//   const skip = (page - 1) * pageSize;
//   const [data, total] = await Promise.all([
//     query(skip, pageSize),
//     countQuery(),
//   ]);

//   return {
//     data,
//     total,
//     page,
//     pageSize,
//     hasMore: skip + data.length < total,
//   };
// }

