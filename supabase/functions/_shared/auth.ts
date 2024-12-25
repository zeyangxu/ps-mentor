import { createClient } from "jsr:@supabase/supabase-js@2";

export async function getUserInfo(req: Request) {
    const authHeader = req.headers.get("Authorization")!;
    console.log("Edge Function: Auth header present:", !!authHeader);

    const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } },
    );

    // Get the session or user object
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    return {userInfo: userData.user, supabaseClient};
}
