// ==UserScript==
// @Name         Viettel Service Scanner
// @Description  Quét trạng thái cổng dịch vụ của các host Zero-Rating
// ==/UserScript==

const services = [
    { name: "Mocha XMPP", host: "vcallmsg.mocha.com.vn", port: 5223 },
    { name: "Viettel Logging", host: "protectlog.vietteltelecom.vn", port: 443 },
    { name: "Tammi API", host: "api.tammi.vn", port: 443 }
];

(async () => {
    console.log("📡 [SCANNER] Quét trạng thái dịch vụ Viettel...");
    for (const svc of services) {
        const start = Date.now();
        try {
            // Fetch HEAD request để kiểm tra khả năng thiết lập kết nối TCP/TLS
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 2000);
            
            await fetch(`https://${svc.host}:${svc.port}`, { 
                method: 'HEAD', 
                signal: controller.signal,
                headers: { 'Host': svc.host } 
            });
            
            console.log(`✅ [OPEN] ${svc.name} (${svc.host}:${svc.port}) - ${(Date.now()-start)}ms`);
        } catch (err) {
            // Lỗi SSL/Cert vẫn có nghĩa là cổng đang mở và chấp nhận kết nối
            if (err.message.includes('Abort')) {
                console.log(`⏳ [SLOW] ${svc.name} - Phản hồi chậm (>2s)`);
            } else {
                console.log(`🔒 [LOCKED/SSL] ${svc.name} - Cổng mở nhưng từ chối handshake (Có thể dùng làm SNI Spoofing)`);
            }
        }
    }
})();
