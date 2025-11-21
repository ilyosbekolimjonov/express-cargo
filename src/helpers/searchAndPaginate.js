export const searchAndPaginate = async (search, Model, limit, offset, populate = []) => {
    const query = search
        ? { $or: [{ name: { $regex: search, $options: "i" } }] }
        : {}

    const total = await Model.countDocuments(query)

    let resultsQuery = Model.find(query).skip(offset).limit(limit)
    if (populate.length) resultsQuery = resultsQuery.populate(populate)

    const results = await resultsQuery
    return { results, total }
}