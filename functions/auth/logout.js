export async function onRequest(context) {
    const { env, request } = context;

    try {
        const session_id = request.headers.get("cookie") || "";
        // const session_id = session_id.split("session_id=")[1].split(";")[0];
        await env.KV_AUTH.delete(`session_id:${session_id}`);

        return new Response(null, {
            status: 302,
            statusText: "Logged out successfully",
            headers: {
                location: "/",
                "set-cookie": `session_id=; Secure; HttpOnly; Path=/; Max-Age=0`,
            },
        });
    } catch (e) {
        return new Response(e.message, {
            status: 302,
            statusText: "Session id is invalid",
            headers: {
                location: "/",
            },
        });
    }
}
