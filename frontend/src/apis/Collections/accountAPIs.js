import { POSTRequest, PATCHRequest, PUTRequest } from "../skeletonAPIMethods";

export const accountLogin = async (csrfToken, email, password) => {
    return await POSTRequest({
        apiURL: '/api/account/login',
        csrfToken,
        requestBody: { email, password },
        templatedObject: null,
    });
}

export const accountLoginOTP = async (csrfToken, token) => {
    return await POSTRequest({
        apiURL: '/api/account/login-otp',
        csrfToken,
        requestBody: { token },
        templatedObject: null,
    });
}

export const accountRegister = async (csrfToken, name, email, password, token) => {
    return await POSTRequest({
        apiURL: '/api/account/register',
        csrfToken,
        requestBody: { name, email, password, token },
        templatedObject: null,
    });
}

export const accountVerifyOTP = async (csrfToken, token) => {
    return await POSTRequest({
        apiURL: '/api/account/verify-otp',
        csrfToken,
        requestBody: { token },
        templatedObject: null,
    });
}

export const accountUpdate = async (csrfToken, name, email) => {
    return await PATCHRequest({
        apiURL: '/api/account/update',
        csrfToken,
        requestBody: { name, email },
        templatedObject: null,
    });
}

export const accountUpdatePassword = async (csrfToken, password) => {
    return await PATCHRequest({
        apiURL: '/api/account/update-password',
        csrfToken,
        requestBody: { password },
        templatedObject: null,
    });
}

export const accountForgotPassword = async (csrfToken, email) => {
    return await POSTRequest({
        apiURL: '/api/account/forgot-password',
        csrfToken,
        requestBody: { email },
        templatedObject: null,
    });
}

export const accountValidateCode = async (csrfToken, email, code) => {
    return await POSTRequest({
        apiURL: '/api/account/validate-code',
        csrfToken,
        requestBody: { email, code },
        templatedObject: null,
    });
}

export const accountResetPassword = async (csrfToken, email, password, code) => {
    return await POSTRequest({
        apiURL: '/api/account/reset-password',
        csrfToken,
        requestBody: { email, password, code },
        templatedObject: null,
    });
}

export const accountPaymentInfoPOST = async (csrfToken) => {
    return await POSTRequest({
        apiURL: '/api/account/payment-info',
        csrfToken,
        templatedObject: null,
    });
}

export const accountPaymentInfoPUT = async (csrfToken, cardNumber, expirationDate, cvc) => {
    return await PUTRequest({
        apiURL: '/api/account/payment-info',
        csrfToken,
        requestBody: { cardNumber, expirationDate, cvc },
        templatedObject: null,
    });
}

export const accountLogout = async (csrfToken) => {
    return await POSTRequest({
        apiURL: '/api/account/logout',
        csrfToken,
        requestBody: null,
        templatedObject: null,
    });
}
