// WIP NOT SAFE FOR WORK

export const GETRequest = async ({ apiURL = '', csrfToken = null, templatedObject = null } = {}) => {
    let response;

    if (templatedObject) {
        apiURL = templateLiterally(apiURL, templatedObject);
    }

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

export const POSTRequest = async ({ apiURL = '', csrfToken = null, requestBody = null, templatedObject = null } = {}) => {
    let response;

    if (templatedObject) {
        apiURL = templateLiterally(apiURL, templatedObject);
    }

    const [preppedHeaders, preppedBody] = prepareRequest(csrfToken, requestBody);

    // Only non-null bodies are added
    await fetch(apiURL, {
        method: "POST",
        headers: preppedHeaders,
        ...(requestBody ? ({ body: preppedBody }) : {}),
    })
        .then(res => { response = res })
        .catch(err => console.log(err));

    return response;
}

export const PATCHRequest = async (apiURL, csrfToken, requestBody = null, templatedObject = null) => {
    let response;

    if (templatedObject) {
        apiURL = templateLiterally(apiURL, templatedObject);
    }

    const [preppedHeaders, preppedBody] = prepareRequest(csrfToken, requestBody);

    // Only non-null bodies are added
    await fetch(apiURL, {
        method: "PATCH",
        headers: preppedHeaders,
        ...(requestBody ? ({ body: preppedBody }) : {}),
    })
        .then(res => { response = res })
        .catch(err => console.log(err));

    return response;
}

export const PUTRequest = async (apiURL, csrfToken, requestBody = null, templatedObject = null) => {
    let response;

    if (templatedObject) {
        apiURL = templateLiterally(apiURL, templatedObject);
    }

    const [preppedHeaders, preppedBody] = prepareRequest(csrfToken, requestBody);

    // Only non-null bodies are added
    await fetch(apiURL, {
        method: "PUT",
        headers: preppedHeaders,
        ...(requestBody ? ({ body: preppedBody }) : {}),
    })
        .then(res => { response = res })
        .catch(err => console.log(err));

    return response;
}

export const DELRequest = async (apiURL, csrfToken, requestBody = null, templatedObject = null) => {
    let response;

    if (templatedObject) {
        apiURL = templateLiterally(apiURL, templatedObject);
    }

    const [preppedHeaders, preppedBody] = prepareRequest(csrfToken, requestBody);

    // Only non-null bodies are added
    await fetch(apiURL, {
        method: "DEL",
        headers: preppedHeaders,
        ...(requestBody ? ({ body: preppedBody }) : {}),
    })
        .then(res => { response = res })
        .catch(err => console.log(err));

    return response;
}

// Requires an input like this: 'example/{key_name}/example'
const templateLiterally = (template, idObject) => {
    // Fine. I'll do it myself...

    for (const key in idObject) {
        const placeholder = `{${key}}`;
        template = template.replace(placeholder, idObject[key]);
    }

    return template;
}

const prepareRequest = (csrfToken, requestBody) => {
    let preppedHeaders, preppedBody;

    // No body
    if (!requestBody) {
        preppedHeaders = { 'x-csrf-token': csrfToken };
    }
    // FormData
    else if (requestBody instanceof FormData) {
        preppedHeaders = {
            // 'Content-Type': 'multipart/form-data',
            'x-csrf-token': csrfToken
        };
        preppedBody = requestBody;
    }
    // Raw
    else {
        preppedHeaders = {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        };
        preppedBody = JSON.stringify(requestBody);
    }

    return [preppedHeaders, preppedBody];
}