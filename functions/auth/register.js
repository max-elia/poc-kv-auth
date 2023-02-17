export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const body = await readRequestBody(request);

        const email = body.email;
        const password = body.password;

        const pepper = await env.SECRET;

        const hash = await hashPw(password, pepper);
        if (await env.KV_AUTH.get(`user:${email}`)) {
            throw new Error("This E-Mail is already registered");
        }
        await env.KV_AUTH.put(
            `user:${email}`,
            JSON.stringify({
                token: hash,
                email,
                firstname: body.firstname ? body.firstname : "",
                lastname: body.lastname ? body.lastname : "",
            })
        );

        return new Response(null, {
            status: 302,
            statusText: "User registered successfully",
            headers: {
                location: "/login",
            },
        });
    } catch (e) {
        return new Response("Error thrown " + e.message, {
            status: 401,
            statusText: "User registration failed",
        });
    }
}

async function hashPw(password, pepper) {
    // Create salt
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // Convert password and pepper to Uint8Array
    password = new TextEncoder().encode(password);
    pepper = new TextEncoder().encode(pepper);

    // Combine salt, pepper, and password hash
    const combined = new Uint8Array(salt.length + pepper.length + password.length);
    combined.set(salt);
    combined.set(pepper, salt.length);
    combined.set(password, salt.length + pepper.length);

    // Hash combined
    const hashBuffer = await crypto.subtle.digest("SHA-256", combined);

    // Convert hashBuffer to Uint8Array
    const hash = new Uint8Array(hashBuffer);

    // Combine salt and hash
    const combinedHash = new Uint8Array(salt.length + hash.length);
    combinedHash.set(salt);
    combinedHash.set(hash, salt.length);

    // Return combined hash as base64 string
    return btoa(new Uint8Array(combinedHash).reduce((s, b) => s + String.fromCharCode(b), ""));
}

async function readRequestBody(request) {
    const contentType = request.headers.get("content-type");
    if (contentType.includes("application/json")) {
        return await request.json();
    } else if (contentType.includes("form")) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
            body[entry[0]] = entry[1];
        }
        return body;
    }
    throw new Error("Content-Type not supported");
}
