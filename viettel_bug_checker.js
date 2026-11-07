// ==UserScript==
// @Name         Viettel Zero-Rating Host Checker
// @Description  Tự động kiểm tra và chọn Bug Host Viettel ổn định nhất
// @Author       Tín
// ==/UserScript==

const bugHosts = [
  { name: "Mocha Call", host: "vcallmsg.mocha.com.vn", port: 5223 },
  { name: "Viettel Protect", host: "protectlog.vietteltelecom.vn", port: 443 },
  { name: "Tammi API", host: "api.tammi.vn", port: 443 },
  { name: "RTC Log Report", host: "logreport-global-dual.rtc.vietteltammi.vn", port: 443 },
  { name: "RTC Detail Log", host: "detaillog-global-dual.rtc.vietteltammi.vn", port: 443 },
  { name: "Viettel Call API", host: "vcallapi.vietteltelecom.vn", port: 443 },
  { name: "Tammi Superapp", host: "superapp.tammi.vn", port: 443 },
  { name: "Viettel Aff API", host: "affapi.viettel.vn", port: 443 }
];

async function checkHostPerformance() {
  console.log("🔍 Đang quét hiệu năng Bug Host Viettel...");
  let bestHost = null;
  let minLatency = Infinity;

  for (const item of bugHosts) {
    const startTime = Date.now();
    try {
      // Thử kết nối TCP/HTTPS nhanh
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      await fetch(`https://${item.host}:${item.port}`, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'Host': item.host }
      });
      
      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;
      console.log(`✅ [${latency}ms] ${item.name} (${item.host})`);
      
      if (latency < minLatency) {
        minLatency = latency;
        bestHost = item;
      }
    } catch (error) {
      // Một số host vẫn dùng được dù fetch lỗi (do SSL strict)
      console.log(`⚠️ [CHECK] ${item.name} - Có thể dùng làm SNI Spoofing`);
      if (!bestHost) bestHost = item; // Chọn đại nếu chưa có host nào tốt
    }
  }

  if (bestHost) {
    console.log(`🏆 HOST TỐT NHẤT: ${bestHost.name} - ${bestHost.host}`);
    // Lưu vào $persistentStore để các script khác hoặc config sử dụng
    $persistentStore.write(bestHost.host, "selected_viettel_bug_host");
  } else {
    console.log("❌ Không tìm thấy host nào khả dụng.");
  }
}

checkHostPerformance();
$done();
