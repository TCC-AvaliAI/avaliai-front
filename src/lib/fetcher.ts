import api from "./axios";

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export const fetcher = async (path: string, options?: RequestInit): Promise<any> => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    throw error;
  }
};
