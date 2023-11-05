import { POSTRequest, getCSRF } from "../skeletonAPIMethods";

export const transactionNew = async ({ post = null, amount = null, cvc = null } = {}) => {
    const csrfToken = await getCSRF();
    return await POSTRequest({
        apiURL: '/api/transaction/new',
        csrfToken,
        requestBody: { post, amount, cvc },
        templatedObject: null,
    });
}