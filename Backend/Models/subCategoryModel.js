const mongoose = require('mongoose')
const schema = mongoose.Schema;

const SubCategoryschema = new schema({
    subcategory: {
        type: Object,     
    },
    category: {
        type: String,
        ref: "category"
    },
    nestedCategories:[{
        type:String,
        ref:"nestedcategories"
    }],
    formInputs: [{
        type: schema.Types.Mixed
    }],
    filters: [{
        type: schema.Types.Mixed
      }],
    clicks:[String],
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
const SUBCAT = mongoose.model("subcategory", SubCategoryschema);

module.exports = SUBCAT