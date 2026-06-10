export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const hostnameParts = url.hostname.split(".");
    const subdomain = hostnameParts[0];

    if (
      subdomain === "www"
    ) {
      return new Response("Invalid subdomain", {
        status: 400,
      });
    }

    const pathname =
      url.pathname === "/"
        ? "/index.html"
        : url.pathname;

    const base =
      "https://s3.eu-north-1.amazonaws.com/rapidserve.surajv.dev/__outputs";

    const target =
      `${base}/${subdomain}${pathname}`;

    try {
      let response = await fetch(target, {
        cf: {
          cacheEverything: true,
          cacheTtl: 31536000,
        },
      });

      const isAsset = pathname.includes(".");

      // SPA fallback
      if (response.status === 404 && !isAsset) {
        response = await fetch(
          `${base}/${subdomain}/index.html`,
        );
      }

      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    } catch (err) {
      return new Response(
        `Worker Error: ${String(err)}`,
        {
          status: 500,
        },
      );
    }
  },
};