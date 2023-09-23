class Request {
  private defaultOptions: RequestInit;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
    this.defaultOptions = {
      headers: {
        "Content-Type": "application/json"
      }
    };
  }

  private getRequestOptions(options: RequestInit = {}): RequestInit {
    const requestOptions: RequestInit = { ...this.defaultOptions, ...options };

    switch (options.method) {
      case "GET":
        break;

      case "POST":
      case "PUT":
        break;

      // 擴充自定義用，如上傳檔案
      case "UPLOAD":
        requestOptions.method = "POST";
        if (requestOptions.headers && "Content-Type" in requestOptions.headers) {
          delete requestOptions.headers["Content-Type"];
        }

      default:
        break;
    }

    return requestOptions;
  }

  async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const requestOptions = this.getRequestOptions(options);
    const url = this.baseUrl + path;

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Network Error", Error);
      throw error;
    }
  }
}

export default Request;
