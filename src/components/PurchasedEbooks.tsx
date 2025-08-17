import { Button } from '@/components/ui/button';
import DownloadIcon from '@/assets/icons/download.png';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cardFlip = {
  hidden: { opacity: 0, rotateY: 80, scale: 0.9 },
  visible: { opacity: 1, rotateY: 0, scale: 1 }
};

export default function PurchasedEbooks() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-100px" });
  const controls = useAnimation();
  const navigate = useNavigate();

  // State
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState('');

  // Auth
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Fetch only purchased ebooks for this user
  useEffect(() => {
    if (!isLoggedIn) {
      setEbooks([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/purchases/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(async data => {
        const ebookIds = (data.purchases || [])
          .filter(p => p.itemType === 'ebook' && p.itemId)
          .map(p => p.itemId);

        if (ebookIds.length === 0) {
          setEbooks([]);
          setLoading(false);
          return;
        }

        // Fetch each ebook by its ID
        const ebookDataArr = await Promise.all(
          ebookIds.map(id =>
            fetch(`${import.meta.env.VITE_API_URL}/api/ebooks/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(r => r.json())
              .then(d => d.ebook)
              .catch(() => null)
          )
        );
        setEbooks(ebookDataArr.filter(Boolean));
        setLoading(false);
      })
      .catch(() => {
        setEbooks([]);
        setLoading(false);
      });
  }, [isLoggedIn, token]);

  // Animation
  useEffect(() => {
    if (inView) controls.start("visible");
    else controls.start("hidden");
  }, [inView, controls]);

  // Download handler
  const handleDownload = async (ebook) => {
    setDownloading(ebook._id);
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/ebooks/${ebook._id}/download`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        const blob = await res.blob();
        const ext =
          ebook.mimeType === 'application/pdf' ? '.pdf'
            : ebook.mimeType === 'image/jpeg' ? '.jpg'
              : ebook.mimeType === 'image/png' ? '.png'
                : '';
        const fileName = `${ebook.title}${ext}`;
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        const data = await res.json();
        alert(data.error || "Download failed.");
      }
    } catch {
      alert("Download failed.");
    }
    setDownloading('');
  };

  if (!isLoggedIn) {
    navigate(`/login?redirect=/purchased-ebooks`);
    return null;
  }

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <div className="mx-auto">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] mb-[20px]"
          variants={{
            visible: { transition: { staggerChildren: 0.13 } },
          }}
          initial={false}
          animate={controls}
        >
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-[#2E2E2E] h-[320px] w-full rounded shadow animate-pulse" />
            ))
          ) : ebooks.length === 0 ? (
            <div className="col-span-4 text-center text-gray-400 text-lg my-16">
              You have no Purchased Ebooks.
            </div>
          ) : (
            ebooks.map((ebook) => (
              <motion.div
                key={ebook._id}
                className="flex flex-col items-start"
                variants={cardFlip}
                whileHover={{ scale: 1.04, rotateY: 2 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                <div className="bg-[#2E2E2E] w-full flex flex-col items-center justify-center px-[20px] py-[25px] overflow-hidden shadow-md shadow-black/10">
                  <img
                    src={ebook.coverUrl ? `${import.meta.env.VITE_API_URL}${ebook.coverUrl}` : ''}
                    alt={ebook.title}
                    className="w-[180px] h-[240px] object-contain transition-all duration-200"
                    style={{ aspectRatio: '3/4' }}
                    draggable={false}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 w-full mt-5">
                  <span className="text-[14px] font-semibold tracking-[1px] text-green-400" style={{ minWidth: "fit-content" }}>
                    PURCHASED
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full hover:bg-primary transition-all duration-150 p-2"
                    onClick={() => handleDownload(ebook)}
                    disabled={downloading === ebook._id}
                  >
                    <img src={DownloadIcon} alt="Download" className="object-contain" draggable={false} />
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-2 w-full mt-5">
                  <span className="flex-1 text-white text-[20px] font-normal">{ebook.title}</span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
