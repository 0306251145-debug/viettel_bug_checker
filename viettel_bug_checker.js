// ==UserScript==
// @Name         Viettel Zero-Rating Host Checker (Optimized)
// @Description  Tự động kiểm tra và chọn Bug Host Viettel ổn định nhất dựa trên Latency & Status
// @Author       Tín (Optimized by AI)
// @Environment  Surge, Quantumult X
// ==/UserScript==

const bugHosts = [
  { name: "Viettel Protect (Classic)", host: "protectlog.vietteltelecom.vn", port: 443 },
  { name: "Mocha Call Msg", host: "vcallmsg.mocha.com.vn", port: 443 },
  { name: "Viettel Call API", host: "vcallapi.vietteltelecom.vn", port: 443 },
  { name: "Tammi API", host: "api.tammi.vn", port: 443 },
  { name: "Tammi Superapp", host: "superapp.tammi.vn", port: 443 },
  { name: "PVideo Streaming", host: "pvideo.viettel.vn", port: 443 },
  { name: "Media Viettel", host: "media.vietteltelecom.vn", port: 443 },
  { name: "RTC Log Report", host: "logreport-global-dual.rtc.vietteltammi.vn", port: 443 }
];

async function checkHostPerformance() {
  console.log("🔍 [Viettel Bug Checker] Đang quét hiệu năng Bug Host...");
  let bestHost = null;
  let minLatency = Infinity;

  for (const item of bugHosts) {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // Giảm timeout xuống 1.5s cho nhanh
      
      // Thử kết nối HTTPS. Dù trả về 400/403/404 thì vẫn coi là "HOST SỐNG" (vì DPI đã cho qua)
      const response = await fetch(`https://${item.host}`, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 
          'Host': item.host,
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
        }
      });
      
      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;
      
      // Chỉ cần không phải lỗi mạng (network error) là coi như host hợp lệ
      console.log(`✅ [${latency}ms | Status: ${response.status}] ${item.name} (${item.host})`);
      
      if (latency < minLatency) {
        minLatency = latency;
        bestHost = item;
      }
    } catch (error) {
      // Nếu lỗi timeout hoặc DNS, bỏ qua
      if (error.name === 'AbortError') {
        console.log(`⏱️ [TIMEOUT] ${item.name} - Bỏ qua`);
      } else {
        console.log(`⚠️ [ERROR] ${item.name} - ${error.message}`);
      }
    }
  }

  if (bestHost) {
    console.log(`🏆 [KẾT QUẢ] HOST TỐT NHẤT: ${bestHost.name} (${bestHost.host}) với độ trễ ${minLatency}ms`);
    
    // Lưu vào bộ nhớ để các script khác hoặc config có thể đọc ra
    // Trên Surge dùng $persistentStore, trên Quantumult X dùng $prefs.setValueForKey
    if (typeof $persistentStore !== 'undefined') {
      $persistentStore.write(bestHost.host, "selected_viettel_bug_host");
      $notification.post("Viettel Bug Checker", "🏆 Tìm thấy Host tốt nhất", `${bestHost.name}\n${bestHost.host}`);
    } else if (typeof $prefs !== 'undefined') {
      $prefs.setValueForKey(bestHost.host, "selected_viettel_bug_host");
    }
  } else {
    console.log("❌ [KẾT QUẢ] Không tìm thấy host nào khả dụng. Hãy kiểm tra lại mạng.");
    $notification.post("Viettel Bug Checker", "❌ Lỗi", "Không tìm thấy host khả dụng");
  }
  
  $done();
}

checkHostPerformance();
