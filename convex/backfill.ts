import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";
export const backfill= action({
    args:{
        count: v.number(),
    },
    handler: async (ctx,args)=>{
        const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY!;
        const url = `https://api.spoonacular.com/recipes/random?number=${args.count}&includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if( !data.recipes || data.recipes.length === 0){
            throw new Error("No recipes found");
        }
        const results =[];
        for(const recipe of data.recipes){
            try{
                const transformedRecipe = transformRecipe(recipe);
                const recipeId:string = await ctx.runMutation(internal.recipe.createRecipe, {recipe: transformedRecipe});
                results.push({
                    success:true,
                    recipeId,
                    title:recipe.title
                });
            }catch(error){
                results.push({
                    success:false,
                    error: (error as Error).message,
                    title:recipe.title
                });
            }
        }
        return {
            total:data.recipes.length,
            successful: results.filter(r=>r.success).length,
            failed: results.filter(r=>!r.success).length,
            results,
        }

    }
})

function transformRecipe(recipe:any){
    return{
        externalId: recipe.id?.toString(),
        title: recipe.title,
        description:recipe.summary?.replace(/<[^>]+>/g, '').substring(0,500),
        imageUrl:recipe.image,
        servings:recipe.servings||4,
        prepTime:recipe.preparationMinutes||0,
        cookTime:recipe.cookingMinutes||0,
        totalTime:recipe.readyInMinutes||0,
        difficulty:mapDifficulty(recipe.readyInMinutes),
        ingredients:recipe.extendedIngredients?.map((ing:any)=>({
            name:ing.nameClean ||ing.name,
            amount:ing.measures?.us?.amount || ing.amount,
            unit:ing.measures?.us?.unitShort || ing.unit||'',
            notes:ing.originalName || undefined,
        })) ||[],
        instruction: transformInstructions(recipe.analyzedInstructions?.[0]?.steps||[]),
        nutrition: extractNutrition(recipe.nutrition),
        mealType:recipe.dishTypes ||[],
        cuisineType:recipe.cuisines?.[0]||'International',
        dishType:recipe.dishTypes||[],
        dietaryTags:recipe.diets||[],
        source:'api' as const,
        sourceUrl:recipe.sourceUrl,
        sourceName:recipe.sourceName,
        viewCounts:0,
        favoriteCount:0,
        cookCount:0,
        averageRating: undefined,
        videoUrl:undefined,
        videoThumbnailUrl:undefined,
        createdAt:Date.now(),
        updatedAt:Date.now(),        
    };
}

function mapDifficulty(totalTime:number):'easy'|'medium'|'hard'{
    if(totalTime<=30)return 'easy';
    if(totalTime<=60)return 'medium';
    return 'hard';
}

function transformInstructions(steps:any[]){
    return steps.map((step,index)=>({
        stepNumber: step.number || index +1,
        instruction:step.step,
        duration:step.length?.number ||undefined,
        imageUrl:undefined,
    }));
}

function extractNutrition(nutrition:any){
    if(!nutrition || !nutrition.nutrients){
        return{
            calories: 0,
           protein: 0,
          carbs: 0,
             fat: 0,
           fiber: undefined,
            sugar: undefined,
             sodium: undefined,
            cholesterol: undefined
        }
    }
    const nutrients = nutrition.nutrients;
  
  // More precise nutrient mapping
  const nutrientMap: {[key: string]: string[]} = {
    calories: ['calories'],
    protein: ['protein'],
    carbs: ['carbohydrates', 'carbohydrate'],
    fat: ['fat'],
    fiber: ['fiber'],
    sugar: ['sugar'],
    sodium: ['sodium'],
    cholesterol: ['cholesterol']
  };

  const result: any = {};
  
  Object.entries(nutrientMap).forEach(([key, names]) => {
    for (const name of names) {
      const nutrient = nutrients.find((n: any) => 
        n.name.toLowerCase().includes(name.toLowerCase())
      );
      if (nutrient) {
        let value = nutrient.amount || 0;
        // Round appropriately
        if (['calories', 'sodium', 'cholesterol'].includes(key)) {
          value = Math.round(value);
        } else {
          value = Math.round(value * 10) / 10; // One decimal place
        }
        result[key] = value;
        break;
      }
       }
     });

      return {
        calories: result.calories || 0,
       protein: result.protein || 0,
        carbs: result.carbs || 0,
       fat: result.fat || 0,
       fiber: result.fiber || undefined,
      sugar: result.sugar || undefined,
      sodium: result.sodium || undefined,
      cholesterol: result.cholesterol || undefined
  };
}