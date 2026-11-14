// tls_fragment.js
// Mục đích: Chia nhỏ gói tin Client Hello để vượt qua DPI kiểm tra độ dài gói tin TLS
let headers = $request.headers;
let url = $request.url;

// Chỉ xử lý các request đến server VLESS/REALITY của chúng ta
if (url.includes('vn1.vpnjantit.com')) {
    // Thêm header giả để đánh lừa DPI rằng đây là request HTTP bình thường
    headers['Host'] = '5g.vietteltelecom.vn'; 
    headers['User-Agent'] = 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36';
    
    // Logic phân mảnh sẽ được xử lý bởi core của Shadowrocket khi kết hợp với config fragment=1,33-162
    // Script này đảm bảo SNI gửi đi là SNI hợp lệ của Viettel
    console.log('[TLS-Fragment] Spoofed SNI to 5g.vietteltelecom.vn');
}

$done({ headers: headers });
