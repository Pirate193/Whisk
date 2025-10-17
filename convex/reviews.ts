import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const addReview = mutation({
    args:{
           userId: v.string(),
            recipeId: v.id("recipes"),
            rating: v.number(), // 1-5
            review: v.optional(v.string()),
            photoUrls: v.optional(v.array(v.id('_storage'))),
            helpfulCount: v.number(), 
    },
    handler:async(ctx ,args)=>{
        const review = await ctx.db.insert('recipeReviews',{
            userId:args.userId,
            recipeId:args.recipeId,
            rating:args.rating,
            review:args.review,
            photoUrls:args.photoUrls ?? [],
            helpfulCount:args.helpfulCount ?? 0
        })
        return review
    }
})

export const generatePhotoUrl = mutation({
    args:{},
    handler: async(ctx ,args)=>{
      return await ctx.storage.generateUploadUrl();
    }
})

export const getReviews = query({
    args:{recipeId:v.id('recipes')},
    handler: async(ctx ,args)=>{
        return await ctx.db.query('recipeReviews')
          .withIndex('by_recipeId',(q)=>q.eq('recipeId',args.recipeId))
          .collect();
          
    }
})