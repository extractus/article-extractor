// tests/helpers.ts

export const createMockFetcher = (
  body: string,
  contentType: string,
  status = 200,
) => {
  return () =>
    Promise.resolve(
      new Response(body, {
        status,
        headers: { "content-type": contentType },
      }),
    );
};
