const speakeasy = require('speakeasy');

// Setup Start
const bmlAccessToken = "Bearer " // [Required]
const xAppVersion = "2.1.21.240"
const userAgent = "bml-mobile-banking/240 (Samsung; Android14; Samsung Galaxy S69"

const debitAccount = ""; //  Your BML Debit Account ID [Required]
const creditAccount = 34000000; // Transfer Target BML Account ID [Required]
const debitAmount = 0.01; //  MVR to transfer
const transfertype = "IAT";
const currency = "MVR";
const channel = "token"; // OTP Verification Channel - Options: ["token", "mobile"]

const totpSecretKey = ''; // BML TOTP Auth Key [Required]

var remarks = "";
// Setup End

function getDashboard() {
    const options = {
        method: 'GET',
        headers: {
            'x-app-version': xAppVersion,
            'user-agent': userAgent,
            authorization: bmlAccessToken
        }
    };

    fetch("https://www.bankofmaldives.com.mv/internetbanking/api/mobile/dashboard", options)
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response, null, 2)))
    .catch(err => console.log(err))
}

function getContacts() {
    const options = {
        method: 'GET',
        headers: {
            'x-app-version': xAppVersion,
            'user-agent': userAgent,
            authorization: bmlAccessToken
        }
    };

    fetch("https://www.bankofmaldives.com.mv/internetbanking/api/mobile/contacts", options)
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response, null, 2)))
    .catch(err => console.log(err))
}

function transferFunds() {
    console.log(`Transfering ${debitAmount} MVR...`)

    // Generate a TOTP token
    var otp = speakeasy.totp({
        secret: totpSecretKey,
        encoding: 'base32'
    });

    console.log('Generated OTP Code: ', otp);

    const formBoundary = '53b62140-849b-452e-8c38-b1775574640e';
    var formBody = `
--${formBoundary}
content-disposition: form-data; name="debitAccount"
Content-Length: 36

${debitAccount}
--${formBoundary}
content-disposition: form-data; name="creditAccount"
Content-Length: 8

${creditAccount}
--${formBoundary}
content-disposition: form-data; name="debitAmount"
Content-Length: 4

${debitAmount}
--${formBoundary}
content-disposition: form-data; name="transfertype"
Content-Length: 3

${transfertype}
--${formBoundary}
content-disposition: form-data; name="currency"
Content-Length: 3

${currency}
--${formBoundary}
content-disposition: form-data; name="remarks"
Content-Length: 0

${remarks}
--${formBoundary}
content-disposition: form-data; name="purpose"
Content-Length: 4

null
--${formBoundary}
content-disposition: form-data; name="narrative2"
Content-Length: 0


--${formBoundary}
content-disposition: form-data; name="additionalInstruction"
Content-Length: 0


--${formBoundary}
content-disposition: form-data; name="m_ref"
Content-Length: 9

undefined
--${formBoundary}
content-disposition: form-data; name="dollarSupport"
Content-Length: 9

undefined
--${formBoundary}
content-disposition: form-data; name="chargesFromMVRAccount"
Content-Length: 9

undefined
--${formBoundary}
content-disposition: form-data; name="chargesFrom"
Content-Length: 9

undefined
--${formBoundary}
content-disposition: form-data; name="channel"
Content-Length: 5

${channel}
--${formBoundary}
content-disposition: form-data; name="otp"
Content-Length: 6

${otp}
--${formBoundary}--
`;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data; boundary=' + formBoundary,
            'x-app-version': xAppVersion,
            'user-agent': userAgent,
            authorization: bmlAccessToken
        },
        body: formBody
    };

    retryFetch('https://www.bankofmaldives.com.mv/internetbanking/api/mobile/transfer', options, 5, 2000)
        .then(data => console.log('Transfer Successful:', JSON.stringify(data, null, 2)))
        .catch(err => console.error('Transfer Failed:', err));
}

function retryFetch(url, options, retries, delay) {
    return fetch(url, options)
        .then(response => {
            if (response.status === 403) {
                console.log('Received 403 - Waiting for anti-bot protection...');
                throw new Error('Anti-bot protection or rate limit');
            }
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text().then(text => {
                    throw new Error(`Unexpected content type: ${contentType}\n${text}`);
                });
            }
        })
        .catch(err => {
            if (retries > 0) {
                console.log(`Retrying... Attempts remaining: ${retries}`);
                return new Promise(resolve => setTimeout(resolve, delay))
                    .then(() => retryFetch(url, options, retries - 1, delay));
            } else {
                throw err;
            }
        });
}

const t = 24 * 60 * 60 * 1000;
setInterval(transferFunds, t);

console.log("BML Tranfer Bot is running...")

transferFunds()
//getContacts()
//getDashboard()
