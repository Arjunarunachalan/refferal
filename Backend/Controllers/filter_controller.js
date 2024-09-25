const CATEGORY = require("../Models/categoryModel");
const PRODUCT = require("../Models/productModal");
const SUBCAT = require("../Models/subCategoryModel");
const { getLocation, getReverseLocation, getPolygon } = require("../utilities/geoCoding");
const { fetchLocality, fetchLocation } = require("../utilities/localityFetch");
let mongoose = require('mongoose');




module.exports = {

    get_Revlocations: async (req, res) => {
        try {
            const { longitude, latitude } = req.query
            const locationDetails = await getReverseLocation(longitude, latitude)
            res.status(200).json(locationDetails)
        } catch (error) {
            res.status(400).json(error.message)

        }
    },
    get_locations: async (req, res) => {
        try {
            const { location } = req.query
            const locationDetails = await getLocation(location)
            res.status(200).json(locationDetails)
        } catch (error) {
            res.status(400).json(error.message)
        }
    },


    //filtering functions
    getFiltered: async (req, res) => {
        try {
            const { polygon, category } = req.query
            if (category == "") {
                const Products = await PRODUCT.find({ location: { $geoIntersects: { $geometry: polygon.bbox } } }).toArray()
                if (Products) {
                    res.status(200).json(Products)
                } else {
                    res.status(400).json({ message: "Products not Found" })
                }
            } else {
                const Products = await PRODUCT.find({ $and: [{ location: { $geoIntersects: { $geometry: polygon.bbox } } }, { category: category }] }).toArray()
                if (Products) {
                    res.status(200).json(Products)
                } else {
                    res.status(400).json({ message: "Products not Found" })
                }
            }


        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },



    searchProducts: async (req, res) => {
        try {

            const { SearchQuery = "", district = "", state = "", category = "", limit = 12, page = 0 } = req.query

            if (!category) {
                const result = await PRODUCT.find({ $or: [{ title: { "$regex": SearchQuery, "$options": "i" } }, { description: { "$regex": SearchQuery, "$options": "i" } }, { "otherDetails.brand": SearchQuery }] }).populate('userId').skip(page).limit(limit)

                if (!result) {
                    res.status(400).json({ message: "No products found with this criteria" })
                } else {
                    res.status(200).json(result)
                }
            } else {

                const result = await PRODUCT.find({ $or: [{ title: { "$regex": SearchQuery, "$options": "i" } }, { description: { "$regex": SearchQuery, "$options": "i" } }, { "otherDetails.brand": SearchQuery }] }).populate('userId').skip(page).limit(limit)
                if (!result) {
                    res.status(400).json({ message: "No products found with this criteria" })
                } else {
                    res.status(200).json(result)
                }
            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },

    searchLocality: async (req, res) => {
        try {
            const { state, district, village, subdistrict } = req.query
            const convDistrict = await district.toUpperCase()
            const locality = await fetchLocality(convDistrict)
            if (locality) {
                const newArray = await locality.reduce((result, element) => {
                    const isDuplicate = result.some((item) => item.village_locality_name === element.village_locality_name);

                    if (!isDuplicate) {
                        result.push(element);
                    }

                    return result;
                }, []);
                res.status(200).json(locality)
            } else {
                res.status(400).json({ message: "No products found with this criteria" })
            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }

    },


    searchStatesDistricts: async (req, res) => {
        try {
            const { districtCode } = req.query
            const locality = await fetchLocation(districtCode)
            if (locality) {
                res.status(200).json(locality)
            } else {
                res.status(400).json({ message: "No products found with this criteria" })
            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },


    //product filters

    // filter using location
    filterProducts: async (req, res) => {
        try {
            let { state, category,subcategory=undefined,nestedcat, district, locality="", max, min, page, other } = req.query
           
            
            let otherFilters = await JSON.parse(other)
            console.log(otherFilters);
            
            let query = [{ deleted: false }]
            if (state != "") {
                query.push({
                    state:
                        { "$regex": state, "$options": "i" }
                })
                if (district != "") {
                    query.push({
                        district:
                            { "$regex": district, "$options": "i" }
                    })
                    if (locality != "") {
                        query.push({
                            locality:
                                { "$regex": locality, "$options": "i" }
                        })
                    }
                }
            }
            if (category != "") {
                query.push({ category: category })
            }
            if (nestedcat != ""){
                query.push({ nested: nestedcat })
            }

            if (subcategory != "" || undefined) {

                
                query.push({ subcategory})
            }
            if (min != "") {
                let minval = parseInt(min)
                query.push({ price: { $gte: minval } })
            } if (max != "") {
                let maxval = parseInt(max)
                query.push({ price: { $lte: maxval } })
            }
            if (otherFilters) {
  
                let currentCategory = await CATEGORY.findById(category)
                let currentSubcategory
                if (subcategory){                   
                    currentSubcategory  = await SUBCAT.findOne({_id:subcategory})
 
                }
                
                if(currentCategory){
                    currentCategory.filters.forEach(async (value, index, array) => {
                        if (value.label in otherFilters) {
                            if (value.type === "text") {
                                query.push({ [`otherDetails.${value.label}`]: otherFilters.label })
                            } else if (value.type === "range") {
                                let min = parseInt(otherFilters[value.label].min)
                                let max = parseInt(otherFilters[value.label].max)
                                query.push({ [`otherDetails.${value.label}`]: { $gte: min, $lte: max } })
                            }
                            else if (value.type === "checkbox") {
                                if (otherFilters[value.label].length != 0) {
                                    query.push({ [`otherDetails.${value.label}`]: { $in: otherFilters[value.label] } })
                                }
                            }
                            else {
                                if (value.mode === "gte") {
                                    let val = parseInt(otherFilters.label)
                                    query.push({ [`otherDetails.${value.label}`]: { $gte: val } })
                                } else {
                                    let val = parseInt(otherFilters.label)
                                    query.push({ [`otherDetails.${value.label}`]: { $lte: val } })
                                }
                            }
                        }
                    })
                }
              
               if(currentSubcategory){
                currentSubcategory.filters.forEach(async (value, index, array) => {
                    if (value.label in otherFilters) {
                        if (value.type === "text") {
                            query.push({ [`otherDetails.${value.label}`]: otherFilters.label })
                        } else if (value.type === "range") {
                            let min = parseInt(otherFilters[value.label].min)
                            let max = parseInt(otherFilters[value.label].max)
                            query.push({ [`otherDetails.${value.label}`]: { $gte: min, $lte: max } })
                        }
                        else if (value.type === "checkbox") {
                            if (otherFilters[value.label].length != 0) {
                                query.push({ [`otherDetails.${value.label}`]: { $in: otherFilters[value.label] } })
                            }
                        }
                        else {
                            if (value.mode === "gte") {
                                let val = parseInt(otherFilters.label)
                                query.push({ [`otherDetails.${value.label}`]: { $gte: val } })
                            } else {
                                let val = parseInt(otherFilters.label)
                                query.push({ [`otherDetails.${value.label}`]: { $lte: val } })
                            }
                        }
                    }
                })
               }
            }
            const limit = 12
            
            PRODUCT.find({ $and: query }).populate('userId').skip(page).limit(limit).then((productDetails) => {
                // console.log(productDetails, "hhhh");
                query = [{ deleted: false }]
                res.status(200).json(productDetails)
            }).catch((error) => {

                query = [{ deleted: false }]
                res.status(404).json({ messagge: "products not found" })
            })

        } catch (error) {
            console.log(error,"hhh");
            res.status(500).json({ message: "something went wrong" })
        }

    },

    //filter product using categories and subcategories

    filterbyCategories: async (req, res) => {
        try {

            let { subcategory, category, max, min, page } = req.query
            let query = [{ deleted: false }]
            if (category) {
                query.push({ category: category })
            }
            if (subcategory) {
                query.push({ SubCategory: subcategory })
            }
            if (min) {
                query.push({ price: { $gte: min } })
            } if (max) {
                query.push({ price: { $lte: max } })
            }
            const limit = 12

            const productDetails = await PRODUCT.find({ $and: query }).populate('userId').skip(page).limit(limit)
            if (productDetails) {

                res.status(200).json(productDetails)
            } else {
                res.status(404).json({ messagge: "products not found" })
            }

        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    }






    // // filter with distance
    // filterDistance :async (req,res)=>{
    //     try {
    //         const {longitude,latitude,distance} = req.query
    //         const productDetails = await PRODUCT.find({location: { $geoWithin: { $centerSphere: [[longitude, latitude],distance / 3963.2 ]}}})
    //         if(productDetails){
    //            res.status(200).json(productDetails)
    //         }else{
    //            res.status(400).json({message:"No products with in this distance"})
    //         }
    //     } catch (error) {
    //         res.status(500).json({message:"something went wrong"})
    //     }
    // },

    // searchProducts:async(req,res)=>{

    //     try {
    //         const {SearchQuery="",district="",state=""} = req.query

    //         console.log(SearchQuery,category);


    //         if(category == ""){
    //             const result = await  PRODUCT.find({ name: { $regex: new RegExp(SearchQuery, 'i') }})
    //             if(!result){
    //                     res.status(400).json({message:"No products found with this criteria"})
    //                 }else{
    //                     res.status(200).json(result)
    //             }
    //         }else{
    //             const result = await  PRODUCT.find({ name: { $regex: new RegExp(SearchQuery, 'i') }})
    //             if(!result){
    //                 res.status(400).json({message:"No products found with this criteria"})
    //             }else{
    //                 res.status(200).json(result)
    //         }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({message:"something went wrong"})
    //     }
    // }, 

    //searching Function
    // searchProducts:async(req,res)=>{
    //     try {
    //         // const {polygon}= req.body
    //        getPolygon()
    //     } catch (error) {
    //         console.log(error.message);
    //         res.status(500).json({message:"something went wrong"})
    //     }
    // }


    //uses co ordinates to search

    // searchProducts:async(req,res)=>{
    //     try {
    //         const {SearchQuery,category,polygon} = req.body

    //         console.log(SearchQuery,category,polygon);


    //         if(category == ""){
    //             const result = await  PRODUCT.find({$and:[{location: { $geoIntersects: { $geometry: polygon.bbox }}},{ name: { $regex: new RegExp(SearchQuery, 'i') }}]})
    //             if(!result){
    //                     res.status(400).json({message:"No products found with this criteria"})
    //                 }else{
    //                     res.status(200).json(result)
    //             }
    //         }else{
    //             const result = await  PRODUCT.find({$and:[{location: { $geoIntersects: { $geometry: polygon.bbox }}},{category:category},{ name: { $regex: new RegExp(SearchQuery, 'i') }}]})
    //             if(!result){
    //                 res.status(400).json({message:"No products found with this criteria"})
    //             }else{
    //                 res.status(200).json(result)
    //         }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({message:"something went wrong"})
    //     }
    // },
}