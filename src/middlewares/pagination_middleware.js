import { ApiError } from "../utils/apiError.js";


const paginate = function(model){
    return async (req, res, next) => {
        // Extract page and limit from query parameters or set default values
        const { page = 1, limit = 10, tags} = req.query // Fix Bug: Enable dynamic search with tags
        // Define pagination options with page number, limit, and custom labels
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            customLabels: {
                totalDocs: "totalItems",
                docs: "results",
                nextPage: "next",
                prevPage: "prev",
            }
        };
        try {
            // Create a filter object for tags
            const filter = tags ? { tags: { $in: tags.split(',') } } : {};

            const paginatedResults = await model.paginate(filter, options)
            res.paginatedResults = paginatedResults;
            next()
            
        } catch (error) {
            throw new ApiError (500, "Failed to get data")
        }
    }
}

export { paginate }




// Note:
/*
const filter = tags ? { tags: { $in: tags.split(',') } } : {};

tags ? ... : ...
This is a ternary operator that checks if the tags variable exists (i.e., it's not null, undefined, or an empty string). If tags exists, it executes the code

If tags exists: { tags: { $in: tags.split(',') } }
1. tags.split(','): This splits the tags string into an array of individual tags. For example, if tags is 'AWS,GOLANG', it becomes ['AWS', 'GOLANG'].
2. { $in: tags.split(',') }: This creates a MongoDB query operator $in, which checks if the tags field in the documents contains any of the values in the array. So, it effectively translates to finding documents where the tags field contains at least one of the tags in the array.
3. { tags: { $in: tags.split(',') } }: This forms the complete filter object that will be used in the query to find documents where the tags field matches any of the tags in the array.

{}
If tags is not provided, the ternary operator returns an empty object {}. This means no filter will be applied, and all documents will be considered.

*/