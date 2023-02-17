const COOKIE_TTL = 60 * 60 * 24 * 7; // After 7 days session KV entry will be deleted.

export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const body = await readRequestBody(request);
        const email = body.email;
        const password = body.password;

        const pepper = await env.SECRET;
        const user = await env.KV_AUTH.get(`user:${email}`, "json");
        if (!user) {
            throw new Error("E-Mail or password is incorrect");
        }
        const hash = user.token;

        if (await verifyPw(hash, password, pepper)) {
            const session_id = crypto.randomUUID();

            await env.KV_AUTH.put(`session_id:${session_id}`, email, {
                expirationTtl: COOKIE_TTL,
            });

            return new Response(null, {
                status: 302,
                statusText: "Logged in successfully",
                headers: {
                    location: "/protected",
                    "set-cookie": `session_id=${session_id}; Secure; HttpOnly; Path=/; SameSite=Strict`,
                },
            });
        }
        throw new Error("E-Mail or password is incorrect");
    } catch (e) {
        return new Response(e.message, {
            status: 302,
            statusText: "User registration failed",
            headers: {
                location: "/login",
            },
        });
    }
}

/**
 * @param {string} hash
 * @param {string} password
 * @param {string} pepper
 */
async function verifyPw(hash, password, pepper) {
    // Decode oldCombined Hash from base64 string to Uint8Array
    const combinedOld = Uint8Array.from(atob(hash), (c) => c.charCodeAt(0));

    // Get salt from combined hash
    const salt = combinedOld.slice(0, 16);

    // Get hash from combined hash
    const oldHash = combinedOld.slice(16);

    // Combine given password and pepper with salt from old hash
    password = new TextEncoder().encode(password);
    pepper = new TextEncoder().encode(pepper);
    const combined = new Uint8Array(salt.length + pepper.length + password.length);
    combined.set(salt);
    combined.set(pepper, salt.length);
    combined.set(password, salt.length + pepper.length);

    const newHash = await crypto.subtle.digest("SHA-256", combined);

    // Compare new hash with old hash
    return areUint8ArraysEqual(new Uint8Array(newHash), oldHash);
}

function areUint8ArraysEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
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
