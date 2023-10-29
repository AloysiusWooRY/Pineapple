import { GETRequest, POSTRequest, PATCHRequest, PUTRequest } from "../skeletonAPIMethods";

export const login = async (csrfToken, email, password) => {
    return POSTRequest(
        '/api/account/login',
        csrfToken,
        { email, password }
    );
}

export const loginOTP = async (csrfToken, token) => {
    return POSTRequest(
        '/api/account/login-otp',
        csrfToken,
        { token }
    );
}

export const register = async (csrfToken, name, email, password, token) => {
    return POSTRequest(
        '/api/account/register',
        csrfToken,
        { name, email, password, token }
    );
}

export const verifyOTP = async (csrfToken, token) => {
    return POSTRequest(
        '/api/account/verify-otp',
        csrfToken,
        { token }
    );
}

export const update = async (csrfToken, name, email) => {
    return PATCHRequest(
        '/api/account/update',
        csrfToken,
        { name, email }
    );
}

export const updatePassword = async (csrfToken, password) => {
    return PATCHRequest(
        '/api/account/update-password',
        csrfToken,
        { password }
    );
}

export const forgotPassword = async (csrfToken, email) => {
    return POSTRequest(
        '/api/account/forgot-password',
        csrfToken,
        { email }
    );
}

export const validateCode = async (csrfToken, email, code) => {
    return POSTRequest(
        '/api/account/validate-code',
        csrfToken,
        { email, code }
    );
}

export const resetPassword = async (csrfToken, email, password, code) => {
    return POSTRequest(
        '/api/account/reset-password',
        csrfToken,
        { email, password, code }
    );
}

export const paymentInfoGET = async (csrfToken) => {
    return GETRequest(
        '/api/account/payment-info',
        csrfToken
    );
}

export const paymentInfoPUT = async (csrfToken, cardNumber, expirationDate, cvc) => {
    return PUTRequest(
        '/api/account/payment-info',
        csrfToken,
        { cardNumber, expirationDate, cvc }
    );
}

export const logout = async (csrfToken) => {
    return POSTRequest(
        '/api/account/logout',
        csrfToken
    );
}
