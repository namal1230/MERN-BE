import axios, { AxiosInstance } from "axios";

const unsplash: AxiosInstance = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
  },
});

export interface UnsplashImage {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export const searchImages = async (
  query: string,
  page: number = 1
): Promise<UnsplashSearchResponse> => {
  const res = await unsplash.get<UnsplashSearchResponse>(
    "/search/photos",
    {
      params: {
        query,
        page,
        per_page: 12,
      },
    }
  );

  return res.data;
};
