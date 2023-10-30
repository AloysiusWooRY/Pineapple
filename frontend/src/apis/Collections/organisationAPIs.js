import { POSTRequest } from "../skeletonAPIMethods";

export const organisationApply = async ({ csrfToken = null, name = null, description = null, category = null, banner = null, poster = null } = {}) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("banner", banner);
    formData.append("poster", poster);

    return await POSTRequest({
        apiURL: '/api/organisation/apply',
        csrfToken,
        requestBody: formData,
        templatedObject: null,
    });
}

export const organisationAll = async ({ csrfToken = null, category = null } = {}) => {
    return await POSTRequest({
        apiURL: '/api/organisation/all',
        csrfToken,
        requestBody: { category },
        templatedObject: null,
    });
}

export const organisationCategories = async ({ csrfToken = null } = {}) => {
    return await POSTRequest({
        apiURL: '/api/organisation/categories',
        csrfToken,
        requestBody: null,
        templatedObject: null,
    });
}
export const organisationId = async ({ csrfToken = null, id = null } = {}) => {
    return await POSTRequest({
        apiURL: '/api/organisation/{id}',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}
