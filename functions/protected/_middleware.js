export async function onRequest(context) {
    const { request, next, env } = context;
    try {
        const cookie = request.headers.get("cookie") || "";

        // Get session_id from cookie.
        const session_id = cookie.split("session_id=")[1].split(";")[0];
        console.log(session_id);
        if (session_id) {
            // Get session_id from KV.
            const user = await env.KV_AUTH.get(`session_id:${session_id}`);

            if (user) {
                // Cookie is valid. Continue to protected route.
                const html = await next();
                // eslint-disable-next-line no-undef
                const result = await new HTMLRewriter()
                    .on("#user", {
                        element(element) {
                            element.setInnerContent(`Hello, ${user}!`);
                        },
                    })
                    .transform(html);
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
