// frontend/src/services/api.js

// ใช้ API Proxy ภายในเว็บแอพตัวเองแทนการเรียก backend โดยตรง
const API_URL = "/api";
console.log("[API Service] Using API URL:", API_URL);

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
      console.log(`Making GET request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          userInfo = JSON.parse(user);
        }
      }

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // ส่งข้อมูลคณะของผู้ใช้ใน header เพื่อใช้ในการกรองข้อมูล
          "X-User-Faculty": userInfo.staff_faculty || "",
          "X-User-ID": userInfo.staff_id || "",
        },
      });

      // ตรวจสอบ Content-Type
      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        console.error(`[API Service] Non-JSON response type: ${contentType}`);
        // ดึงข้อมูล response เพื่อดูเนื้อหา
        const text = await response.text();
        console.error(
          `[API Service] Response text (first 100 chars): ${text.substring(
            0,
            100
          )}`
        );
        throw new Error(`Received non-JSON response: ${contentType}`);
      }

      if (!response.ok) {
        // ถ้าเป็น 401 หรือ 403 ให้แสดงข้อความที่เป็นมิตรกับผู้ใช้
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
          };
        }

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
      console.log(`Making POST request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          userInfo = JSON.parse(user);
        }
      }

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ส่งข้อมูลคณะของผู้ใช้ใน header
          "X-User-Faculty": userInfo.staff_faculty || "",
          "X-User-ID": userInfo.staff_id || "",
        },
        body: JSON.stringify(data),
      });

      // ตรวจสอบ Content-Type
      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        console.error(`[API Service] Non-JSON response type: ${contentType}`);
        // ดึงข้อมูล response เพื่อดูเนื้อหา
        const text = await response.text();
        console.error(
          `[API Service] Response text (first 100 chars): ${text.substring(
            0,
            100
          )}`
        );
        throw new Error(`Received non-JSON response: ${contentType}`);
      }

      if (!response.ok) {
        // ถ้าเป็น 401 หรือ 403 ให้แสดงข้อความที่เป็นมิตรกับผู้ใช้
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
          };
        }

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
      console.log(`Making PUT request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          userInfo = JSON.parse(user);
        }
      }

      const response = await fetch(fullUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // ส่งข้อมูลคณะของผู้ใช้ใน header
          "X-User-Faculty": userInfo.staff_faculty || "",
          "X-User-ID": userInfo.staff_id || "",
        },
        body: JSON.stringify(data),
      });

      // ตรวจสอบ Content-Type
      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        console.error(`[API Service] Non-JSON response type: ${contentType}`);
        // ดึงข้อมูล response เพื่อดูเนื้อหา
        const text = await response.text();
        console.error(
          `[API Service] Response text (first 100 chars): ${text.substring(
            0,
            100
          )}`
        );
        throw new Error(`Received non-JSON response: ${contentType}`);
      }

      if (!response.ok) {
        // ถ้าเป็น 401 หรือ 403 ให้แสดงข้อความที่เป็นมิตรกับผู้ใช้
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
          };
        }

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
      console.log(`Making DELETE request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          userInfo = JSON.parse(user);
        }
      }

      const response = await fetch(fullUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // ส่งข้อมูลคณะของผู้ใช้ใน header
          "X-User-Faculty": userInfo.staff_faculty || "",
          "X-User-ID": userInfo.staff_id || "",
        },
      });

      // ตรวจสอบ Content-Type
      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        console.error(`[API Service] Non-JSON response type: ${contentType}`);
        // ดึงข้อมูล response เพื่อดูเนื้อหา
        const text = await response.text();
        console.error(
          `[API Service] Response text (first 100 chars): ${text.substring(
            0,
            100
          )}`
        );
        throw new Error(`Received non-JSON response: ${contentType}`);
      }

      if (!response.ok) {
        // ถ้าเป็น 401 หรือ 403 ให้แสดงข้อความที่เป็นมิตรกับผู้ใช้
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
          };
        }

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
      console.log(`Making download request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          userInfo = JSON.parse(user);
        }
      }

      const response = await fetch(fullUrl, {
        headers: {
          // ส่งข้อมูลคณะของผู้ใช้ใน header
          "X-User-Faculty": userInfo.staff_faculty || "",
          "X-User-ID": userInfo.staff_id || "",
        },
      });

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
