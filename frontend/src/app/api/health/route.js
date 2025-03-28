export async function GET() {
  try {
    // ลองเรียก backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://interview.devapp.cc:5003/api";
    console.log("Trying to connect to backend at:", backendUrl);

    const response = await fetch(`${backendUrl.replace(/\/api$/, "")}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Backend connection failed: ${response.statusText}`,
          status: response.status,
        }),
        {
          status: 200, // ส่ง 200 เพื่อให้ client ได้รับข้อมูล แม้ว่า backend จะมีปัญหา
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const backendData = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "API connection is working!",
        backend: backendData,
        apiUrl: backendUrl,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: `API connection test failed: ${error.message}`,
        error: error.stack,
      }),
      {
        status: 200, // ส่ง 200 เพื่อให้ client ได้รับข้อมูล แม้ว่าจะมีข้อผิดพลาด
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
