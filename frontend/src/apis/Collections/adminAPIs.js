import { POSTRequest, getCSRF } from "../skeletonAPIMethods";

export const adminAccountEditRole = async ({ account = null, role = null, moderation = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/admin/account/edit-role',
        csrfToken,
        requestBody: { account, role, moderation },
        templatedObject: null,
    });
}

export const adminAccountAll = async () => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/admin/account/all',
        csrfToken,
        requestBody: null,
        templatedObject: null,
    });
}

export const adminApplication = async ({ status = null, filter = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/admin/application',
        csrfToken,
        requestBody: { status, filter },
        templatedObject: null,
    });
}

export const adminApplicationIdApprove = async ({id = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/admin/application/{id}/approve',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const adminApplicationIdReject = async ({id = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/admin/application/{id}/reject',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}
