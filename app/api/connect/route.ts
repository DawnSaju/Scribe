import { NextResponse } from 'next/server';
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export async function POST() {
  try {
    const token = await convexAuthNextjsToken();
    const user = await fetchQuery(api.users.current, {}, { token });

    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    await fetchMutation(api.users.updateUserMetadata, { isConnected: true }, { token });

    return NextResponse.json({ userId: user._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
