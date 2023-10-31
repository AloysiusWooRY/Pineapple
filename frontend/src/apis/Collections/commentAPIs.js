import { POSTRequest, DELRequest, getCSRF } from "../skeletonAPIMethods";

export const commentNew = async ({ post = null, content = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/comment/new',
        csrfToken,
        requestBody: { post, content },
        templatedObject: null,
    });
}

export const commentAll = async ({ post = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/comment/all',
        csrfToken,
        requestBody: { post },
        templatedObject: null,
    });
}

export const commentIdLike = async ({ id = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/comment/{id}/like',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const commentIdDislike = async ({ id = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/comment/{id}/dislike',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const commentId = async ({ id = null } = {}) => {
    const csrfToken = await getCSRF();
    return await DELRequest({
        apiURL: '/api/comment/{id}',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

