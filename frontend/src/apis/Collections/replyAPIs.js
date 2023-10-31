import { POSTRequest, DELRequest, getCSRF } from "../skeletonAPIMethods";

export const replyNew = async ({ comment = null, content = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/reply/new',
        csrfToken,
        requestBody: { comment, content },
        templatedObject: null,
    });
}

export const replyIdLike = async ({ id = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/reply/{id}/like',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const replyIdDislike = async ({ id = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/reply/{id}/dislike',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const replyId = async ({ id = null } = {}) => {
    const csrfToken = await getCSRF();
    return await DELRequest({
        apiURL: '/api/reply/{id}',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}