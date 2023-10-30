import { POSTRequest } from "../skeletonAPIMethods";

export const organisationApply = async (csrfToken, name, description, category, banner, poster) => {
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

export const organisationAll = async (csrfToken, category) => {
    return await POSTRequest({
        apiURL: '/api/organisation/all',
        csrfToken,
        requestBody: { category },
        templatedObject: null,
    });
}

export const organisationCategories = async (csrfToken) => {
    return await POSTRequest({
        apiURL: '/api/organisation/categories',
        csrfToken,
        requestBody: null,
        templatedObject: null,
    });
}
export const organisationId = async (csrfToken, id) => {
    return await POSTRequest({
        apiURL: '/api/organisation/{id}',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}
