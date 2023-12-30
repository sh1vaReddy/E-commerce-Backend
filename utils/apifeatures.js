

class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
      this.query = this.query.find({ ...keyword });
      return this;
    }

    filter()
    {
      const quercopy={...this.queryStr}
      //Removing some fileds in Catergory
        const removefileds=["keyword","page","limit"]
        removefileds.forEach(key=>delete quercopy[key])
        let queryStr=JSON.stringify(quercopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|gte)\b/g,key=>`$${key}`);

        this.query=this.query.find(JSON.parse(queryStr));
      return this;
    }
   pagenation(resultpage)
   {
    const curentpage=Number(this.queryStr.page) || 1;
    const skip=resultpage*(curentpage-1)
    this.queryStr=this.query.limit(resultpage).skip(skip)
    return this;
   }
  
    
  }
  
module.exports=ApiFeatures;