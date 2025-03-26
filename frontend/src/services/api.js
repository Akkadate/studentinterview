// frontend/src/services/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
      const response = await fetch(`${API_URL}/${endpoint}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'มีข้อผิดพลาดเกิดขึ้น');
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
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'มีข้อผิดพลาดเกิดขึ้น');
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
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'มีข้อผิดพลาดเกิดขึ้น');
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
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'มีข้อผิดพลาดเกิดขึ้น');
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
      const response = await fetch(`${API_URL}/${endpoint}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'มีข้อผิดพลาดในการดาวน์โหลดไฟล์');
      }
      
      return await response.blob();
    } catch (error) {
      console.error(`Download Error (${endpoint}):`, error);
      throw error;
    }
  }
};

// frontend/src/services/interviewerService.js
import { api } from './api';

export const interviewerService = {
  /**
   * ดึงข้อมูลผู้สัมภาษณ์ทั้งหมด
   * @returns {Promise} - ข้อมูลผู้สัมภาษณ์
   */
  async getAllInterviewers() {
    return api.get('interviewers');
  },
  
  /**
   * ดึงข้อมูลผู้สัมภาษณ์ตาม ID
   * @param {number} id - รหัสผู้สัมภาษณ์
   * @returns {Promise} - ข้อมูลผู้สัมภาษณ์
   */
  async getInterviewerById(id) {
    return api.get(`interviewers/${id}`);
  }
};

// frontend/src/services/studentService.js
import { api } from './api';

export const studentService = {
  /**
   * ดึงข้อมูลนักศึกษาทั้งหมด
   * @returns {Promise} - ข้อมูลนักศึกษา
   */
  async getAllStudents() {
    return api.get('students');
  },
  
  /**
   * ดึงข้อมูลนักศึกษาตาม ID
   * @param {number} id - รหัสนักศึกษา
   * @returns {Promise} - ข้อมูลนักศึกษา
   */
  async getStudentById(id) {
    return api.get(`students/${id}`);
  },
  
  /**
   * ดึงข้อมูลนักศึกษาตามคณะ
   * @param {string} faculty - ชื่อคณะ
   * @returns {Promise} - ข้อมูลนักศึกษา
   */
  async getStudentsByFaculty(faculty) {
    return api.get(`students/faculty/${encodeURIComponent(faculty)}`);
  },
  
  /**
   * ดึงข้อมูลนักศึกษาตามหลักสูตร
   * @param {string} program - ชื่อหลักสูตร
   * @returns {Promise} - ข้อมูลนักศึกษา
   */
  async getStudentsByProgram(program) {
    return api.get(`students/program/${encodeURIComponent(program)}`);
  },
  
  /**
   * ดึงข้อมูลนักศึกษาที่ยังไม่ได้รับการสัมภาษณ์
   * @returns {Promise} - ข้อมูลนักศึกษา
   */
  async getNotInterviewedStudents() {
    return api.get('students/not-interviewed');
  },
  
  /**
   * ดึงข้อมูลสรุปสถานะการสัมภาษณ์
   * @returns {Promise} - ข้อมูลสรุป
   */
  async getInterviewStatusSummary() {
    return api.get('students/summary');
  }
};

// frontend/src/services/questionService.js
import { api } from './api';

export const questionService = {
  /**
   * ดึงข้อมูลคำถามทั้งหมด
   * @returns {Promise} - ข้อมูลคำถาม
   */
  async getAllQuestions() {
    return api.get('questions');
  },
  
  /**
   * ดึงข้อมูลคำถามตาม ID
   * @param {number} id - รหัสคำถาม
   * @returns {Promise} - ข้อมูลคำถาม
   */
  async getQuestionById(id) {
    return api.get(`questions/${id}`);
  }
};

// frontend/src/services/interviewService.js
import { api } from './api';

export const interviewService = {
  /**
   * ดึงข้อมูลการสัมภาษณ์ทั้งหมด
   * @returns {Promise} - ข้อมูลการสัมภาษณ์
   */
  async getAllInterviews() {
    return api.get('interviews');
  },
  
  /**
   * ดึงข้อมูลการสัมภาษณ์ตาม ID
   * @param {number} id - รหัสการสัมภาษณ์
   * @returns {Promise} - ข้อมูลการสัมภาษณ์
   */
  async getInterviewById(id) {
    return api.get(`interviews/${id}`);
  },
  
  /**
   * ดึงข้อมูลการสัมภาษณ์ตามรหัสนักศึกษา
   * @param {number} studentId - รหัสนักศึกษา
   * @returns {Promise} - ข้อมูลการสัมภาษณ์
   */
  async getInterviewByStudentId(studentId) {
    return api.get(`interviews/student/${studentId}`);
  },
  
  /**
   * สร้างการสัมภาษณ์ใหม่
   * @param {object} interviewData - ข้อมูลการสัมภาษณ์
   * @returns {Promise} - ข้อมูลการสัมภาษณ์ที่สร้าง
   */
  async createInterview(interviewData) {
    return api.post('interviews', interviewData);
  },
  
  /**
   * อัปเดตคำตอบในการสัมภาษณ์
   * @param {number} id - รหัสการสัมภาษณ์
   * @param {object} answersData - ข้อมูลคำตอบที่จะอัปเดต
   * @returns {Promise} - ข้อมูลคำตอบที่อัปเดต
   */
  async updateInterviewAnswers(id, answersData) {
    return api.put(`interviews/${id}`, answersData);
  },
  
  /**
   * ส่งออกข้อมูลการสัมภาษณ์เป็น Excel
   * @returns {Promise} - Blob ไฟล์ Excel
   */
  async exportInterviewsToExcel() {
    return api.downloadFile('interviews/export');
  }
};
