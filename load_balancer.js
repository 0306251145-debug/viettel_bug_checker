// load_balancer.js
// Cân bằng tải động dựa trên sự kiện thay đổi mạng
let event = $event;

console.log(`[Load-Balancer] Network changed event detected: ${event.name}`);

// Logic kiểm tra độ ổn định của kết nối hiện tại
// Nếu mạng chuyển từ WiFi sang 4G/5G, ưu tiên nhóm Viettel_Proxy
if (event.name === 'network-changed') {
    let networkType = $network.type; // wifi, cellular, wired
    
    if (networkType === 'cellular') {
        console.log('[Load-Balancer] Switched to Cellular. Activating Zero-Rating Mode.');
        // Kích hoạt các rule đặc biệt cho 4G/5G
        $prefs.setValueForKey('true', 'ZeroRatingActive');
    } else {
        console.log('[Load-Balancer] Switched to non-cellular. Deactivating Zero-Rating Mode.');
        $prefs.setValueForKey('false', 'ZeroRatingActive');
    }
}

$done();
