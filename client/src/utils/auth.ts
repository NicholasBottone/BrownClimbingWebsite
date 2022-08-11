import { UserType } from "../types";

// fetches the user if the user is logged in on the backend
export async function fetchUser(
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
        const resJson = await res.json();
        if (resJson.success) {
            setUser(resJson.user);
        } else {
            throw new Error("failed to authenticate user");
        }
    } catch (error) {
        setError("Failed to authenticate user");
    }
}

export const handleLoginClick = () => {
    window.open(`${process.env.REACT_APP_API_BASE_URL}/auth/google`, "_self");
};

export const handleLogoutClick = () => {
    window.open(`${process.env.REACT_APP_API_BASE_URL}/auth/logout`, "_self");
};
