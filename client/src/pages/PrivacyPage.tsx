import React from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

export default function AboutPage() {
    return (
        <Container className="p-3 text-center">
            <Jumbotron>
                <h1>Privacy Policy</h1>
                <p>
                    Thank you for choosing to be part of Brown Climbing ("we",
                    "us", "our"). We are committed to protecting your personal
                    information and your right to privacy. If you have any
                    questions or concerns about this privacy notice, or our
                    practices with regards to your personal information, please
                    contact us at{" "}
                    <a href="mailto:climbing@brown.edu">climbing@brown.edu</a>.
                </p>
                <p>
                    When you visit our website{" "}
                    <a href="https://brownclimbingclub.com">
                        https://brownclimbingclub.com
                    </a>{" "}
                    (the "Website"), and more generally, use any of our services
                    (the "Services", which include the Website), we appreciate
                    that you are trusting us with your personal information. We
                    take your privacy very seriously. In this privacy notice, we
                    seek to explain to you in the clearest way possible what
                    information we collect, how we use it and what rights you
                    have in relation to it. We hope you take some time to read
                    it carefully, as it is important. If there are any terms in
                    this privacy notice that you do not agree with, please
                    discontinue use of our Services immediately.
                </p>
                <p></p>
                <h3>What Information We Collect</h3>
                <p>
                    <strong>Personal information you disclose to us:</strong>
                </p>
                <p>
                    Personal Information Provided by You. We collect display
                    names, email addresses, event data, and other similar
                    information. We do not directly collect or store passwords.
                </p>
                <p>
                    Social Media Login Data. We provide you with the option to
                    register with us using your existing Google account details.
                    If you choose to register in this way, we will receive
                    certain profile information about you from Google. The
                    profile information we receive includes your profile
                    picture, email address, and name. Please note that we do not
                    control, and are not responsible for, other uses of your
                    personal information by Google. We recommend that you review{" "}
                    <a href="https://policies.google.com/privacy">
                        their privacy notice
                    </a>{" "}
                    to understand how they collect, use and share your personal
                    information, and how you can set your privacy preferences on
                    their sites and apps.
                </p>
                <p>
                    All personal information that you provide to us must be
                    true, complete and accurate, and you must notify us of any
                    changes to such personal information.
                </p>
                <p></p>
                <p>
                    <strong>Information automatically collected:</strong>
                </p>
                <p>
                    Log and Usage Data. Log and usage data is service-related,
                    diagnostic, usage and performance information our servers
                    automatically collect when you access or use our Website and
                    which we record in log files. Depending on how you interact
                    with us, this log data may include your IP address, device
                    information, browser type and settings and information about
                    your activity in the Website (such as the date/time stamps
                    associated with your usage, pages and files viewed, searches
                    and other actions you take such as which features you use),
                    device event information (such as system activity, error
                    reports (sometimes called 'crash dumps') and hardware
                    settings).
                </p>
                <p>
                    Device Data. We collect device data such as information
                    about your computer, phone, tablet or other device you use
                    to access the Website. Depending on the device used, this
                    device data may include information such as your IP address
                    (or proxy server), device and application identification
                    numbers, location, browser type, hardware model Internet
                    service provider and/or mobile carrier, operating system and
                    system configuration information.
                </p>
                <p></p>
                <h3>How We Keep Your Information Safe</h3>
                <p>
                    Since our website is fully{" "}
                    <a href="https://github.com/NicholasBottone/BrownClimbingWebsite">
                        open source
                    </a>
                    , you can see exactly how your information is processed
                    behind the scenes. We aim to protect your personal
                    information through a system of organizational and technical
                    security measures. We have implemented appropriate technical
                    and organizational security measures designed to protect the
                    security of any personal information we process. However,
                    despite our safeguards and efforts to secure your
                    information, no electronic transmission over the Internet or
                    information storage technology can be guaranteed to be 100%
                    secure, so we cannot promise or guarantee that hackers,
                    cybercriminals, or other unauthorized third parties will not
                    be able to defeat our security, and improperly collect,
                    access, steal, or modify your information. Although we will
                    do our best to protect your personal information,
                    transmission of personal information to and from our Website
                    is at your own risk. You should only access the Website
                    within a secure environment.
                </p>
                <p></p>
                <h3>How We Use Your Information</h3>
                <p>
                    We use personal information collected via our Website to
                    facilitate the account creation and logon process, to manage
                    user accounts, to display public leaderboard data, to
                    request feedback, and for other business purposes.
                    <br />
                    We only share information with your consent, to comply with
                    laws, to provide you with services, to protect your rights,
                    or to fulfill business obligations. We only share
                    information with the following third parties detailed below.
                    <br />
                    We use your email address to send you confirmation emails to
                    the events you create or register for. We may also send
                    reminder emails or updates regarding changed status of
                    events we offer.
                </p>
                <p></p>
                <h3>Third-Party Services</h3>
                <p>
                    For content optimization, we make use of Cloudflare content
                    delivery network, YouTube video embeds, and ImgBB image
                    embeds.
                    <br />
                    For web and mobile analytics, we make use of Google
                    Analytics and Microsoft Clarity.
                    <br />
                    For user account registration and authentication, we make
                    use of Google OAuth2.
                </p>
                <p>
                    Data that is collected for analytic purposes is anonymized
                    and stripped of personally identifiable information.
                    Third-party analytic services like Google and Microsoft will
                    never receive personally identifiable data.
                    <br />
                    As a result of our use of Google Analytics, the Google{" "}
                    <a href="https://policies.google.com/terms">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="https://policies.google.com/privacy">
                        Privacy Policy
                    </a>{" "}
                    apply to this site. You can opt-out from Google Analytics{" "}
                    <a href="https://tools.google.com/dlpage/gaoptout">here</a>.
                </p>
                <p></p>
                <h3>Cookies and Tracking</h3>
                <p>
                    When you register or login to an account on the Website, we
                    store a cookie with a user session id that allows us to keep
                    you signed-in to your account across multiple visits in the
                    same browser.
                </p>
                <p>
                    Google Analytics and Microsoft Clarity both use a "tracking
                    beacon" cookie for all users, which allows the analytic
                    software to identify unique visitors. Some embedded image
                    and video content hosted third-party websites may utilize
                    cookies depending on how you interact with the content.
                    These third-party cookies are not controlled by us.
                </p>
                <p></p>
                <h3>Reviewing, Updating, and Deleting Your Data</h3>
                <p>
                    You have the right to request access to the personal
                    information we collect from you, change that information, or
                    delete it in some circumstances. You may view instantly view
                    all information we have stored for your account{" "}
                    <Link to="/myaccount">here</Link>. To request to review,
                    update, or delete your personal information, please send an
                    email to{" "}
                    <a href="mailto:climbing@brown.edu">climbing@brown.edu</a>.
                    We will respond to your request within 30 days.
                </p>
            </Jumbotron>
        </Container>
    );
}
