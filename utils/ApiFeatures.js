class ApiFeatures {
    constructor (query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter(allowedFilterFields = []) {
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields', 'search', 'keyword'];
        excludeFields.forEach(el => delete queryObj[el]);
    
        // Filter only allowed fields
        const filteredQueryObj = {};
        Object.keys(queryObj).forEach(key => {
            if (allowedFilterFields.includes(key)) {
                filteredQueryObj[key] = queryObj[key];
            }
        });
    
        let queryStr = JSON.stringify(filteredQueryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    search(allowedFields = []) {
        const { keyword, searchBy } = this.queryString;
    
        if (keyword) {
            // If searchBy exists, split it; otherwise default to first allowed field as array
            const fields = (searchBy ? searchBy.split(',') : [allowedFields[0]])
                .map(field => field.trim())
                .filter(field => allowedFields.includes(field));
    
            const searchConditions = fields.map(field => ({
                [field]: { $regex: keyword, $options: 'i' } // Correct regex syntax here
            }));
            this.query = this.query.find({ $or: searchConditions });
        }
    
        return this;
    }

    sort(){
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    paginate() {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

export default ApiFeatures;