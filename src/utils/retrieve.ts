// utils -> retrieve.ts

export default async (
  url: string,
  fetcher: (url: string) => Promise<Response>,
): Promise<ArrayBuffer> => {
  const res = await fetcher(url);

  const status = res.status;
  if (status >= 400) {
    throw new Error(`Request failed with error code ${status}`);
  }
  const buffer = await res.arrayBuffer();
  return buffer;
};
