import { google } from "@ai-sdk/google";
import { Agent, vStreamArgs } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";


const whisky = new Agent(components.agent,{
    name: 'whisky',
    languageModel:google('gemini-2.5-flash'),
    
    instructions: 'you are an assistant ',
    //to do to add tools
    maxSteps:10,
})

//we are creating a thread 
export const createThread = mutation({
    args:{userId:v.string(), title: v.optional(v.string())},
    handler: async(ctx,args)=>{
        const threadId = await whisky.createThread(ctx,{userId: args.userId, title:args.title })
        return threadId
    }
})

export const chat = action({
    args:{threadId:v.string(),message:v.string()},
    handler: async(ctx,args)=>{
        const {thread} = await whisky.continueThread(ctx,{
            threadId:args.threadId
        })   
        const response = await thread.streamText(
            {
            prompt:args.message
        },
        {
            saveStreamDeltas:{
                chunking:'line'
            }
        }
    )

    await response.consumeStream();
    }
})

export const listMessages = query({
    args:{
        threadId:v.string(),
        paginationOpts:paginationOptsValidator,
        streamArgs: vStreamArgs,
    },
    handler: async(ctx,args)=>{
        //to do check if the user is the owner of the thread

        const messages = await whisky.listMessages(ctx,{
            threadId:args.threadId,
          paginationOpts:args.paginationOpts
        })
        const streams = await whisky.syncStreams(ctx,{
            threadId:args.threadId,
            streamArgs:args.streamArgs
        })

        return {
            ...messages,
            streams
        }
    }
})

