import Repository from "./Repository";

class ConfigRepository extends Repository {
  private static instance: ConfigRepository;
  static BASE_URL: string = "https://llcode.tech/api/config";

  private constructor() {
    super();
  }

  static getInstance(): ConfigRepository {
    if (!ConfigRepository.instance)
      ConfigRepository.instance = new ConfigRepository();
    return ConfigRepository.instance;
  }

  async get(key: string): Promise<string> {
    const url = `${ConfigRepository.BASE_URL}/${key}`;
    const options = ConfigRepository.options("GET");
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error("Error:", error);
      return "";
    }
  }
}

export default ConfigRepository;
