import { POSTRequest, getCSRF } from "../skeletonAPIMethods";

export const organisationApply = async ({name = null, description = null, category = null, banner = null, poster = null } = {}) => {
    const csrfToken = await getCSRF();

    const formData = new FormData();
    if (name) formData.append("name", name);
    if (description) formData.append("description", description);
    if (category) formData.append("category", category);
    if (banner) formData.append("banner", banner);
    if (poster) formData.append("poster", poster);
    
    return await POSTRequest({
        apiURL: '/api/organisation/apply',
        csrfToken,
        requestBody: formData,
        templatedObject: null,
    });
}

export const organisationAll = async ({category = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/organisation/all',
        csrfToken,
        requestBody: { category },
        templatedObject: null,
    });
}

export const organisationAllName = async () => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/organisation/all/name',
        csrfToken,
        requestBody: null,
        templatedObject: null,
    });
}

export const organisationCategories = async () => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/organisation/categories',
        csrfToken,
        requestBody: null,
        templatedObject: null,
    });
}
export const organisationId = async ({id = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/organisation/{id}',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}
