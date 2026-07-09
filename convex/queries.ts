import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { auth } from "./auth";

export const getLearnedWords = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.userId) throw new Error("Unauthorized");
    return await ctx.db
      .query("learned_words")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

export const getLearnedWordsCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.userId) throw new Error("Unauthorized");
    const words = await ctx.db
      .query("learned_words")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
    return words.length;
  },
});

export const getWordOfTheDay = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.userId) throw new Error("Unauthorized");
    return await ctx.db
      .query("word_of_the_day")
      .withIndex("by_date_id", (q) => q.eq("id", args.userId))
      .unique();
  },
});

export const addLearnedWord = mutation({
  args: {
    user_id: v.optional(v.string()),
    word: v.string(),
    part_of_speech: v.optional(v.string()),
    definition: v.optional(v.string()),
    example: v.optional(v.string()),
    show_name: v.optional(v.string()),
    platform: v.optional(v.string()),
    thumbnailimg: v.optional(v.string()),
    timeTracked: v.optional(v.string()),
    season: v.optional(v.string()),
    episode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.insert("learned_words", { ...args, user_id: userId });
  },
});

export const updateWordOfTheDay = mutation({
  args: {
    id: v.string(),
    word: v.string(),
    phonetic: v.optional(v.string()),
    phonetics: v.optional(v.any()),
    meanings: v.optional(v.any()),
    updated_at: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.id) throw new Error("Unauthorized");
    const existing = await ctx.db
      .query("word_of_the_day")
      .withIndex("by_date_id", (q) => q.eq("id", args.id))
      .first();
    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("word_of_the_day", args);
    }
  },
});

export const updateLearnedWord = mutation({
  args: {
    id: v.id("learned_words"),
    part_of_speech: v.optional(v.string()),
    definition: v.optional(v.string()),
    example: v.optional(v.string()),
    group_name: v.optional(v.string()),
    // Add other fields as needed
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.user_id !== userId) throw new Error("Unauthorized");
    const { id, ...data } = args;
    return await ctx.db.patch(id, data);
  }
});

export const deleteLearnedWord = mutation({
  args: {
    id: v.id("learned_words")
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.user_id !== userId) throw new Error("Unauthorized");
    return await ctx.db.delete(args.id);
  }
});

export const sendFriendRequest = mutation({
  args: {
    sender_id: v.optional(v.string()),
    receiver_id: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Check if a request already exists in either direction
    const sent = await ctx.db
      .query("friend_requests")
      .withIndex("by_sender", (q) => q.eq("sender_id", userId))
      .filter((q) => q.eq(q.field("receiver_id"), args.receiver_id))
      .first();

    const received = await ctx.db
      .query("friend_requests")
      .withIndex("by_receiver", (q) => q.eq("receiver_id", userId))
      .filter((q) => q.eq(q.field("sender_id"), args.receiver_id))
      .first();

    const existingRequest = sent || received;

    if (existingRequest) {
      if (existingRequest.status === "pending" || existingRequest.status === "accepted") {
        throw new Error("Request already exists");
      }
      // If it was rejected, we can update it to pending again and flip the sender/receiver if needed
      await ctx.db.patch(existingRequest._id, { 
        status: "pending",
        sender_id: userId,
        receiver_id: args.receiver_id
      });
      return existingRequest._id;
    }

    return await ctx.db.insert("friend_requests", {
      receiver_id: args.receiver_id,
      status: "pending",
      sender_id: userId
    });
  }
});

export const saveOnboarding = mutation({
  args: {
    id: v.string(),
    selected_platform: v.string(),
    learning_goal: v.string(),
    daily_time: v.string(),
    proficiency_level: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.id) throw new Error("Unauthorized");
    const existing = await ctx.db
      .query("onboarding")
      .withIndex("by_user_id", (q) => q.eq("id", args.id))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("onboarding", args);
    }
  }
});

export const getFriends = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    // Fetch friend requests where the user is sender or receiver
    const sent = await ctx.db
      .query("friend_requests")
      .withIndex("by_sender", (q) => q.eq("sender_id", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const received = await ctx.db
      .query("friend_requests")
      .withIndex("by_receiver", (q) => q.eq("receiver_id", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // Extract friend IDs
    const friendIds = new Set<string>();
    sent.forEach((req) => friendIds.add(req.receiver_id));
    received.forEach((req) => friendIds.add(req.sender_id));

    // Fetch user details for each friend
    const friends = [];
    for (const friendId of friendIds) {
      // @ts-ignore
      const friend = await ctx.db.get(friendId as Id<"users">);
      if (friend) {
        friends.push({
          id: friend._id,
          name: friend.name,
          email: friend.email,
          image: friend.image,
        });
      }
    }

    return friends;
  },
});

export const getAllFriendRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const sent = await ctx.db
      .query("friend_requests")
      .withIndex("by_sender", (q) => q.eq("sender_id", userId))
      .collect();

    const received = await ctx.db
      .query("friend_requests")
      .withIndex("by_receiver", (q) => q.eq("receiver_id", userId))
      .collect();

    return [...sent, ...received];
  },
});

export const getPendingReceivedRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const received = await ctx.db
      .query("friend_requests")
      .withIndex("by_receiver", (q) => q.eq("receiver_id", userId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    const requestsWithSenders = [];
    for (const req of received) {
      // @ts-ignore
      const sender = await ctx.db.get(req.sender_id as Id<"users">);
      if (sender) {
        requestsWithSenders.push({
          _id: req._id,
          sender_id: sender._id,
          sender_name: sender.name,
          sender_email: sender.email,
          sender_image: sender.image,
          status: req.status,
        });
      }
    }

    return requestsWithSenders;
  },
});

export const respondToFriendRequest = mutation({
  args: {
    requestId: v.id("friend_requests"),
    status: v.string(), // "accepted" or "rejected"
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");

    if (request.receiver_id !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.requestId, { status: args.status });
    return { success: true };
  },
});

export const removeFriend = mutation({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const sent = await ctx.db
      .query("friend_requests")
      .withIndex("by_sender", (q) => q.eq("sender_id", userId))
      .filter((q) => q.eq(q.field("receiver_id"), args.friendId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const received = await ctx.db
      .query("friend_requests")
      .withIndex("by_receiver", (q) => q.eq("receiver_id", userId))
      .filter((q) => q.eq(q.field("sender_id"), args.friendId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    for (const request of [...sent, ...received]) {
      await ctx.db.delete(request._id);
    }
    
    return { success: true };
  },
});

export const cancelFriendRequest = mutation({
  args: {
    receiverId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const requests = await ctx.db
      .query("friend_requests")
      .withIndex("by_sender", (q) => q.eq("sender_id", userId))
      .filter((q) => q.eq(q.field("receiver_id"), args.receiverId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    for (const request of requests) {
      await ctx.db.delete(request._id);
    }

    return { success: true };
  },
});


