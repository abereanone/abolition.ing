export default {
  async fetch(request, env) {
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }

      const url = new URL(request.url);
      const notFoundUrl = new URL("/404.html", url.origin);
      const notFoundResponse = await env.ASSETS.fetch(
        new Request(notFoundUrl.toString(), request),
      );

      if (notFoundResponse.status !== 404) {
        return new Response(notFoundResponse.body, {
          status: 404,
          headers: notFoundResponse.headers,
        });
      }

      return response;
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("Internal error", { status: 500 });
    }
  },
};
