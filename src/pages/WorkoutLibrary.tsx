import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/workoutBg.png';
import playicon from '@/assets/workout/play-circle.png';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const VideoModal = ({ open, onClose, videoId, title }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch signed URL
  useEffect(() => {
    if (!open || !videoId) {
      setVideoSrc('');
      setError(null);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view this video');
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/workout-library/signed-url/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setVideoSrc(data.signedUrl);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching signed URL:', error.message);
        setError('Failed to load video. Please try again.');
      });
  }, [open, videoId]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const handleLoadStart = () => console.log('Video load started:', videoSrc);
    const handleLoadedData = () => console.log('Video data loaded successfully');
    const handleError = (e: Event) => {
      const error = (e.target as HTMLVideoElement).error;
      console.error('Video error:', error?.message || 'Unknown error', 'Code:', error?.code);
      setError('Failed to play video. Please try again.');
    };
    const handleCanPlay = () => console.log('Video can play');
    const handleStalled = () => console.log('Video stalled');
    const handleAbort = () => console.log('Video load aborted');

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('abort', handleAbort);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('abort', handleAbort);
    };
  }, [videoSrc]);

  if (!open) {
    return null;
  }

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
        {error && (
          <div className="text-red-500 mb-3">{error}</div>
        )}
        <video
          ref={videoRef}
          src={videoSrc}
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

// Card and title animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 38, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};
const titleVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const WorkoutLibrary = () => {
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-100px' });
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });

  const [workoutVideos, setWorkoutVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // Check membership status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
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
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setWorkoutVideos(data.videos);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
        setLoading(false);
      });
  }, []);

  const handlePlay = (video: any) => {
    setActiveVideo(video);
    setModalOpen(true);
  };

  return (
    <>
      <Header />
      <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
        <img
          src={bannerImg}
          alt="Workout Library"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
        <div className="absolute inset-0" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <motion.h1
            ref={heroRef}
            className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
            variants={titleVariants}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
          >
            <span className="text-primary">Workout</span>{' '}
            <span className="text-white">Library</span>
          </motion.h1>
          <motion.div
            variants={titleVariants}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
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
        <div className="mx-auto">
          <p className="uppercase text-white text-center text-[16px] font-bold">
            The WORKOUT LIBRARY IS AVAILABLE ONLY FOR MEMBERS OF The Passion
            Physique, Please JOIN OR LOGIN to access all videos
          </p>
        </div>
      </section>
      <section className="py-[120px]">
        <div className="container px-4">
          <p className="text-white text-[15px] font-[400] mb-10">
            Access our Coaching Workout Library for a wide range of
            expert-designed training programs. From beginner to advanced, each
            workout is tailored to support your goals with structured, effective
            routines
          </p>
          {userLoading && <div className="text-white">Checking membership...</div>}
          {loading && <div className="text-white">Loading videos...</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={cardsRef}>
            {!loading &&
              workoutVideos.map((video: any, index: number) => {
                const token = localStorage.getItem('token');
                const isLocked = video.forMembersOnly ? !isMember : !token;
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
                        <img
                          src={
                            video.thumbnailUrl
                              ? `${import.meta.env.VITE_API_URL}${video.thumbnailUrl}`
                              : ''
                          }
                          alt={video.title}
                          className={`object-cover w-full max-h-[270px] ${isLocked ? 'blur-[8px]' : ''}`}
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
                        <Badge className="ml-2" variant="default">
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
          {!isMember && (
            <div className="text-left">
              <Link to={'/plans'} className="hero-button px-[45px] uppercase">
                Check our Plans
              </Link>
            </div>
          )}
        </div>
      </section>
      <VideoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        videoId={activeVideo?._id || ''}
        title={activeVideo?.title || ''}
      />
      <Footer />
    </>
  );
};

export default WorkoutLibrary;