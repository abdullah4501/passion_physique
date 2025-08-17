import { Badge } from '@/components/ui/badge';
import playicon from '@/assets/workout/play-circle.png';
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

// Video Modal
const VideoModal = ({ open, onClose, videoId, title }) => {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !videoId) {
      setVideoSrc('');
      setError('');
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
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setVideoSrc(data.signedUrl);
        setError('');
      })
      .catch(() => setError('Failed to load video. Please try again.'));
  }, [open, videoId]);

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
        {error && <div className="text-red-500 mb-3">{error}</div>}
        {videoSrc && (
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
        )}
      </div>
    </div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 38, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const SavedLibrarySection = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-100px' });

  // Fetch user's saved videos
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSavedVideos([]);
      setLoading(false);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/library/my-saved`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSavedVideos(data.savedVideos || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePlay = (video) => {
    setActiveVideo(video);
    setModalOpen(true);
  };

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={cardsRef}>
          {loading ? (
            <div className="text-white">Loading your saved videos...</div>
          ) : savedVideos.length === 0 ? (
            <div className="text-white col-span-full">You have no saved videos yet.</div>
          ) : (
            savedVideos.map((video, index) => (
              <motion.div
                key={video._id}
                className="group mb-10 cursor-pointer relative"
                variants={cardVariants}
                initial="hidden"
                animate={cardsInView ? 'visible' : 'hidden'}
                transition={{
                  duration: 0.65,
                  ease: [0.42, 0, 0.2, 1],
                  delay: index * 0.13,
                }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 8px 38px 0 rgba(237,35,42,0.13)'
                }}
                onClick={() => handlePlay(video)}
              >
                <div className="relative mb-6">
                  <div className="relative group">
                    <img
                      src={video.thumbnailUrl ? `${import.meta.env.VITE_API_URL}${video.thumbnailUrl}` : ''}
                      alt={video.title}
                      className="object-cover w-full max-h-[270px]"
                      style={{ pointerEvents: 'none' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-colors">
                      <img src={playicon} className="w-[60px] h-[60px]" />
                    </div>
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
            ))
          )}
        </div>
        <VideoModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          videoId={activeVideo?._id || ''}
          title={activeVideo?.title || ''}
        />
      </div>
    </section>
  );
};

export default SavedLibrarySection;
