import SectionWrapper from "@/components/SectionWrapper";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import playicon from '@/assets/workout/play-circle.png';
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";


const VideoModal = ({ open, onClose, videoUrl, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#181818] rounded-lg p-5 shadow-xl max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-white text-3xl font-bold hover:text-primary"
        >
          ×
        </button>
        <h3 className="text-white text-lg mb-3">{title}</h3>
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full"
          style={{
            maxHeight: '80vh',
            maxWidth: '100%',
            objectFit: 'contain',
            background: '#000',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </div>
    </div>
  );
};
const cardVariants = {
  hidden: { opacity: 0, y: 38, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};


const WorkoutLibrarySection = () => {

  const [videos, setVideos] = useState([]);
  const [workoutVideos, setWorkoutVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-100px' });
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, user is not logged in. isMember: false');
      setIsMember(false);
      setUserLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/members/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Membership status:', data.isMember); // Log true/false
        setIsMember(data.isMember);
        setUserLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching membership status:', error);
        setIsMember(false);
        setUserLoading(false);
      });
  }, []);

  // Fetch workout videos
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/workout-library`)
      .then((res) => res.json())
      .then((data) => {
        setWorkoutVideos((data.videos || []).slice(0, 3));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
        setLoading(false);
      });
  }, []);
  const handlePlay = (video) => {
    setActiveVideo(video);
    setModalOpen(true);
  };

  return (
    <section className="pt-[120px] pb-[60px]">
      <div className="container mx-auto px-4">
        <SectionWrapper>
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Our Coaching <br />
              <span className="text-primary">WORKOUT LIBRARY</span>
            </h2>
            <p className="text-white text-[14px] max-w-4xl mx-auto leading-[24px] font-normal">
              Access our Coaching Workout Library for a wide range of expert-designed training programs. From
              beginner to advanced, each workout is tailored to support your goals with structured, effective routines
            </p>
          </div>
        </SectionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={cardsRef}>
          {!loading &&
            workoutVideos.map((video, index) => {
              const isLocked = video.forMembersOnly && !isMember;
              return (
                <motion.div
                  key={video._id}
                  className={`group mb-20 cursor-pointer relative`}
                  variants={cardVariants}
                  initial="hidden"
                  animate={cardsInView ? 'visible' : 'hidden'}
                  transition={{
                    duration: 0.65,
                    ease: [0.42, 0, 0.2, 1],
                    delay: index * 0.13,
                  }}
                  whileHover={
                    !isLocked
                      ? { scale: 1.04, boxShadow: '0 8px 38px 0 rgba(237,35,42,0.13)' }
                      : {}
                  }
                  onClick={() => !isLocked && handlePlay(video)}
                  style={{ pointerEvents: isLocked ? 'none' : 'auto' }}
                >
                  <div className="relative mb-6">
                    <div className="relative group">
                      <video
                        src={`${import.meta.env.VITE_API_URL}${video.videoUrl}`}
                        className={`object-cover w-full max-h-[270px] ${isLocked ? 'blur-[8px]' : ''}`}
                        poster=""
                        style={{ pointerEvents: 'none' }}
                      />
                      {isLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <img src={playicon} className="w-[60px] h-[60px] opacity-60 mb-3" />
                        </div>
                      )}
                      {!isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center transition-colors">
                          <img src={playicon} className="w-[60px] h-[60px]" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0">
                        <span className="bg-primary px-[45px] py-1 text-[12px] tracking-[1.2px] font-medium text-white">
                          LEVEL {video.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-primary text-[14px] font-semibold">
                      {video.forMembersOnly ? 'FOR MEMBERS ONLY' : 'PUBLIC'}
                    </span>
                  </div>
                  <h3 className="text-white text-[20px] font-normal leading-[30px] mb-3 flex items-center gap-2">
                    {video.title}
                    {video.category?.name && (
                      <Badge
                        className="ml-2"
                        variant="default" // or "destructive" if you want red (see below)
                      >
                        {video.category.name}
                      </Badge>
                    )}
                  </h3>

                  <p className="text-white text-[15px] leading-[25px] font-normal">
                    {video.description}
                  </p>
                </motion.div>
              );
            })}
        </div>
        <VideoModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          videoUrl={activeVideo ? `${import.meta.env.VITE_API_URL}${activeVideo.videoUrl}` : ''}
          title={activeVideo?.title || ''}
        />

        <SectionWrapper>
          <div className="text-center">
            <Link to={'/workout-library'} className="hero-button px-[45px]">
              READ MORE
            </Link>
          </div>
        </SectionWrapper>
      </div>
    </section>
  );
};

export default WorkoutLibrarySection;
