// WIP NOT SAFE FOR WORK

export const GETRequest = async (apiURL, csrfToken = null, requestBody = null) => {
    let response;

    await fetch(apiURL, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
    })
        .then(res => { response = res })
        .catch(err => console.log(err));

    return response;
}

export const POSTRequest = async (apiURL, csrfToken, requestBody = null) => {
    let response;

    await fetch(apiURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        },
        ...(requestBody ? { body: JSON.stringify(requestBody) } : {}),
    })
        .then(res => { response = res })
        .catch(err => console.log(err));

    return response;
}

export const PATCHRequest = async (apiURL, csrfToken, requestBody = null) => {
    let response;

    await fetch(apiURL, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        },
        ...(requestBody ? { body: JSON.stringify(requestBody) } : {}),
    })
        .then(res => { response = res })
        .catch(err => console.log(err));

    return response;
}

export const PUTRequest = async (apiURL, csrfToken, requestBody = null) => {
    let response;

    await fetch(apiURL, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        },
        ...(requestBody ? { body: JSON.stringify(requestBody) } : {}),
    })
        .then(res => { response = res })
        .catch(err => console.log(err));

    return response;
}

export const DELRequest = async (apiURL, csrfToken, requestBody = null) => {
    let response;

    await fetch(apiURL, {
        method: "DEL",
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        },
        ...(requestBody ? { body: JSON.stringify(requestBody) } : {}),
    })
        .then(res => { response = res })
        .catch(err => console.log(err));

    return response;
}
