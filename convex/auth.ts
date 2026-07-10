import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./ResendOTP";
import Google from "@auth/core/providers/google";
import Slack from "@auth/core/providers/slack";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ResendOTP(),
    Google({
      allowDangerousEmailAccountLinking: true,
    }), 
    Slack
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      const user = await ctx.db.get(args.userId);
      if (user && (!user.name || user.name.trim() === '')) {
        const fallbackName = typeof user.email === 'string' ? user.email.split("@")[0] : "Learner";
        await ctx.db.patch(args.userId, {
          name: fallbackName,
        });
      }
    }
  }
});
