// fetches the user if the user is logged in on the backend
export async function fetchUser(
    setAuthenticated: Function,
    setUser: Function,
    setError: Function
) {
    try {
        const res = await fetch("http://localhost:4000/auth/login/success", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true",
            },
        });
        if (res.status === 200) {
            const resJson = await res.json();
            setAuthenticated(true);
            setUser(resJson.user);
        } else {
            throw new Error("failed to authenticate user");
        }
    } catch (error) {
        console.error(error);
        setAuthenticated(false);
        setError("Failed to authenticate user");
    }
}

// checks if the user is authenticated (probably just going to be used for test purposes)
export async function checkAuth() {
    try {
        const res = await fetch("http://localhost:4000/auth/check-auth", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true",
            },
        });

        if (res.status === 200) {
            const resJson = await res.json();
            console.log(resJson.user);
        } else {
            throw new Error("user is not authenticated");
        }
    } catch (error) {
        console.error(error);
    }
}
