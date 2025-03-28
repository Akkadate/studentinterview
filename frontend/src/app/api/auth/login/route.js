// frontend/src/app/api/auth/login/route.js

// API endpoint สำหรับการล็อกอินผู้สัมภาษณ์
export async function POST(request) {
  try {
    // รับข้อมูลจาก request
    const body = await request.json();
    const { staff_id } = body;

    if (!staff_id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "กรุณาระบุรหัสผู้สัมภาษณ์",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // เรียก API ของ backend เพื่อตรวจสอบรหัสผู้สัมภาษณ์
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/interviewers/${staff_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    // ถ้าพบข้อมูลผู้สัมภาษณ์
    if (response.ok && result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "เข้าสู่ระบบสำเร็จ",
          data: result.data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // ถ้าไม่พบข้อมูลผู้สัมภาษณ์
      return new Response(
        JSON.stringify({
          success: false,
          message: "รหัสผู้สัมภาษณ์ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Login API error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ โปรดลองใหม่อีกครั้ง",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
