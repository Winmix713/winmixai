import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify user is admin
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user profile to check role
    const { data: profile } = await supabaseClient
      .from("user_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden - Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { modelId } = await req.json();
    if (!modelId) {
      return new Response(JSON.stringify({ error: "Model ID required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the model exists
    const { data: targetModel, error: fetchError } = await supabaseClient
      .from("model_registry")
      .select("*")
      .eq("id", modelId)
      .single();

    if (fetchError || !targetModel) {
      return new Response(JSON.stringify({ error: "Model not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Demote all current champions
    const { error: demoteError } = await supabaseClient
      .from("model_registry")
      .update({
        model_type: "retired",
        traffic_allocation: 0,
        is_active: false,
      })
      .eq("model_type", "champion");

    if (demoteError) throw demoteError;

    // Promote the new model
    const { error: promoteError } = await supabaseClient
      .from("model_registry")
      .update({
        model_type: "champion",
        traffic_allocation: 90,
        is_active: true,
      })
      .eq("id", modelId);

    if (promoteError) throw promoteError;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Model ${targetModel.model_name} promoted to champion`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
