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
      let userInfo = null;
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (isLoggedIn) {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            userInfo = JSON.parse(storedUser);
            console.log("User info:", userInfo);
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      const headers = {
        "Content-Type": "application/json",
      };

      // แก้ไขจากการใส่ X-User-ID ซ้ำกัน (bug ในโค้ดเดิม)
      if (userInfo && userInfo.staff_id) {
        headers["X-User-ID"] = userInfo.staff_id;
      }

      console.log("Request headers:", headers);

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: headers,
      });

      // เพิ่มการจัดการกรณี response.ok เป็นเท็จ (HTTP status ไม่อยู่ในช่วง 200-299)
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
            data: [],
          };
        }

        // พยายามอ่าน error message จาก response
        try {
          const errorData = await response.json();
          return {
            success: false,
            message: errorData.message || `HTTP error: ${response.status}`,
            data: [],
          };
        } catch (jsonError) {
          // กรณีที่ไม่สามารถอ่าน response เป็น JSON ได้
          return {
            success: false,
            message: `HTTP error: ${response.status}`,
            data: [],
          };
        }
      }

      // กรณีที่ response.ok เป็นจริง
      const data = await response.json();
      return data; // ส่งค่าที่ได้จาก backend กลับไป
    } catch (error) {
      console.error(`GET Error (${endpoint}):`, error);
      // ส่งค่ากลับในรูปแบบเดียวกันกับกรณีที่สำเร็จ แทนที่จะ throw error
      return {
        success: false,
        message: error.message || "เกิดข้อผิดพลาดในการเรียก API",
        data: [],
      };
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
