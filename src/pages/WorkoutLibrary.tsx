import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/workoutBg.png';
import thumbnail1 from '@/assets/workout/thumbnail1.png'
import thumbnail2 from '@/assets/workout/thumbnail2.png'
import thumbnail3 from '@/assets/workout/thumbnail3.png'
import playicon from '@/assets/workout/play-circle.png'
import { Button } from '@/components/ui/button';

const WorkoutLibrary = () => {
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
                    <h1 className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none">
                        <span className="text-primary">Workout</span>{" "}
                        <span className="text-white">Library</span>
                    </h1>
                    <div className="flex flex-col items-center">
                        <span className="text-white font-bold text-[26px] leading-[26px]">
                            Home / Workout Library
                        </span>
                    </div>
                </div>
            </section>
            <section className="bg-primary py-5">
                <div className=" mx-auto ">
                    <p className='uppercase text-white text-center font-[16px] font-bold'>The WORKOUT LIBRARY IS AVAILABLE ONLY FOR members of The Passion Physique, Please JOIN OR LOGIN to access all books </p>
                </div>
            </section>
            {/* Books Section */}
            <section className="py-[120px] ">
                <div className="container px-4">
                    <p className="text-white text-[15px] font-[400] mb-10">
                        Access our Coaching Workout Library for a wide range of expert-designed training programs. From beginner to advanced, each workout is tailored to support your goals with structured, effective routines
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                        {workoutVideos.map((video, index) => (
                            <div key={video.id} className="group animate-fade-in mb-20" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="relative mb-6">
                                    <div className="relative">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0  flex items-center justify-center">
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
                            </div>
                        ))}
                        {workoutVideos.map((video, index) => (
                            <div key={video.id} className="group animate-fade-in mb-20" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="relative mb-6">
                                    <div className="relative">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0  flex items-center justify-center">
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
                            </div>
                        ))}
                        {workoutVideos.map((video, index) => (
                            <div key={video.id} className="group animate-fade-in mb-20" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="relative mb-6">
                                    <div className="relative">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0  flex items-center justify-center">
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
                            </div>
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