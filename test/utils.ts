import { createHmac } from 'crypto';
import { TEST_API_KEY, TEST_SECRET } from './constants';

export function signRequest(
    method: string,
    host: string,
    uri: string,
    body?: any,
    queryString?: string,
) {
    const timestamp = new Date().toISOString();
    let stringToSign = `${method.toLowerCase()}\n${host.toLowerCase()}\n${timestamp}\n${uri}`;
    if (queryString) {
        const sortedParams = queryString.split('&').sort().join('\n&');
        stringToSign += `\n${sortedParams}`;
    }
    if (body && Object.keys(body).length > 0) {
        stringToSign += `\n${JSON.stringify(body)}`;
    }
    const signature = createHmac('sha256', TEST_SECRET)
        .update(stringToSign)
        .digest('base64');
    return {
        'x-access-key-id': TEST_API_KEY,
        'x-signature-version': '1',
        'x-timestamp': timestamp,
        'x-signature': signature,
        Host: host,
    };
}
