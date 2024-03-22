import axios from "axios";

export const useAxios = () => {
  const instance = axios.create({
    baseURL: "https://artisian-academy-server.onrender.com/api/v1",
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error); // Pass the error along to the .catch() block
    }
  );

  /**
   * @param token
   */
  const setBearerToken = (token) => {
    // token = '39|SLjXACJQx4t9XEfC4ICnBjyoVZMvKpZbfUZ33YW3'
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };
  /**
   * @param token
   */

  /**
   * @param url
   * @param formData
   * @param config Optional configuration for the request
   */
  const post = (url, formData) => {
    return instance.post(url, formData);
  };

  /**
   * @param url
   * @param formData
   */
  const put = (url, formData) => {
    return instance.put(url, formData);
  };

  /**
   * @param url
   * @param formData
   */
  const patch = (url, formData) => {
    return instance.patch(url, formData);
  };

  /**
   * @param url
   */
  const get = (url) => {
    return instance.get(url);
  };

  /**
   * @param url
   */
  const deleteRequest = (url) => {
    return instance.delete(url);
  };

  return {
    post,
    put,
    get,
    patch,
    deleteRequest,
    setBearerToken,
  };
};
