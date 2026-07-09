import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import Slack from "@auth/core/providers/slack";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password, 
    Google({
      allowDangerousEmailAccountLinking: true,
    }), 
    Slack
  ],
});
