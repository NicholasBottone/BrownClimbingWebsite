import React from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

const carouselImages = [
    { src: "https://i.ibb.co/pRXv7kC/Divisonals.webp", alt: "divisionals" },
    { src: "https://i.ibb.co/42fztq0/steep-angle-wall.webp", alt: "steep" },
    { src: "https://i.ibb.co/fxLXJDd/rope-climb.webp", alt: "rope climb" },
    { src: "https://i.ibb.co/ygVbmFB/gym-wall.webp", alt: "climb gym wall" },
    { src: "https://i.ibb.co/WDCHM0b/hanging-from-rock.webp", alt: "rock" },
    { src: "https://i.ibb.co/Pc75C5s/rockwall.webp", alt: "rock wall" },
    { src: "https://i.ibb.co/09V8M50/rope-climb-2.webp", alt: "rope climb" },
    { src: "https://i.ibb.co/vhYfcVH/hanging.webp", alt: "hanging from table" },
];

export default function HomePage() {
    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>
                        <Image src="https://i.ibb.co/Cmj09tc/logo192.webp" />
                        <br />
                        Brown Climbing
                    </h1>
                    <br />
                    <Button as={Link} to="/calendar" variant="primary">
                        View our events calendar
                    </Button>
                    <br />
                    <br />
                    <br />
                    <p className="lead">
                        Brown Climbing is a community built around the love of
                        all disciplines of climbing (bouldering, top rope, lead,
                        and speed). Brown Climbing aims to provide recreational
                        climbers with greater opportunities to travel to local
                        gyms through shared transportation and aims to provide
                        competitive climbers with an opportunity to compete on
                        the USA Collegiate Climbing circuit through our
                        competitive team. In addition, Brown Climbing will
                        create a supportive space where members can improve
                        their strength and technique in all disciplines.
                        Finally, Brown Climbing aims to spread awareness of rock
                        climbing on campus to new climbers and increase the
                        overall accessibility of climbing to all Brown students.
                    </p>
                    <br />
                    <Carousel>
                        {carouselImages.map((image) => (
                            <Carousel.Item key={image.src}>
                                <img
                                    className="d-block w-100"
                                    src={image.src}
                                    alt={image.alt}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Jumbotron>
            </Container>
        </div>
    );
}
