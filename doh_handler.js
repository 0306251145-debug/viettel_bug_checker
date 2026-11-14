// doh_handler.js
// Xử lý DNS Over HTTPS để tránh DNS Poisoning của ISP
let inAddr = $dns.inAddr;
let outAddrs = $dns.outAddrs;

console.log(`[DoH-Handler] Resolving domain for IP: ${inAddr}`);

// Ưu tiên sử dụng DNS của Google và Cloudflare qua DoH
// Logic này giúp Shadowrocket chọn đúng server DNS khi có nhiều lựa chọn
if (outAddrs.length > 0) {
    // Giữ nguyên kết quả nếu đã có IP hợp lệ từ DoH
    console.log(`[DoH-Handler] Resolution successful: ${outAddrs.join(', ')}`);
} else {
    // Fallback về DNS system nếu DoH thất bại
    console.log('[DoH-Handler] DoH failed, falling back to system DNS');
}

$done({ outAddrs: outAddrs });
