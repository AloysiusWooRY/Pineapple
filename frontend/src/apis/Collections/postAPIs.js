import { POSTRequest, PATCHRequest, DELRequest, getCSRF } from "../skeletonAPIMethods";

export const postAll = async ({ organisation = null, category = null, filter = null, sortByPinned = null }) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/post/all',
        csrfToken,
        requestBody: { organisation, category, filter, sortByPinned },
        templatedObject: null,
    });
}

export const postNew = async ({ title = null, description = null, organisation = null, event = null, event_location = null, event_capacity = null, event_time = null, donation = null, donation_goal = null, attachment = null }) => {
    const csrfToken = await getCSRF();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("organisation", organisation);
    formData.append("event", event);
    formData.append("event_location", event_location);
    formData.append("event_capacity", event_capacity);
    formData.append("event_time", event_time);
    formData.append("donation", donation);
    formData.append("donation_goal", donation_goal);
    formData.append("attachment", attachment);

    return await POSTRequest({
        apiURL: '/api/post/new',
        csrfToken,
        requestBody: formData,
        templatedObject: null,
    });
}

export const postIdPOST = async ({ id = null }) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/post/{id}',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdPATCH = async ({ id = null, title = null, description = null, organisation = null, event = null, event_location = null, event_capacity = null, event_time = null, donation = null, donation_goal = null, attachment = null }) => {
    const csrfToken = await getCSRF();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("organisation", organisation);
    formData.append("event", event);
    formData.append("event_location", event_location);
    formData.append("event_capacity", event_capacity);
    formData.append("event_time", event_time);
    formData.append("donation", donation);
    formData.append("donation_goal", donation_goal);
    formData.append("attachment", attachment);

    return await PATCHRequest({
        apiURL: '/api/post/{id}',
        csrfToken,
        requestBody: formData,
        templatedObject: { id },
    });
}

export const postIdDEL = async ({ id = null }) => {
    const csrfToken = await getCSRF();
    return await DELRequest({
        apiURL: '/api/post/{id}',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdImageDEL = async ({ id = null }) => {
    const csrfToken = await getCSRF();
    return await DELRequest({
        apiURL: '/api/post/{id}/image',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdLike = async ({ id = null }) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/post/{id}/like',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdDislike = async ({ id = null }) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/post/{id}/dislike',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdPin = async ({ id = null }) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/post/{id}/pin',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdUnpin = async ({ id = null }) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/post/{id}/unpin',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}
