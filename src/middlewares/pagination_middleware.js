import { ApiError } from "../utils/apiError.js";


const paginate = function(model){
    return async (req, res, next) => {
        // Extract page and limit from query parameters or set default values
        const { page = 1, limit = 10} = req.query
        // Define pagination options with page number, limit, and custom labels
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            customLabels: {
                totalDocs: "totalBlogs",
                docs: "results",
                nextPage: "next",
                prevPage: "prev",
            }
        };
        try {
            const paginatedResults = await model.paginate({}, options)
            res.paginatedResults = paginatedResults;
            next()
            
        } catch (error) {
            throw new ApiError (500, "Failed to get data")
        }
    }
}

export { paginate }