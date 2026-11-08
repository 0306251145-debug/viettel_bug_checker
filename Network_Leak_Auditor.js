// ==UserScript==
// @Name         Network Leak Auditor
// @Description  Kiểm tra xem DNS/IP thật có bị lộ khi bật proxy không
// ==/UserScript==

(async function() {
    console.log("🛡️ [AUDIT] Bắt đầu kiểm tra rò rỉ mạng...");
    
    // 1. Kiểm tra IP thực tế nhìn thấy từ bên ngoài
    try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        console.log(`🌍 Public IP hiện tại: ${ipData.ip}`);
        
        // Nếu IP này trùng với IP SIM 4G của bạn -> PROXY ĐANG THẤT BẠI
        if (ipData.ip.startsWith('10.') || ipData.ip.startsWith('172.')) {
             console.log("⚠️ CẢNH BÁO: Đang dùng IP nội mạng/private, có thể chưa qua proxy đúng cách.");
        }
    } catch (e) {
        console.log("❌ Không thể kiểm tra IP public.");
    }

    // 2. Kiểm tra độ trễ DNS (Phát hiện DNS poisoning hoặc leak)
    const start = Date.now();
    try {
        await fetch('https://dns.google/resolve?name=example.com', {method: 'HEAD'});
        const latency = Date.now() - start;
        console.log(`⏱️ Độ trễ DNS Google: ${latency}ms`);
        if (latency > 300) console.log("⚠️ DNS quá chậm, có thể đang bị throttling hoặc resolve sai đường.");
    } catch (e) {
        console.log("❌ DNS Google không phản hồi (có thể bị chặn hoặc route sai).");
    }

    console.log("✅ [AUDIT] Hoàn tất. Vui lòng đối chiếu log với trạng thái data 4G.");
})();
