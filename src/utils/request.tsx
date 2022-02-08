export default async function (url: RequestInfo, method = 'GET', value = null) {
    try {
        let body = null;

        if (value !== null)
            body = JSON.stringify(value);

        let response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }, body: body,
        });

        let data = await response.json();
        return data;

    } catch (e) {
        console.error(e);

    }
}
