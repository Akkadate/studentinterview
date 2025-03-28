// frontend/src/app/api/auth/login/route.js
export async function POST(request) {
  try {
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

    // แก้ไข URL ของ backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";
    const response = await fetch(`${backendUrl}/interviewers/${staff_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "รหัสผู้สัมภาษณ์ไม่ถูกต้อง",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();

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
  } catch (error) {
    console.error("Login API error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
