import { api } from "./api";

export const questionService = {
  /**
   * ดึงข้อมูลคำถามทั้งหมด
   * @returns {Promise} - ข้อมูลคำถาม
   */
  async getAllQuestions() {
    try {
      return await api.get("questions");
    } catch (error) {
      console.error("Error fetching questions:", error);
      // ส่งค่ากลับในรูปแบบที่คาดหวังแม้เกิดข้อผิดพลาด
      return {
        success: false,
        message: error.message || "ไม่สามารถโหลดข้อมูลคำถามได้",
        data: [],
      };
    }
  },

  /**
   * ดึงข้อมูลคำถามตาม ID
   * @param {number} id - รหัสคำถาม
   * @returns {Promise} - ข้อมูลคำถาม
   */
  async getQuestionById(id) {
    try {
      return await api.get(`questions/${id}`);
    } catch (error) {
      console.error(`Error fetching question ID ${id}:`, error);
      // ส่งค่ากลับในรูปแบบที่คาดหวังแม้เกิดข้อผิดพลาด
      return {
        success: false,
        message: error.message || "ไม่สามารถโหลดข้อมูลคำถามได้",
        data: null,
      };
    }
  },
};
