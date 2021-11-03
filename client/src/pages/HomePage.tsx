import React, { lazy, Suspense } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const carouselImages = [
    { src: "https://i.ibb.co/ByZb6Zj/group.webp", alt: "group at gym" },
    { src: "https://i.ibb.co/L1R2f4H/hanging.webp", alt: "hanging from wall" },
    { src: "https://i.ibb.co/fDqYxYh/Divisonals.webp", alt: "divisionals" },
    { src: "https://i.ibb.co/42fztq0/steep-angle-wall.webp", alt: "steep" },
    { src: "https://i.ibb.co/fxLXJDd/rope-climb.webp", alt: "rope climb" },
    { src: "https://i.ibb.co/ygVbmFB/gym-wall.webp", alt: "climb gym wall" },
    { src: "https://i.ibb.co/WDCHM0b/hanging-from-rock.webp", alt: "rock" },
    { src: "https://i.ibb.co/09V8M50/rope-climb-2.webp", alt: "rope climb" },
];

export default function HomePage() {
    const Carousel = lazy(() => import("react-bootstrap/Carousel"));
    const CarouselItem = lazy(() => import("react-bootstrap/CarouselItem"));

    return (
        <div>
            <Container className="p-3 text-center">
                <Jumbotron>
                    <h1>
                        <img
                            src="https://i.ibb.co/Cmj09tc/logo192.webp"
                            alt="logo"
                        />
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
                    <Suspense fallback={<div>Loading...</div>}>
                        <Carousel>
                            {carouselImages.map((image) => (
                                <CarouselItem key={image.src}>
                                    <img
                                        className="d-block w-100"
                                        src={image.src}
                                        alt={image.alt}
                                    />
                                </CarouselItem>
                            ))}
                        </Carousel>
                    </Suspense>
                </Jumbotron>
            </Container>
        </div>
    );
}
