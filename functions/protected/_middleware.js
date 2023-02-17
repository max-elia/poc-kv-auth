export async function onRequest(context) {
    const { request, next, env } = context;
    try {
        const cookie = request.headers.get("cookie") || "";

        // Get session_id from cookie.
        const session_id = cookie.split("session_id=")[1].split(";")[0];
        if (session_id) {
            // Get User Email from session_id KV
            const userEmail = await env.KV_AUTH.get(`session_id:${session_id}`);
            // Get User object
            const user = await env.KV_AUTH.get(`user:${userEmail}`, "json");
            if (user) {
                // Cookie is valid. Continue to protected route.
                const html = await next();
                // eslint-disable-next-line no-undef
                const result = await new HTMLRewriter()
                    .on("#user", {
                        element(element) {
                            element.setInnerContent(`Hello, ${user.firstname ? user.firstname : user.email}!`);
                        },
                    })
                    .transform(html);
                // Add no-cache headers
                result.headers.set("Cache-Control", "no-cache no-store must-revalidate");
                return result;
            }
        }
        throw new Error("User not logged in");
    } catch (e) {
        return new Response(e.message, {
            status: 302,
            statusText: e.message,
            headers: {
                location: "/",
            },
        });
    }
}
