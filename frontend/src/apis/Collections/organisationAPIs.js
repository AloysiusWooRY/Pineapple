import { GETRequest, POSTRequest } from "../skeletonAPIMethods";

export const apply = async (csrfToken, token) => {
    return POSTRequest(
        '/api/organisation/apply',
        csrfToken,
        { token }
    );
}

export const all = async (csrfToken, token) => {
    return GETRequest(
        '/api/organisation/all',
        csrfToken,
        { token }
    );
}

export const categories = async (csrfToken, token) => {
    return GETRequest(
        '/api/organisation/categories',
        csrfToken,
        { token }
    );
}
export const organisationId = async (csrfToken, token) => {
    return GETRequest(
        '/api/organisation/{id}',
        csrfToken,
        { token }
    );
}
