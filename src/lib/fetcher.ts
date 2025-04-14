const apiBase = process.env.NEXT_PUBLIC_API_URL;

export const fetcher = async (
  path: string,
  options?: RequestInit
): Promise<any> => {
  try {
    const response = await fetch(`${apiBase}${path}`, options);
    return await response.json();
  } catch (error) {}
};
