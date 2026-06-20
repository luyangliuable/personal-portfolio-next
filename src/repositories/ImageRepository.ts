import { API_BASE_URL } from "../config/api";
import Repository from "./Repository";

class ImageRepository extends Repository {
    private static instance: ImageRepository | null = null;
    private cache = new Map<string, string>();
    private ongoingRequests = new Map<string, Promise<string>>();
    private static BASE_URL: string = `${API_BASE_URL}/image/`;

    private constructor() {
        super();
    }

    static getInstance(): ImageRepository {
        if (!ImageRepository.instance)
            ImageRepository.instance = new ImageRepository();
        return ImageRepository.instance;
    }

    getImageUrl(idOrUrl: string, compression?: number): string {
        if (idOrUrl.startsWith("/static")) return idOrUrl;

        let url = idOrUrl;
        if (!idOrUrl.startsWith("http://") && !idOrUrl.startsWith("https://"))
            url = `${ImageRepository.BASE_URL}${idOrUrl}`;

        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}compression=${compression ?? 100}`;
    }

    async getImageById(idOrUrl: string, compression?: number): Promise<string> {
        if (idOrUrl === null) console.error("no image id provided");
        const url = this.getImageUrl(idOrUrl, compression);
        if (this.cache.has(url)) return this.cache.get(url)!;
        if (this.ongoingRequests.has(url))
            return this.ongoingRequests.get(url)!;
        const fetchImage = async () => {
            try {
                const response = await fetch(url, {
                    headers: {},
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const blob = await response.blob();
                const imageURL = URL.createObjectURL(blob);
                this.cache.set(url, imageURL);
                this.ongoingRequests.delete(url);
                return imageURL;
            } catch (error) {
                console.error("Error fetching image:", error, url);
                this.ongoingRequests.delete(url);
                throw error;
            }
        };
        const fetchPromise = fetchImage();
        this.ongoingRequests.set(url, fetchPromise);
        return fetchPromise;
    }
    catch(error: Error) {
        console.error("Error fetching image:", error);
        throw error;
    }
}

export default ImageRepository;
