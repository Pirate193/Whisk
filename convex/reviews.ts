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

export const helpfulCount = mutation({
  args: {
    reviewId: v.id('recipeReviews'),
    recipeId:v.id('recipes'),
    userId:v.string(),
  },
  handler: async (ctx, args) => {
    // get the review
    const review = await ctx.db.get(args.reviewId);
    if (!review) throw new Error("Review not found");
    
    const existing = await ctx.db.query('recipeReviews').withIndex('by_userId_recipeId',
        (q)=>q.eq('userId',args.userId).eq('recipeId',args.recipeId)).filter((q)=>q.eq(q.field('helpfulCount'),1))
        .first();
    if(existing){
        const updated = await ctx.db.patch(args.reviewId,{
            helpfulCount:(review.helpfulCount)-1
        })
        return updated 
    }else{
  
    const updated = await ctx.db.patch(args.reviewId, {
      helpfulCount: (review.helpfulCount || 0) + 1,
    });

    return updated;
}
  },
});


