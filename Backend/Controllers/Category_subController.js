const CATEGORY = require("../Models/categoryModel");
const NESTEDCAT = require("../Models/nestedCategories");
const PRODUCT = require("../Models/productModal")
const SUBCAT = require("../Models/subCategoryModel");
const { cloudUpload } = require("../utilities/cloudinary");

module.exports = {

    //CATEGORY CONTROLLERS

    //getting Categories

    getCategories: async (req, res) => {
        try {
            const categories = await CATEGORY.find({ deleted: false })
            if (!categories) {
                res.status(400).json({ message: "Category not found" })
            } else {
                res.status(200).json(categories)
            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },

    //get single category 
    getSingleCategory: async (req, res) => {
        {
            try {

                console.log("singl;e cat");
                const categoryId = req.query.categoryId

                const category = await CATEGORY.findOne({ _id: categoryId }).populate("subcategory")

                if (category) {
                    res.status(200).json(category)
                } else {
                    res.status(400).json({ message: "Category not found" })
                }

            } catch (error) {
                res.status(500).json({ message: "Something went wrong" })
            }
        }
    },

    //add new category
    addCategory: async (req, res) => {
        try {
            const { category } = req.body
            const parsedDetails = await  JSON.parse(category);

            console.log(parsedDetails);

            

            
            const categoryInfo = await CATEGORY.findOne({ "categoryName.en": parsedDetails.en, deleted:false})
            if (categoryInfo) {
                res.status(400).json({ message: "Category already exists" })
            } else {

                const File = req.file.path;
                cloudUpload(File, "Category").then((result, transformedURL) => {

                    const categoryTemplate = new CATEGORY({
                        categoryName: parsedDetails,
                        icon: result
                    })
                    categoryTemplate.save().then(() => {
                        res.status(200).json({ message: "Category successfully added" })
                    }).catch((err) => {

                        res.status(400).json({ message: "Category failed to be added" })
                    })
                }).catch((error) => {

                    res.status(400).json({ message: "cloud upload failed" })
                })

            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },

    //deleteCategory
    deleteCategory: async (req, res) => {
        try {
            const { categoryid } = req.query
            const categoryInfo = await CATEGORY.findOne({ _id: categoryid })
            if (categoryInfo) {
                CATEGORY.updateOne({ _id: categoryid }, { deleted: true }).then(() => {
                    PRODUCT.updateMany({ category: categoryid }, { deleted: true }, { upsert: true }).then(() => {
                        res.status(200).json({ message: "successfully deleted" })
                    }).catch((err) => {
                        res.status(500).json({ message: "Something went wrong" })
                    })
                })
            } else {
                res.status(404).json({ message: "category not found" })
            }
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" })
        }
    },

    //updatecategory
    updateCategory: async (req, res) => {
        try {
            const { categoryId, CategoryDet } = req.body
            const parsedDetails = await  JSON.parse(CategoryDet);
            const categoryInfo = await CATEGORY.findOne({ _id: categoryId })
            if (categoryInfo) {
                if(req.file){
                    const File = req.file?.path
                    cloudUpload(File, "Catagory").then((result) => {
                        CATEGORY.updateOne({ _id: categoryId }, { categoryName: parsedDetails, icon: result }).then(() => {
                            res.status(200).json({ message: "Successfully updated category" })
                        }).catch(() => {
                            res.status(500).json({ message: "something went wrong" })
                        })
                    }).catch((err) => {
                        res.status(400).json({ message: "Image upload failed" })
                    })
                }else{
                    CATEGORY.updateOne({ _id: categoryId }, { categoryName: parsedDetails}).then(() => {
                        res.status(200).json({ message: "Successfully updated category" })
                    }).catch(() => {
                        res.status(500).json({ message: "something went wrong" })
                    })
                }
            } else {
                res.status(404).json({ message: "category not found" })
            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },



    //add filter inputs category
    addFilters: async (req, res) => {
        try {
            const { categoryId,filterInputs } = req.body
            const categoryExist = CATEGORY.findById(categoryId)
            if (!categoryExist) {
                res.status(404).json({ message: 'Category not found' })
            } else {
                CATEGORY.updateOne({ _id: categoryId }, { $push: { filters: { $each: filterInputs }} }).then(()=>{
                    res.status(200).json({ message:"Filter added successfully" })
                }).catch((error) => 
                { res.status(500).json({ message: "Something went wrong"})}
                )
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    },

        //add filter inputs category
        addSubcatFilters: async (req, res) => {
            try {
                const { subcategoryId, filterInputs } = req.body
                const subcategoryExist = SUBCAT.findById(subcategoryId)
                if (!subcategoryExist) {
                    res.status(404).json({ message: 'Subcategory Category not found' })
                } else {
                    SUBCAT.updateOne({ _id: subcategoryId }, { $push: { filters: { $each: filterInputs }} },{upsert:true}).then(()=>{
                        res.status(200).json({ message:"Filter added successfully" })
                    }).catch((error) => 
                    { res.status(500).json({ message: "Something went wrong"})}
                    )
                }
            } catch (error) {
                res.status(500).json(error.message)
            }
        },

        //register clicks
        registerClicks: async (req, res)=>{
            try{
                const {categoryId,userId } = req.body
                const categoryInfo = await CATEGORY.findById(categoryId)
                if(categoryInfo) {
                    CATEGORY.updateOne({_id:categoryId, clicks: {$ne: userId}},{$addToSet: {clicks: userId}}).then((response)=>{
                        if (response.matchedCount === 0){
                            res.status(200).json({message:"registered clicks"})
                        }else{
                            res.status(200).json({message:"click registered"})
                        }
                    }).catch((err)=>{
                        res.status(200).json({message:"user already registered"})
                    })
                }else{
                    res.status(404).json({message:"Category not found"})
                }
            }catch(error){
                res.status(400).json({message:error.message})
            }
    
        },  

        //register clicks subcat
        registerClicksSubcat: async (req, res)=>{
            try{
                const {subCatId,userId } = req.body
                const subCatInfo = await SUBCAT.findById(subCatId)
                if(subCatInfo) {
                    SUBCAT.updateOne({_id:subCatId, clicks: {$ne: userId}},{$addToSet: {clicks: userId}}).then((response)=>{
                        if (response.matchedCount === 0){
                            res.status(200).json({message:"registered clicks"})
                        }else{
                            res.status(200).json({message:"click registered"})
                        }
                    }).catch((err)=>{
                        res.status(200).json({message:"user already registered"})
                    })
                }else{
                    res.status(404).json({message:"subcat not found"})
                }
            }catch(error){
                res.status(400).json({message:error.message})
            }
    
        },  




    //Subcategory Management

    getSubCategories: async (req, res) => {
        try {
            const subcategories = await SUBCAT.find({ deleted: false }).populate("nestedCategories")
            if (subcategories) {
                res.status(200).json(subcategories)
            } else {
                res.status(404).json({ messasge: "Empty subcategory" })
            }
        } catch (error) {
            res.status(500).json({ messasge: "something went wrong" })
        }
    },

    //add subcategory
    addSubcategory: async (req, res) => {
        try {

            const { categoryId, subCategory, formInputs } = req.body
            const subCatinfo = await SUBCAT.findOne({   "subcategory.en": subCategory.en, deleted:false })
            if (subCatinfo) {
                res.status(400).json({ message: "Subcategory already exists" })
            } else {
                const subCatTemplate = new SUBCAT({
                    subcategory: subCategory,
                    formInputs: [...formInputs],
                    category: categoryId
                })
                subCatTemplate.save().then((response) => {
                    CATEGORY.updateOne({ _id: categoryId }, { $push: { subcategory: response._id } })
                        .then((response) => {
                            if (response.nMatched === 0) {
                                res.status(400).json({ message: "Category does not exist" })
                            } else {
                                res.status(200).json({ message: "Successfully added" })
                            }
                        }).catch((err) => {

                            res.status(500).json({ message: "Something went wrong" })
                        })
                })
            }
        } catch (error) {

            res.status(500).json({ message: "Something went wrong" })
        }

    },

    getSingleSubcategory: async (req, res) => {
        {
            try {

                const subCategoryId = req.query.subCategoryId

                const subCategory = await SUBCAT.findOne({ _id: subCategoryId }).populate("nestedCategories")

                if (subCategory) {
                    res.status(200).json(subCategory)
                } else {

                    res.status(400).json({ message: "subcategory not found" })
                }

            } catch (error) {

                res.status(500).json({ message: "Something went wrong" })
            }
        }
    },

    //delete Subcategory
    deleteSubCategory: async (req, res) => {
        try {
            const { categoryId, subcategoryId } = req.query
            const subCategoryInfo = await SUBCAT.findOne({ _id: subcategoryId })
            if (subCategoryInfo) {
                SUBCAT.updateOne({ _id: subcategoryId }, { deleted: true }).then(() => {
                    CATEGORY.updateOne({ _id: categoryId }, { $pull: { subcategory: subcategoryId } }).then(() => {
                        res.status(200).json({ message: "successfully deleted" })
                    }).catch((err) => {
                        res.status(500).json({ message: err.message });
                    })
                }).catch((err) => {
                    res.status(500).json({ message: err.message });
                })
            } else {
                res.status(500).json({ message: "Subcategory does not exist" });
            }

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },


    //update subcategory
    updateSubcategory: async (req, res) => {
        try {
            const { subcategoryId, newInfo, formInputs, categoryId } = req.body
            const subCategoryInfo = await SUBCAT.findOne({ _id: subcategoryId })
            if (subCategoryInfo) {
                SUBCAT.updateOne({ _id: subcategoryId }, { subcategory: newInfo, formInputs: formInputs, category: categoryId }).then(() => {
                    res.status(200).json({ message: "Successfully updated" })
                }).catch((err) => {
                    res.status(500).json({ message: "Error updating" })
                })
            } else {
                res.status(404).json({ message: "subcategory not found" })
            }
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" })

        }
    },



    //add nested category
    addNested : async (req,res)=>{
        try {
            const { subcategoryId, nestedCategory} = req.body
            console.log(req.body);
            const nestedInfo = await NESTEDCAT.findOne({ "nestedCat.en": nestedCategory.en , subcategory:subcategoryId})
            if (nestedInfo) {
                res.status(400).json({ message: "nested cat already exists in this subcategory" })
            } else {
                const nestedCatTemplate = new NESTEDCAT({
                    subcategory: subcategoryId,
                    nestedCat: nestedCategory
                })
                nestedCatTemplate.save().then((response) => {
                    SUBCAT.updateOne({ _id: subcategoryId }, { $push: { nestedCategories: response._id } })
                        .then((response) => {
                            if (response.nMatched === 0) {
                                res.status(400).json({ message: "subacategory does not exist" })
                            } else {
                                res.status(200).json({ message: "Successfully added" })
                            }
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).json({ message: "Something went wrong" })
                        })
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"something went wrong"})
        }
    }






}