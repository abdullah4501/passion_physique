import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/workoutBg.png';
import thumbnail1 from '@/assets/workout/thumbnail1.png'
import thumbnail2 from '@/assets/workout/thumbnail2.png'
import thumbnail3 from '@/assets/workout/thumbnail3.png'
import playicon from '@/assets/workout/play-circle.png'
import { Button } from '@/components/ui/button';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

    const workoutVideos = [
        {
            id: 1,
            title: "Coaching Video 1",
            description: "A balanced workout targeting all major muscle groups to build strength, endurance, and improve overall fitness.",
            thumbnail: thumbnail1
        },
        {
            id: 2,
            title: "Coaching Video 2",
            description: "Activate and strengthen your glutes and core with focused exercises designed for stability and shape.",
            thumbnail: thumbnail2
        },
        {
            id: 3,
            title: "Coaching Video 3",
            description: "Tone and define your chest, back, shoulders, and arms with this effective upper body training session.",
            thumbnail: thumbnail3
        }
    ];

// Card and title animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 38, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};
const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

const WorkoutLibrary = () => {
    // Animate grid cards
    const cardsRef = useRef(null);
    const cardsInView = useInView(cardsRef, { once: true, margin: "-100px" });

    // Animate hero title
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                {/* Banner Image */}
                <img
                    src={bannerImg}
                    alt="Workoutout Library"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />

                {/* Overlay for extra darkening (if needed) */}
                <div className="absolute inset-0 " />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        ref={heroRef}
                        className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
                        variants={titleVariants}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
                    >
                        <span className="text-primary">Workout</span>{" "}
                        <span className="text-white">Library</span>
                    </motion.h1>
                    <motion.div
                        variants={titleVariants}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        transition={{ duration: 1, delay: 0.14, ease: [0.42, 0, 0.2, 1] }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / Workout Library
                        </span>
                    </motion.div>
                </div>
            </section>
            <section className="bg-primary py-5">
                <div className=" mx-auto ">
                    <p className='uppercase text-white text-center font-[16px] font-bold'>The WORKOUT LIBRARY IS AVAILABLE ONLY FOR members of The Passion Physique, Please JOIN OR LOGIN to access all books </p>
                </div>
            </section>
            {/* Workout Cards Section */}
            <section className="py-[120px] ">
                <div className="container px-4">
                    <p className="text-white text-[15px] font-[400] mb-10">
                        Access our Coaching Workout Library for a wide range of expert-designed training programs. From beginner to advanced, each workout is tailored to support your goals with structured, effective routines
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={cardsRef}>
                        {workoutVideos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                className="group mb-20"
                                variants={cardVariants}
                                initial="hidden"
                                animate={cardsInView ? "visible" : "hidden"}
                                transition={{
                                    duration: 0.65,
                                    ease: [0.42, 0, 0.2, 1],
                                    delay: index * 0.13
                                }}
                                whileHover={{
                                    scale: 1.04,
                                    boxShadow: "0 8px 38px 0 rgba(237,35,42,0.13)"
                                }}
                            >
                                <div className="relative mb-6">
                                    <div className="relative">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className=" transition-colors">
                                                <img src={playicon} />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-[2px] left-0">
                                            <span className="bg-primary px-[45px] py-1 text-[12px] tracking-[1.2px] font-medium text-white">
                                                LEVEL 1
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-primary text-[14px] leading[23px] tracking[1px] font-semibold">FOR MEMBERS ONLY</span>
                                </div>
                                <h3 className="text-white text-[20px] font-normal leading-[30px] mb-3">{video.title}</h3>
                                <p className="text-white text-[15px] leading-[25px] font-normal">
                                    {video.description}
                                </p>
                            </motion.div>
                        ))}
                        {workoutVideos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                className="group mb-20"
                                variants={cardVariants}
                                initial="hidden"
                                animate={cardsInView ? "visible" : "hidden"}
                                transition={{
                                    duration: 0.65,
                                    ease: [0.42, 0, 0.2, 1],
                                    delay: index * 0.13
                                }}
                                whileHover={{
                                    scale: 1.04,
                                    boxShadow: "0 8px 38px 0 rgba(237,35,42,0.13)"
                                }}
                            >
                                <div className="relative mb-6">
                                    <div className="relative">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className=" transition-colors">
                                                <img src={playicon} />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-[2px] left-0">
                                            <span className="bg-primary px-[45px] py-1 text-[12px] tracking-[1.2px] font-medium text-white">
                                                LEVEL 1
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-primary text-[14px] leading[23px] tracking[1px] font-semibold">FOR MEMBERS ONLY</span>
                                </div>
                                <h3 className="text-white text-[20px] font-normal leading-[30px] mb-3">{video.title}</h3>
                                <p className="text-white text-[15px] leading-[25px] font-normal">
                                    {video.description}
                                </p>
                            </motion.div>
                        ))}
                        {workoutVideos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                className="group mb-20"
                                variants={cardVariants}
                                initial="hidden"
                                animate={cardsInView ? "visible" : "hidden"}
                                transition={{
                                    duration: 0.65,
                                    ease: [0.42, 0, 0.2, 1],
                                    delay: index * 0.13
                                }}
                                whileHover={{
                                    scale: 1.04,
                                    boxShadow: "0 8px 38px 0 rgba(237,35,42,0.13)"
                                }}
                            >
                                <div className="relative mb-6">
                                    <div className="relative">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className=" transition-colors">
                                                <img src={playicon} />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-[2px] left-0">
                                            <span className="bg-primary px-[45px] py-1 text-[12px] tracking-[1.2px] font-medium text-white">
                                                LEVEL 1
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-primary text-[14px] leading[23px] tracking[1px] font-semibold">FOR MEMBERS ONLY</span>
                                </div>
                                <h3 className="text-white text-[20px] font-normal leading-[30px] mb-3">{video.title}</h3>
                                <p className="text-white text-[15px] leading-[25px] font-normal">
                                    {video.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-left">
                        <Button className="hero-button px-[45px]">
                            READ MORE
                        </Button>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default WorkoutLibrary;
