![image](https://github.com/user-attachments/assets/bf75e1a1-e95a-42b5-89e6-9f14426b984a)
# BML-Transfer-Bot
A bot made using node js to schedule and transfer funds to BML (Bank of Maldives) Accounts

## Requirements
- npm install speakeasy

## API Documentation
This document contains some endpoints available with the BML Mobile App API.

All the endpoints below are on the root url https://www.bankofmaldives.com.mv.

## Authentication
BML Mobile App API requires you to authenticate using a Bearer `access_token` which can be obtained by proxying the response from `GET /internetbanking/oauth/token` when signing in with the mobile app.

## Endpoints

1. `GET /internetbanking/api/mobile/dashboard`

    ### Request
    **Headers** : Requires `x-app-version`, `authorization`.
    - `x-app-version`: is the version of the bml mobile application.
    - `authorization`: is the `Bearer <access_token>`

    ### Successful Response
    **Body** : 
    ```json
    {
        "success": true,
        "code": 0,
        "message": "Success",
        "payload": {
            "config": {
            "statement": {
                "casa": {
                "from": "2023-01-01",
                "to": "2024-10-09"
                },
                "loan": {
                "from": "2023-01-01",
                "to": "2024-10-09"
                },
                "merchant_advice": {
                "from": "2023-01-01",
                "to": "2024-10-09"
                },
                "card": {
                "from": "2023-01-01",
                "to": "2024-10-09"
                }
            },
            "mobile_pay": true,
            "mobile_pay_pin_limit": {
                "MVR": 0,
                "USD": 0
            }
            },
            "notices": [],
            "dashboard": [
            {
                "customer": "xxxxxxx",
                "account_type": "CASA",
                "product": "SAVINGS ACCOUNT",
                "product_code": "6001.",
                "currency": "MVR",
                "product_group": "6001",
                "primary_supplementary": "Primary",
                "secondary_customer": null,
                "statecode": "0",
                "statuscode": "1",
                "account_status": "Active",
                "actions": {
                "transfer": true,
                "history": true,
                "pay": false,
                "topup": false
                },
                "id": "BEXXXXXX-F3XX-EFXX-B8XX-00155DXXXXXX",
                "account": "7730000XXXXXX",
                "alias": "BML USER NAME",
                "contact_type": "OAT",
                "workingBalance": 758.29,
                "ledgerBalance": 758.29,
                "clearedBalance": 758.29,
                "availableBalance": 428.29,
                "lockedAmount": 130,
                "minimumBalance": "20000",
                "overdraftLimit": 0,
                "availableLimit": null,
                "creditLimit": null,
                "branch": "MALE' ACCOUNT OPENING CENTRE (XXXX)",
                "success": true
            },
            {
                "customer": "123XXXX",
                "account_type": "Card",
                "product": "VISA DEBIT",
                "product_code": "C1007",
                "title": "CARD NAME",
                "currency": "MVR",
                "product_group": "1007",
                "primary_supplementary": "Primary",
                "bml_branchcode": null,
                "secondary_customer": null,
                "statecode": "0",
                "statuscode": "1",
                "account_status": "Active",
                "actions": {
                "transfer": false,
                "history": false,
                "pay": false,
                "topup": false
                },
                "account_visible": false,
                "prepaid_card": false,
                "id": "CC5EXXXX-61XX-EFXX-B8XX-00155DXXXXXX",
                "account": "421363XXXXXXXXXX",
                "alias": "BML ACCOUNT NAME",
                "success": false
            }
            ]
        }
    }
     ```

2. `GET /internetbanking/api/mobile/contacts`

    ### Request
    **Headers** : Requires `x-app-version`, `authorization`.
    - `x-app-version`: is the version of the bml mobile application.
    - `authorization`: is the `Bearer <access_token>`

    ### Successful Response
    **Body** : 
    ```json
    {
        "success": true,
        "code": 0,
        "message": "Success",
        "payload": [
            {
            "id": 34000000,
            "name": "Random Person 1",
            "avatar": null,
            "favorite": "0",
            "account": "77011XXXXXXXX",
            "swift": null,
            "correspondent_swift": null,
            "address": null,
            "city": null,
            "state": null,
            "postcode": null,
            "country": null,
            "contact_type": "IAT",
            "merchant": null,
            "created_at": "2024-09-26T09:05:27.307000Z",
            "updated_at": "2024-09-26T09:05:27.307000Z",
            "deleted_at": null,
            "bpay_vendor": null,
            "domestic_bank_code": null,
            "service_number": null,
            "mobile_number": null,
            "alias": "Random Person 1 Alias",
            "status": "S",
            "inputter": "123XXXX",
            "owner": "123XXXX",
            "wire_type": null,
            "currency": "MVR",
            "removable": true,
            "vendor": null
            },
            {
            "id": 34000000,
            "name": "Random Person 2",
            "avatar": null,
            "favorite": "0",
            "account": "7730000XXXXXX",
            "swift": null,
            "correspondent_swift": null,
            "address": null,
            "city": null,
            "state": null,
            "postcode": null,
            "country": null,
            "contact_type": "IAT",
            "merchant": null,
            "created_at": "2024-08-18T10:17:40.907000Z",
            "updated_at": "2024-08-18T10:17:40.907000Z",
            "deleted_at": null,
            "bpay_vendor": null,
            "domestic_bank_code": null,
            "service_number": null,
            "mobile_number": null,
            "alias": "Random Person 2 Alias",
            "status": "S",
            "inputter": "123XXXX",
            "owner": "123XXXXX",
            "wire_type": null,
            "currency": "MVR",
            "removable": true,
            "vendor": null
            },
        ]
    }
    ```

3. `POST /internetbanking/api/mobile/transfer`

    ### Request
    **Headers** : Requires `x-app-version`, `authorization`.
    - `x-app-version`: is the version of the bml mobile application.
    - `authorization`: is the `Bearer <access_token>`

    **Body** : `multipart/form-data; boundary=` + `formBoundary`
    - `debitAccount`: this is your bml transfer account id, which can be found with `GET /internetbanking/api/mobile/dashboard` inside `id` param.
    - `creditAccount`: this is the transfer target's bml account id, which can be found with `GET /internetbanking/api/mobile/contacts` inside `id` param.

    **Example Body :**
    ```
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="debitAccount"
    Content-Length: 36

    BEXXXXXX-FXXX-EXXX-BXXX-00155DXXXXXX
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="creditAccount"
    Content-Length: 8

    35XXXXXX
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="debitAmount"
    Content-Length: 4

    0.01
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="transfertype"
    Content-Length: 3

    IAT
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="currency"
    Content-Length: 3

    MVR
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="remarks"
    Content-Length: 0


    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="purpose"
    Content-Length: 4

    null
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="narrative2"
    Content-Length: 0


    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="additionalInstruction"
    Content-Length: 0


    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="m_ref"
    Content-Length: 9

    undefined
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="dollarSupport"
    Content-Length: 9

    undefined
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="chargesFromMVRAccount"
    Content-Length: 9

    undefined
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="chargesFrom"
    Content-Length: 9

    undefined
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="channel"
    Content-Length: 5

    token
    --53b62140-849b-452e-8c38-b1775574640e
    content-disposition: form-data; name="otp"
    Content-Length: 6

    774190
    --53b62140-849b-452e-8c38-b1775574640e--
    ```

    ### Successful Response
    **Body** : 
    ```json
    {
        "success": true,
        "code": 3003,
        "message": "Thank you. Transfer transaction is successful.",
        "payload": {
            "reference": "BLAZ58XXXXXXXXXX",
            "timestamp": "2024-10-09T11:11:50+05:00",
            "remarks": null,
            "messageType": "IAT",
            "TransferType": "BML",
            "from": {
            "account": "7730000XXXXXX",
            "name": "You"
            },
            "id": "3AXXXXXX-9XXX-EXXX-8XXX-00155XXXXXXX",
            "to": {
            "name": "Random Person 2",
            "account": "7701177XXXXXX",
            "contact_type": "IAT"
            },
            "currency": "MVR",
            "debitamount": 0.01
        }
    }
    ```
