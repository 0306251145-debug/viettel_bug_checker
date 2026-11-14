// header_spoof.js
// Mục đích: Thay đổi header để khớp với whitelist của ISP
let headers = $request.headers;
let url = $request.url;

// Danh sách các host được miễn phí của Viettel
const whiteListHosts = [
    '5g.vietteltelecom.vn',
    'naptien.viettel.vn',
    'mocha.com.vn',
    'tammi.vn'
];

// Chọn ngẫu nhiên một host từ whitelist để làm Host header
const randomHost = whiteListHosts[Math.floor(Math.random() * whiteListHosts.length)];

// Áp dụng cho tất cả các request đi qua proxy
headers['Host'] = randomHost;
headers['Referer'] = `https://${randomHost}/`;
headers['Origin'] = `https://${randomHost}`;

// Xóa các header có thể lộ thông tin proxy
delete headers['Via'];
delete headers['X-Forwarded-For'];

console.log(`[Header-Spoof] Set Host to ${randomHost}`);
$done({ headers: headers });
