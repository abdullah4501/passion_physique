import { Button } from '@/components/ui/button';
import DownloadIcon from '@/assets/icons/download.png';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const cardFlip = {
  hidden: { opacity: 0, rotateY: 80, scale: 0.9 },
  visible: { opacity: 1, rotateY: 0, scale: 1 }
};

export default function EbooksSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-100px" });
  const controls = useAnimation();
  const navigate = useNavigate();

  // State
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [downloading, setDownloading] = useState('');

  // Auth
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Fetch first 4 ebooks
  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/ebooks?limit=4`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
      .then(res => res.json())
      .then(data => {
        setEbooks((data.ebooks || []).slice(0, 4)); // fallback if no ?limit param
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // Member status
  useEffect(() => {
    if (!isLoggedIn) {
      setIsMember(false);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/members/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setIsMember(!!data.isMember))
      .catch(() => setIsMember(false));
  }, [isLoggedIn, token]);

  // Purchases
  useEffect(() => {
    if (!isLoggedIn) {
      setPurchases([]);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/purchases/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPurchases(data.purchases || []))
      .catch(() => setPurchases([]));
  }, [isLoggedIn, token]);

  // Purchased ebook IDs (use itemId)
  const purchasedEbookIds = new Set(
    purchases.filter(p => p.itemType === 'ebook' && p.itemId).map(p => p.itemId)
  );

  // Anim
  useEffect(() => {
    if (inView) controls.start("visible");
    else controls.start("hidden");
  }, [inView, controls]);

  // Download handler
  const handleDownload = async (ebook) => {
    setDownloading(ebook._id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ebooks/${ebook._id}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${ebook.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        alert(data.error || "Download failed.");
      }
    } catch (err) {
      alert("Download failed.");
    }
    setDownloading('');
  };

  // Action (download or go to checkout)
  const handleAction = (ebook) => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=/e-books`);
      return;
    }
    if (ebook.forMembersOnly && !isMember) {
      alert("This ebook is for members only. Become a member to access.");
      return;
    }
    if (purchasedEbookIds.has(ebook._id)) {
      handleDownload(ebook);
      return;
    }
    // Not purchased, go to checkout
    if (ebook.price > 0 && !ebook.isFree) {
      navigate(`/coaching-ebooks/payment/${ebook._id}`);
    } else {
      window.open(`${import.meta.env.VITE_API_URL}${ebook.ebookUrl}?t=${Date.now()}`, "_blank");
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      className="py-[60px] mt-[60px]"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <div className="mx-auto md:px-[45px] px-[15px]">
        {/* Header */}
        <div className="text-center mb-[56px]">
          <h2 className="section-heading">
            Our Coaching <span className="text-primary">E-BOOKS</span>
          </h2>
          <p className="text-white text-[14px] font-light max-w-[750px] mx-auto leading-[24px] md:px-4 px-0">
            Explore our curated collection of fitness eBooks designed to support your health and training goals. Enjoy
            exclusive free content for subscribed clients and access premium eBooks.
          </p>
        </div>
        {/* Books Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] mb-[20px]"
          variants={{
            visible: { transition: { staggerChildren: 0.13 } },
          }}
          initial={false}
          animate={controls}
        >
          {loading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-[#2E2E2E] h-[320px] w-full rounded shadow animate-pulse" />
              ))
            : ebooks.map((ebook, i) => {
                const shouldBlur = !isLoggedIn || (ebook.forMembersOnly && !isMember);
                const isPurchased = purchasedEbookIds.has(ebook._id);
                return (
                  <motion.div
                    key={ebook._id}
                    className="flex flex-col items-start"
                    variants={cardFlip}
                    whileHover={{ scale: 1.04, rotateY: 2 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  >
                    {/* Book Cover */}
                    <div className="bg-[#2E2E2E] w-full flex flex-col items-center justify-center px-[60px] py-[25px] overflow-hidden shadow-md shadow-black/10">
                      <img
                        src={ebook.coverUrl ? `${import.meta.env.VITE_API_URL}${ebook.coverUrl}` : ''}
                        alt={ebook.title}
                        className={
                          "w-[180px] h-[240px] object-contain transition-all duration-200" +
                          (shouldBlur ? " blur-[3px] brightness-90 grayscale" : "")
                        }
                        style={{ aspectRatio: '3/4' }}
                        draggable={false}
                      />
                    </div>
                    {/* Info Row */}
                    <div className="flex items-center justify-between gap-2 w-full mt-5">
                      <span className={`text-[14px] font-semibold tracking-[1px] ${ebook.forMembersOnly ? 'text-[#ED232A]' : 'text-[#ED232A]'}`} style={{ minWidth: "fit-content" }}>
                        {ebook.forMembersOnly ? 'FOR MEMBERS ONLY' : 'FOR ALL'}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full hover:bg-primary transition-all duration-150 p-2"
                        onClick={() => handleAction(ebook)}
                        disabled={shouldBlur || downloading === ebook._id}
                      >
                        <img src={DownloadIcon} alt="Download" className="object-contain" draggable={false} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-2 w-full mt-5">
                      <span className="flex-1 text-white text-[20px] font-normal">{ebook.title}</span>
                      {isPurchased ? (
                        <span className="text-green-400 text-[15px] font-semibold ml-2">Purchased</span>
                      ) : (ebook.price > 0 && !ebook.isFree && (
                        <span className="text-white text-[16px] font-normal">€{ebook.price}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
        </motion.div>
        {/* Read More Button */}
        <div className="text-center mt-[55px]">
          <Link to={'/e-books'} className="hero-button px-[45px]">
            READ MORE
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
