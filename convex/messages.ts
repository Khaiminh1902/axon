import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get messages
export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").order("desc").collect();
  },
});

// Send message
export const sendMessage = mutation({
  args: {
    text: v.string(),
    sender: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      text: args.text,
      sender: args.sender,
      createdAt: Date.now(),
    });
  },
});
