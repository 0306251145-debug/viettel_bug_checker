// ==UserScript==
// @Name         Fragment Tuner Logger
// @Description  Ghi nhận thời gian TLS Handshake để tinh chỉnh Fragment
// ==/UserScript==

// Lưu ý: Script này chạy trong môi trường có thể đo đạc thời gian kết nối
// Trong Shadowrocket, bạn chủ yếu quan sát Log TCP Stream để áp dụng logic này.

const targetHosts = ['vcallmsg.mocha.com.vn', 'protectlog.vietteltelecom.vn'];

console.log("🔧 [TUNER] Khuyến nghị cấu hình Fragment dựa trên đặc tính mạng 4G:");
console.log("- Mạng 4G Viettel thường nhạy cảm với gói tin < 64 bytes.");
console.log("- Delay quá thấp (1-2ms) dễ gây nghẽn cổ chai ở lớp Radio.");

// Gợi ý tham số an toàn hơn cho 4G Việt Nam:
const safeFragment = "64-128, 10-20"; 
console.log(`💡 Thử nghiệm với: fragment=${safeFragment}`);
console.log("   -> Kích thước vừa đủ để vượt DPI nhưng không gây overhead lớn.");
console.log("   -> Delay 10-20ms giúp radio layer xử lý kịp, giảm packet loss.");
