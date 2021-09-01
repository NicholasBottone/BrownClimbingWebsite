export async function fetchUsers() {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/admin/users`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": "true",
                },
            }
        );
        if (res.ok) {
            // gets the data and converts it a json
            const resJson = await res.json();
            // return the user list to be displayed
            return resJson.users;
        } else {
            console.error(res);
            return `Error fetching the users: ${res.status} - ${res.statusText}
            - ${await res.text()}`;
        }
    } catch (error) {
        console.error(error);
        return "Failed to fetch the users from the database.";
    }
}

export async function fetchEvents() {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/admin/events`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": "true",
                },
            }
        );
        if (res.ok) {
            // gets the data and converts it a json
            const resJson = await res.json();
            // return the event list to be displayed
            return resJson.events;
        } else {
            console.error(res);
            return `Error fetching the events: ${res.status} - ${res.statusText}
            - ${await res.text()}`;
        }
    } catch (error) {
        console.error(error);
        return "Failed to fetch the event list from the database.";
    }
}
