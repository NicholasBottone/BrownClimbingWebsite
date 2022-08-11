import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer fixed-bottom bg-primary text-white text-center p-3 text-lg-start">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-envelope-fill"
                viewBox="0 0 16 16"
            >
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
            </svg>{" "}
            Contact Us:{" "}
            <a className="text-light" href="mailto:climbing@brown.edu">
                <u>climbing@brown.edu</u>
            </a>{" "}
            |{" "}
            <Link className="text-light" to="/privacy">
                <u>Privacy &amp; Terms</u>
            </Link>{" "}
            | © 2022 Brown Climbing.
            <br /> This website was developed by{" "}
            <a className="text-light" href="https://fullstackatbrown.com">
                <u>Full Stack at Brown</u>
            </a>{" "}
            and is{" "}
            <a
                className="text-light"
                href="https://github.com/NicholasBottone/BrownClimbingWebsite"
            >
                <u>open source</u>
            </a>
            !
        </footer>
    );
}
