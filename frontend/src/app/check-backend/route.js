export async function GET() {
  try {
    // ทดสอบการเชื่อมต่อ backend ทั้งแบบ http และ https
    const backends = [
      "http://interview.devapp.cc:5003/health", // ทดสอบ HTTP บนพอร์ต 5003
      "https://interview.devapp.cc:5003/health", // ทดสอบ HTTPS บนพอร์ต 5003
      "http://interview.devapp.cc/health", // ทดสอบ HTTP บนพอร์ต default
      "https://interview.devapp.cc/health", // ทดสอบ HTTPS บนพอร์ต default
      "http://localhost:5003/health", // ทดสอบ localhost
    ];

    const results = {};

    for (const url of backends) {
      try {
        console.log(`Testing backend connection to: ${url}`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          let data;
          try {
            data = await response.json();
          } catch (e) {
            data = { error: "Invalid JSON response" };
          }

          results[url] = {
            success: true,
            status: response.status,
            data,
          };
        } else {
          results[url] = {
            success: false,
            status: response.status,
            statusText: response.statusText,
          };
        }
      } catch (error) {
        results[url] = {
          success: false,
          error: error.message,
        };
      }
    }

    return new Response(
      JSON.stringify({
        results,
        message: "Backend connectivity test completed",
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
        message: `Error testing backend connectivity: ${error.message}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
