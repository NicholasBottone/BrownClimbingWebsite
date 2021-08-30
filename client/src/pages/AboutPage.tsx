import React from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";

export default function AboutPage() {
    return (
        <Container className="p-3 text-center">
            <Jumbotron>
                <h1>About Brown Climbing</h1>
                <br />
                <br />
                <p>
                    Brown Climbing is a community built around the love of all
                    disciplines of climbing (bouldering, top rope, lead, and
                    speed). Brown Climbing aims to provide recreational climbers
                    with greater opportunities to travel to local gyms through
                    shared transportation and aims to provide competitive
                    climbers with an opportunity to compete on the USA
                    Collegiate Climbing circuit through our competitive team. In
                    addition, Brown Climbing will create a supportive space
                    where members can improve their strength and technique in
                    all disciplines. Finally, Brown Climbing aims to spread
                    awareness of rock climbing on campus to new climbers and
                    increase the overall accessibility of climbing to all Brown
                    students.
                </p>
                <br />
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://i.ibb.co/J21w04L/hanging.jpg"
                            alt="Brown Climbing member hangs from a table"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://i.ibb.co/Gpbf3P9/rockwall.jpg"
                            alt="Rock wall gym"
                        />
                    </Carousel.Item>
                </Carousel>
            </Jumbotron>
        </Container>
    );
}
