// frontend/src/services/api.js

// ใช้ API Proxy ภายในเว็บแอพตัวเองแทนการเรียก backend โดยตรง
// ไม่ต้องระบุ protocol และ domain เพราะเรียกใน origin เดียวกัน
const API_URL = "/api";

/**
 * พื้นฐานบริการเรียก API
 */
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - response data
   */
  async get(endpoint) {
    try {
      const fullUrl = `${API_URL}/${endpoint}`;
      console.log(`Making GET request to proxy: ${fullUrl}`);

      const response = await fetch(fullUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "มีข้อผิดพลาดเกิดขึ้น");
      }

      return await response.json();
    } catch (error) {
      console.error(`GET Error (${endpoint}):`, error);
      throw error;
    }
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - request body data
   * @returns {Promise} - response data
   */
  async post(endpoint, data) {
    try {
      const fullUrl = `${API_URL}/${endpoint}`;
      console.log(`Making POST request to proxy: ${fullUrl}`);

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "มีข้อผิดพลาดเกิดขึ้น");
      }

      return await response.json();
    } catch (error) {
      console.error(`POST Error (${endpoint}):`, error);
      throw error;
    }
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - request body data
   * @returns {Promise} - response data
   */
  async put(endpoint, data) {
    try {
      const fullUrl = `${API_URL}/${endpoint}`;
      console.log(`Making PUT request to proxy: ${fullUrl}`);

      const response = await fetch(fullUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "มีข้อผิดพลาดเกิดขึ้น");
      }

      return await response.json();
    } catch (error) {
      console.error(`PUT Error (${endpoint}):`, error);
      throw error;
    }
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - response data
   */
  async delete(endpoint) {
    try {
      const fullUrl = `${API_URL}/${endpoint}`;
      console.log(`Making DELETE request to proxy: ${fullUrl}`);

      const response = await fetch(fullUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "มีข้อผิดพลาดเกิดขึ้น");
      }

      return await response.json();
    } catch (error) {
      console.error(`DELETE Error (${endpoint}):`, error);
      throw error;
    }
  },

  /**
   * File download request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Blob for download
   */
  async downloadFile(endpoint) {
    try {
      const fullUrl = `${API_URL}/${endpoint}`;
      console.log(`Making download request to proxy: ${fullUrl}`);

      const response = await fetch(fullUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "มีข้อผิดพลาดในการดาวน์โหลดไฟล์");
      }

      return await response.blob();
    } catch (error) {
      console.error(`Download Error (${endpoint}):`, error);
      throw error;
    }
  },
};
