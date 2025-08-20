import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/workoutBg.png';
import playicon from '@/assets/workout/play-circle.png';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';

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
      .catch(() => {
        setError('Failed to load video. Please try again.');
      });
  }, [open, videoId]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const handleError = (e: Event) => {
      setError('Failed to play video. Please try again.');
    };

    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('error', handleError);
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
        {error && <div className="text-red-500 mb-3">{error}</div>}
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

  const [workoutVideos, setWorkoutVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
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
      .catch(() => {
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
        setWorkoutVideos(data.videos || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Group videos by category name (useMemo for performance)
  const groupedByCategory = useMemo(() => {
    const map: Record<string, any[]> = {};
    if (!workoutVideos || workoutVideos.length === 0) return map;

    workoutVideos.forEach((v) => {
      const catName = v.category && v.category.name ? v.category.name : 'Uncategorized';
      if (!map[catName]) map[catName] = [];
      map[catName].push(v);
    });

    // Optional: sort categories alphabetically
    // const ordered: Record<string, any[]> = {};
    // Object.keys(map).sort().forEach(k => (ordered[k] = map[k]));
    // return ordered;

    return map;
  }, [workoutVideos]);

  const handlePlay = (video: any) => {
    setActiveVideo(video);
    setModalOpen(true);

    // Save video to user's library when they try to watch
    const token = localStorage.getItem('token');
    if (token && video._id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/library/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoId: video._id }),
      }).catch(() => {
        /* fire-and-forget: ignore errors for now */
      });
    }
  };

  const handleView = (video) => {
    // 1. Open the video player/modal/stream in a new tab/window
    window.open(`${import.meta.env.VITE_API_URL.replace('/api', '')}${video.videoUrl}`, '_blank');

    // 2. Save video to user's library (fire and forget)
    const token = localStorage.getItem('token');
    if (token && video._id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/library/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoId: video._id }),
      }).catch(() => {
        /* ignore errors */
      });
    }
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

          {/* grouped categories */}
          <div className="space-y-12" ref={cardsRef}>
            {!loading &&
              Object.entries(groupedByCategory).map(([categoryName, videosInCategory]) => {
                if (!videosInCategory || videosInCategory.length === 0) return null;

                // Render one category section
                // We'll use a global counter for animation delays so delay grows across categories
                let globalIndex = 0; // NOTE: we'll reassign below using closure; we'll actually compute a starting offset outside

                return (
                  <section key={categoryName}>
                    <h2 className="text-white text-2xl font-semibold mb-6">{categoryName}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {videosInCategory.map((video: any, idx: number) => {
                        // Calculate a continuous index by summing previous categories lengths.
                        // Because we cannot access previous map state here, compute a deterministic global index:
                        // Build a flat index by using the index in videosInCategory plus a computed offset derived from
                        // the positions of this category in Object.keys(groupedByCategory).
                        return (
                          <CategoryVideoCard
                            key={video._id}
                            video={video}
                            idx={idx}
                            categoryName={categoryName}
                            groupedByCategory={groupedByCategory}
                            cardsInView={cardsInView}
                            indexForDelay={computeGlobalIndex(groupedByCategory, categoryName, idx)}
                            isMember={isMember}
                            handlePlay={handlePlay}
                          />
                        );
                      })}
                    </div>
                  </section>
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

/**
 * Helper component for rendering a single video card.
 * Keeps markup clean and re-usable.
 */
const CategoryVideoCard = ({
  video,
  idx,
  groupedByCategory,
  categoryName,
  cardsInView,
  indexForDelay,
  isMember,
  handlePlay,
}: any) => {
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
        delay: indexForDelay * 0.13,
      }}
      whileHover={
        !isLocked ? { scale: 1.04, boxShadow: '0 8px 38px 0 rgba(237,35,42,0.13)' } : {}
      }
      onClick={() => !isLocked && handlePlay(video)}
      style={{ pointerEvents: isLocked ? 'none' : 'auto' }}
    >
      <div className="relative mb-6">
        <div className="relative group">
          <img
            src={video.thumbnailUrl ? `${import.meta.env.VITE_API_URL}${video.thumbnailUrl}` : ''}
            alt={video.title}
            className={`object-cover w-full max-h-[270px] ${isLocked ? 'blur-[8px]' : ''}`}
            style={{ pointerEvents: 'none' }}
          />
          {isLocked ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <img src={playicon} className="w-[60px] h-[60px] opacity-60 mb-3" />
            </div>
          ) : (
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

      <p className="text-white text-[15px] leading-[25px] font-normal">{video.description}</p>
    </motion.div>
  );
};

/**
 * Compute a deterministic global index for animation delay.
 * It sums the lengths of all categories that come before the current category in Object.keys order.
 */
function computeGlobalIndex(groupedByCategory: Record<string, any[]>, categoryName: string, idxInCategory: number) {
  const keys = Object.keys(groupedByCategory);
  let offset = 0;
  for (const k of keys) {
    if (k === categoryName) break;
    offset += groupedByCategory[k]?.length || 0;
  }
  return offset + idxInCategory;
}

export default WorkoutLibrary;
