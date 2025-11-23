export function paginate(page = 1, limit = 10) {
    if (page < 0) page = 1
    if (limit < 0) limit = 10

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const offset = (page - 1) * limit;

    return { page, limit, offset };
}
