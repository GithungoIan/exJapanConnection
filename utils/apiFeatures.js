class APIFeatures {
	constructor(query, queryString){
		this.query = query;
		this.queryString = queryString;
	}
    
	filter(){
		const queryObj = {...this.queryString};
		const excludeFields = ['page', 'sort', 'limit', 'fields'];
		excludeFields.forEach((el) => delete queryObj[el]);
		
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
		
		this.query = this.query.find(JSON.parse(queryStr));
		return this;
	}
    
	sort(){
		if(this.queryString.sort){
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);	
		}else {
			this.query = this.query.sort('-dotePosted');
		}
	}
	
	limitFields() {
		if(this.queryString.fields) {
			const fileds = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fileds);
		}else {
			this.query = this.query.select('-__v');
		}
		return this;
	}
	
	paginate() {
		const page = this.queryString * 1 || 1;
		const limit = this.queryString * 1 || 100;
		const skip = (page - 1) * limit
		
		this.query = this.query.skip(skip).limit(limit);
		
		return this;
	}
}

module.exports = APIFeatures;