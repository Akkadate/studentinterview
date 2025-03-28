// frontend/src/app/api/questions/route.js
export async function GET(request) {
  try {
    // ดึง headers จาก request ถ้ามี
    const userFaculty = request.headers.get("x-user-faculty");
    const userId = request.headers.get("x-user-id");

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${backendUrl}/questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(userFaculty && { "X-User-Faculty": userFaculty }),
        ...(userId && { "X-User-ID": userId }),
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "เกิดข้อผิดพลาดในการเรียกข้อมูลคำถาม",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
