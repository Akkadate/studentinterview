// src/app/api/[...path]/route.js
// API Proxy ที่เรียก backend HTTP จาก server แทน browser

const BACKEND_API_URL = "http://interview.devapp.cc:5003"; // ตัด '/api' ออก

export async function GET(request, { params }) {
  try {
    const path = params.path.join("/");
    console.log(`Proxying GET request to: ${BACKEND_API_URL}/api/${path}`); // เพิ่ม '/api'

    const response = await fetch(`${BACKEND_API_URL}/api/${path}`, {
      // เพิ่ม '/api'
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ตรวจสอบการตอบกลับที่ไม่ใช่ JSON (เช่น HTML)
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      console.error(`Received non-JSON response: ${contentType}`);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Received non-JSON response from backend (${contentType})`,
          status: response.status,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Error from backend: ${response.statusText}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Proxy Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "มีข้อผิดพลาดเกิดขึ้นที่ API Proxy",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const path = params.path.join("/");
    const body = await request.json();

    console.log(`Proxying POST request to: ${BACKEND_API_URL}/api/${path}`);

    const response = await fetch(`${BACKEND_API_URL}/api/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Error from backend: ${response.statusText}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Proxy Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "มีข้อผิดพลาดเกิดขึ้นที่ API Proxy",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const path = params.path.join("/");
    const body = await request.json();

    console.log(`Proxying PUT request to: ${BACKEND_API_URL}/api/${path}`);

    const response = await fetch(`${BACKEND_API_URL}/api/${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Error from backend: ${response.statusText}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Proxy Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "มีข้อผิดพลาดเกิดขึ้นที่ API Proxy",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const path = params.path.join("/");
    console.log(`Proxying DELETE request to: ${BACKEND_API_URL}/api/${path}`);

    const response = await fetch(`${BACKEND_API_URL}/api/${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Error from backend: ${response.statusText}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Proxy Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "มีข้อผิดพลาดเกิดขึ้นที่ API Proxy",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
