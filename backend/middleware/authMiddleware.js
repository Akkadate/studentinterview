// backend/middleware/authMiddleware.js
const db = require("../config/db");

/**
 * ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการเข้าถึงข้อมูลหรือไม่
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
// backend/middleware/authMiddleware.js
// backend/middleware/authMiddleware.js
const checkAuth = async (req, res, next) => {
  try {
    // อ่านข้อมูลผู้ใช้จาก header
    const userId = req.headers["x-user-id"];

    // ถ้าไม่มี header ที่จำเป็น
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
      });
    }

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const userResult = await db.query(
      "SELECT staff_id, staff_faculty FROM interviewer WHERE staff_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
      });
    }

    // เก็บข้อมูลผู้ใช้ใน request object
    req.user = {
      id: userId,
      faculty: userResult.rows[0].staff_faculty,
    };

    // เพิ่ม log เพื่อตรวจสอบว่าข้อมูลถูกต้อง
    console.log("User authenticated:", req.user);

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
    });
  }
};
/**
 * ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการเข้าถึงข้อมูลของนักศึกษาคณะนั้นหรือไม่
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const checkFacultyAccess = async (req, res, next) => {
  try {
    // ต้องมี checkAuth middleware ทำงานก่อนหน้านี้
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
      });
    }

    // ถ้าเป็นผู้บริหาร ให้เข้าถึงข้อมูลได้ทันที
    if (req.user.faculty === "ผู้บริหาร") {
      return next();
    }

    // ตรวจสอบว่ามี faculty parameter หรือไม่
    const { faculty } = req.params;
    if (faculty && faculty !== req.user.faculty) {
      return res.status(403).json({
        success: false,
        message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
      });
    }

    // ถ้ามี student_id parameter ให้ตรวจสอบว่านักศึกษาอยู่ในคณะเดียวกันหรือไม่
    const { id, studentId } = req.params;
    if (id || studentId) {
      const paramId = id || studentId;

      // ค้นหาข้อมูลนักศึกษา
      const studentResult = await db.query(
        "SELECT faculty FROM student WHERE student_id = $1",
        [paramId]
      );

      // ถ้าพบข้อมูลนักศึกษาและคณะไม่ตรงกับผู้ใช้
      if (
        studentResult.rows.length > 0 &&
        studentResult.rows[0].faculty !== req.user.faculty
      ) {
        return res.status(403).json({
          success: false,
          message: "ข้อมูลถูกจำกัดการเข้าถึงตามสิทธิ์ที่ได้รับ",
        });
      }
    }

    // ดำเนินการต่อไปยัง middleware หรือ route handler ถัดไป
    next();
  } catch (error) {
    console.error("Faculty access check error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
    });
  }
};

module.exports = {
  checkAuth,
  checkFacultyAccess,
};
