import { POSTRequest, PATCHRequest, PUTRequest, getCSRF } from "../skeletonAPIMethods";

export const accountLogin = async ({email = null, password = null} = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/account/login',
        csrfToken,
        requestBody: { email, password },
        templatedObject: null,
    });
}

export const accountLoginOTP = async ({token = null} = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/account/login-otp',
        csrfToken,
        requestBody: { token },
        templatedObject: null,
    });
}

export const accountRegister = async ({name = null, email = null, password = null, token = null} = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/account/register',
        csrfToken,
        requestBody: { name, email, password, token },
        templatedObject: null,
    });
}

export const accountVerifyOTP = async ({token = null} = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/account/verify-otp',
        csrfToken,
        requestBody: { token },
        templatedObject: null,
    });
}

export const accountUpdate = async ({name = null, email = null} = {}) => {
    const csrfToken = await getCSRF();
    return await PATCHRequest({
        apiURL: '/api/account/update',
        csrfToken,
        requestBody: { name, email },
        templatedObject: null,
    });
}

export const accountUpdatePassword = async ({oldPassword = null, newPassword = null} = {}) => {
    const csrfToken = await getCSRF();
    return await PATCHRequest({
        apiURL: '/api/account/update-password',
        csrfToken,
        requestBody: { oldPassword, newPassword },
        templatedObject: null,
    });
}

export const accountForgotPassword = async ({email = null} = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/account/forgot-password',
        csrfToken,
        requestBody: { email },
        templatedObject: null,
    });
}

export const accountValidateCode = async ({email = null, code = null} = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/account/validate-code',
        csrfToken,
        requestBody: { email, code },
        templatedObject: null,
    });
}

export const accountResetPassword = async ({email = null, password = null, code = null} = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/account/reset-password',
        csrfToken,
        requestBody: { email, password, code },
        templatedObject: null,
    });
}

export const accountPaymentInfoPOST = async () => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/account/payment-info',
        csrfToken,
        requestBody: null,
        templatedObject: null,
    });
}

export const accountPaymentInfoPUT = async ({cardNumber = null, expirationDate = null, cvc = null} = {}) => {
    const csrfToken = await getCSRF();
    return await PUTRequest({
        apiURL: '/api/account/payment-info',
        csrfToken,
        requestBody: { cardNumber, expirationDate, cvc },
        templatedObject: null,
    });
}

export const accountLogout = async () => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/account/logout',
        csrfToken,
        requestBody: null,
        templatedObject: null,
    });
}
