export function paginatedResponse<T>({ data, total, page, limit }: { data: T[]; total: number; page: number; limit: number }) {
    return {
        data,
        count: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        next: total > page * limit,
        previous: page > 1,
    };
}