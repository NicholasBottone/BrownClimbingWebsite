import { UserType } from "../types";

// fetches the user if the user is logged in on the backend
export async function fetchUser(
    setAuthenticated: (authenticated: boolean) => void,
    setUser: (user: UserType) => void,
    setError: (error: string) => void
) {
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/auth/login/success`,
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
        // if the user is logged in, set the user and authenticated flag
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
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/auth/check-auth`,
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

export const handleLoginClick = () => {
    window.open(`${process.env.REACT_APP_API_BASE_URL}/auth/google`, "_self");
};

export const handleLogoutClick = () => {
    window.open(`${process.env.REACT_APP_API_BASE_URL}/auth/logout`, "_self");
};
