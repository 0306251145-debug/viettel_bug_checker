// ad_blocker.js
// Mục đích: Chặn các request tracking để giảm thiểu data bị tính cước ngầm
let url = $request.url;

// Danh sách các domain tracking phổ biến
const blockDomains = [
    'adjust.com',
    'appsflyer.com',
    'facebook.com/tr',
    'googleapis.com/gen_204',
    'crashlytics.com',
    'sentry.io'
];

for (let domain of blockDomains) {
    if (url.includes(domain)) {
        console.log(`[Ad-Blocker] Blocked request to ${domain}`);
        $done({ response: { status: 403, body: 'Blocked by Zero-Rating Engine' } });
        return;
    }
}

$done({});
