export async function blockedGateway(surface: string): Promise<Response | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("maya_gateway_access_state")
    .select("status,message")
    .eq("surface", surface)
    .maybeSingle();
  if (error)
    return Response.json(
      { message: "Maya cannot check service access right now. Please try later." },
      { status: 503 },
    );
  return data ? Response.json({ message: data.message }, { status: data.status }) : null;
}
export async function rememberBlock(surface: string, response: Response) {
  if (response.status !== 402 && response.status !== 403) return;
  const body = (await response
    .clone()
    .json()
    .catch(() => ({}))) as { message?: string; error?: { message?: string } };
  const message =
    body.message ??
    body.error?.message ??
    "Maya's AI access is paused. The website owner needs to restore access.";
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("maya_gateway_access_state")
    .upsert({ surface, status: response.status, message });
  if (error) throw new Error("Could not record paused AI access.");
}
export function validateOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin && origin !== new URL(request.url).origin
    ? Response.json({ message: "Please use Maya from this website." }, { status: 403 })
    : null;
}
