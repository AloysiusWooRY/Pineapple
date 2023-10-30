import { POSTRequest, PATCHRequest, DELRequest } from "../skeletonAPIMethods";

export const postAll = async (csrfToken, organisation, category, filter, sortByPinned) => {
    return await POSTRequest({
        apiURL: '/api/post/all',
        csrfToken,
        requestBody: { organisation, category, filter, sortByPinned },
        templatedObject: null,
    });
}

export const postNew = async (csrfToken, title, description, organisation, event, event_location, event_capacity, event_time, donation, donation_goal, attachment) => {
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

export const postIdPOST = async (csrfToken, id) => {
    return await POSTRequest({
        apiURL: '/api/post/{id}',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdPATCH = async (csrfToken, id, title, description, organisation, event, event_location, event_capacity, event_time, donation, donation_goal, attachment) => {
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

export const postIdDEL = async (csrfToken, id) => {
    return await DELRequest({
        apiURL: '/api/post/{id}',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdImageDEL = async (csrfToken, id) => {
    return await DELRequest({
        apiURL: '/api/post/{id}/image',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdLike = async (csrfToken, id) => {
    return await POSTRequest({
        apiURL: '/api/post/{id}/like',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}

export const postIdDislike = async (csrfToken, id) => {
    return await POSTRequest({
        apiURL: '/api/post/{id}/dislike',
        csrfToken,
        requestBody: null,
        templatedObject: { id },
    });
}
