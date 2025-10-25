import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const addfavourite = mutation({
    args:{
        userId:v.string(),
        recipeId:v.id('recipes'),
    },
    handler: async(ctx ,args)=>{
        const isFavourite = await ctx.db.query('favourites').withIndex('by_userId_recipeId',(q)=>q.eq('userId',args.userId).eq('recipeId',args.recipeId))
         .first();

         if(isFavourite){
            const unliked = await ctx.db.delete(isFavourite._id)
            return unliked;
         }else{
            const liked = await ctx.db.insert('favourites',{
                userId:args.userId,
                recipeId:args.recipeId
            })
            return liked
         }
        
    }
})

export const getfavourites = query({
    args:{userId:v.string()},
    handler:async(ctx ,args)=>{
        const favourites = await ctx.db.query('favourites').withIndex('by_userId',(q)=>q.eq('userId',args.userId)).collect()
       
         const favouriteswithrecipes = await Promise.all(favourites.map(async(f)=>{
          const recipe = await ctx.db.get(f.recipeId)
          return {...f,recipe:recipe}
        }))

        return favouriteswithrecipes
    }
})


export const getfavourite = query({
    args:{userId:v.string(),recipeId:v.id('recipes')},
    handler:async(ctx ,args)=>{
        const favourites = await ctx.db.query('favourites').withIndex('by_userId_recipeId',(q)=>q.eq('userId',args.userId).eq('recipeId',args.recipeId)).first()
        if(favourites){
            return true
        }else{
            return false
        }
    }
})

export const addCollections = mutation({
    args:{
        userId:v.string(),
        name:v.string(),
        description:v.optional(v.string()),
        emoji:v.optional(v.string()),
        recipeId:v.array(v.id('recipes')),
        updatedAt:v.number()
    },
    handler:async(ctx ,args)=>{
        const collection = await ctx.db.insert('collections',{
            userId:args.userId,
            name:args.name,
            description:args.description,
            emoji:args.emoji,
            recipeIds:args.recipeId ?? [] ,
            updatedAt:args.updatedAt
        })
        return collection
    }
})

export const addRecipetoCollection = mutation({
    args:{
        userId:v.string(),
        collectionId:v.id('collections'),
        recipeId:v.id('recipes')
    },
    handler:async (ctx ,args)=>{
        const collection = await ctx.db.get(args.collectionId);
        if(!collection){
            throw new Error('collection not found')
        }
        const existing = collection.recipeIds.includes(args.recipeId)
        if(existing){
          const remove =  collection.recipeIds.filter((id)=> id !== args.recipeId)
          await ctx.db.patch(args.collectionId,{
            recipeIds:remove,
            updatedAt:Date.now()
          })
          return args.collectionId
        }else {
        const update = [...collection.recipeIds,args.recipeId]
        await ctx.db.patch(args.collectionId,{
            recipeIds:update,
            updatedAt:Date.now()
        })
        return args.collectionId
    }
    }
})

export const getcollections = query({
    args:{userId:v.string()},
    handler: async(ctx ,args)=>{
        const collections = await ctx.db.query('collections')
         .withIndex('by_userId',(q)=>q.eq('userId',args.userId)).collect()

        return collections
    }
})

export const deleteCollection = mutation({
    args:{id:v.id('collections')},
    handler: async(ctx ,args)=>{
        await ctx.db.delete(args.id)
        return {success:true}
    }
})

export const getCollectionId = query({
    args:{id:v.id('collections')},
    handler: async(ctx ,args)=>{
        const collection = await ctx.db.get(args.id)
        if(!collection){
            throw new Error('collection not found')
        }
        const collectionswithrecipes = await Promise.all(
            collection.recipeIds.map(async(r)=>{
                const recipe = await ctx.db.get(r)
                return {...recipe}
            })
        )
        return {
            ...collection,
            recipes:collectionswithrecipes
        }
    }
})