// frontend/src/services/api.js

// ใช้ API Proxy ภายในเว็บแอพตัวเองแทนการเรียก backend โดยตรง
// ไม่ต้องระบุ protocol และ domain เพราะเรียกใน origin เดียวกัน
const API_URL = "/api";

// ตรวจสอบว่าไม่มีการใช้ URL เต็มในการเรียก API
if (API_URL.includes("://")) {
  console.error(
    "[API Service] WARNING: API_URL should not contain protocol and domain. Use relative path instead."
  );
}

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
      // ตัด / ข้างหน้าออก (ถ้ามี) เพื่อป้องกันการซ้ำซ้อน
      const cleanEndpoint = endpoint.replace(/^\//, "");
      const fullUrl = `${API_URL}/${cleanEndpoint}`;
      console.log(`[API Service] Making GET request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          try {
            userInfo = JSON.parse(user);
          } catch (e) {
            console.error(
              "[API Service] Error parsing user data from localStorage:",
              e
            );
          }
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

      // ตรวจสอบสถานะ response
      if (!response.ok) {
        // ถ้าเป็น 401 หรือ 403 ให้แสดงข้อความที่เป็นมิตรกับผู้ใช้
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
          };
        }

        // พยายามอ่านข้อความ error จาก JSON
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Error ${response.status}: ${response.statusText}`
          );
        } catch (jsonError) {
          // ถ้าไม่สามารถอ่าน JSON ได้ ใช้ข้อความ error จาก response
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      // ตรวจสอบ Content-Type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
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

      // อ่านข้อมูล JSON
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[API Service] GET Error (${endpoint}):`, error);
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
      // ตัด / ข้างหน้าออก (ถ้ามี) เพื่อป้องกันการซ้ำซ้อน
      const cleanEndpoint = endpoint.replace(/^\//, "");
      const fullUrl = `${API_URL}/${cleanEndpoint}`;
      console.log(`[API Service] Making POST request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          try {
            userInfo = JSON.parse(user);
          } catch (e) {
            console.error(
              "[API Service] Error parsing user data from localStorage:",
              e
            );
          }
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

      // ตรวจสอบสถานะ response
      if (!response.ok) {
        // ถ้าเป็น 401 หรือ 403 ให้แสดงข้อความที่เป็นมิตรกับผู้ใช้
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
          };
        }

        // พยายามอ่านข้อความ error จาก JSON
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Error ${response.status}: ${response.statusText}`
          );
        } catch (jsonError) {
          // ถ้าไม่สามารถอ่าน JSON ได้ ใช้ข้อความ error จาก response
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      // ตรวจสอบ Content-Type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
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

      // อ่านข้อมูล JSON
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[API Service] POST Error (${endpoint}):`, error);
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
      // ตัด / ข้างหน้าออก (ถ้ามี) เพื่อป้องกันการซ้ำซ้อน
      const cleanEndpoint = endpoint.replace(/^\//, "");
      const fullUrl = `${API_URL}/${cleanEndpoint}`;
      console.log(`[API Service] Making PUT request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          try {
            userInfo = JSON.parse(user);
          } catch (e) {
            console.error(
              "[API Service] Error parsing user data from localStorage:",
              e
            );
          }
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

      // ตรวจสอบสถานะ response
      if (!response.ok) {
        // ถ้าเป็น 401 หรือ 403 ให้แสดงข้อความที่เป็นมิตรกับผู้ใช้
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
          };
        }

        // พยายามอ่านข้อความ error จาก JSON
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Error ${response.status}: ${response.statusText}`
          );
        } catch (jsonError) {
          // ถ้าไม่สามารถอ่าน JSON ได้ ใช้ข้อความ error จาก response
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      // ตรวจสอบ Content-Type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
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

      // อ่านข้อมูล JSON
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[API Service] PUT Error (${endpoint}):`, error);
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
      // ตัด / ข้างหน้าออก (ถ้ามี) เพื่อป้องกันการซ้ำซ้อน
      const cleanEndpoint = endpoint.replace(/^\//, "");
      const fullUrl = `${API_URL}/${cleanEndpoint}`;
      console.log(`[API Service] Making DELETE request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          try {
            userInfo = JSON.parse(user);
          } catch (e) {
            console.error(
              "[API Service] Error parsing user data from localStorage:",
              e
            );
          }
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

      // ตรวจสอบสถานะ response
      if (!response.ok) {
        // ถ้าเป็น 401 หรือ 403 ให้แสดงข้อความที่เป็นมิตรกับผู้ใช้
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
          };
        }

        // พยายามอ่านข้อความ error จาก JSON
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Error ${response.status}: ${response.statusText}`
          );
        } catch (jsonError) {
          // ถ้าไม่สามารถอ่าน JSON ได้ ใช้ข้อความ error จาก response
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      // ตรวจสอบ Content-Type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
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

      // อ่านข้อมูล JSON
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[API Service] DELETE Error (${endpoint}):`, error);
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
      // ตัด / ข้างหน้าออก (ถ้ามี) เพื่อป้องกันการซ้ำซ้อน
      const cleanEndpoint = endpoint.replace(/^\//, "");
      const fullUrl = `${API_URL}/${cleanEndpoint}`;
      console.log(`[API Service] Making download request to: ${fullUrl}`);

      // ดึงข้อมูลผู้ใช้จาก localStorage
      let userInfo = {};
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          try {
            userInfo = JSON.parse(user);
          } catch (e) {
            console.error(
              "[API Service] Error parsing user data from localStorage:",
              e
            );
          }
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
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(`[API Service] Download Error (${endpoint}):`, error);
      throw error;
    }
  },
};
