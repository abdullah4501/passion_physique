import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/bg/workoutBg.png';
import DownloadIcon from '@/assets/icons/download.png';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const API = (import.meta as any).env?.VITE_API_URL?.replace(/\/+$/, '') || '';
const apiUrl = (p?: string) => (p && p.startsWith('http') ? p : `${API}${p || ''}`);

type CertificateItem = {
  _id: string;
  name: string;
  description: string;
  pdfUrl: string | null;   // null for non-members/guests
  thumbUrl?: string;       // e.g. /uploads/certificates/PN1.png
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
  canDownload?: boolean;
};

const cardVariants = {
  hidden: { opacity: 0, rotateY: 55, scale: 0.92 },
  visible: (i: number) => ({ opacity: 1, rotateY: 0, scale: 1 }),
};

const titleVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const Certificate = () => {
  const [certs, setCerts] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/api/certificates`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: 'include',
        });
        if (!res.ok) {
          console.error('Certificates fetch failed:', res.status, await res.text());
          setCerts([]);
          return;
        }
        const data = await res.json();
        setCerts(data?.certificates ?? []);
      } catch (e) {
        console.error('Failed to fetch certificates:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });

  async function handleDownload(cert: CertificateItem) {
    if (!cert.pdfUrl) return; // not allowed
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in as a member to download.');
        return;
      }
      const res = await fetch(apiUrl(cert.pdfUrl), {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(`Download failed (${res.status}) ${msg}`);
      }
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${cert.name.replace(/[^a-z0-9_\-]+/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    } catch (err) {
      console.error(err);
      alert('Could not download this file. If you are a member, please re-login and try again.');
    }
  }

  return (
    <>
      <Header />

      <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
        <img
          src={bannerImg}
          alt="Coaching E-Books"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
        <div className="absolute inset-0 " />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <motion.h1
            ref={titleRef}
            className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
            variants={titleVariants}
            transition={{ duration: 0.8, ease: [0.42, 0, 0.2, 1] }}
            initial="hidden"
            animate={titleInView ? 'visible' : 'hidden'}
          >
            <span className="text-primary">Our</span>{' '}
            <span className="text-white">CERTIFICATE</span>
          </motion.h1>
          <motion.div
            variants={titleVariants}
            initial="hidden"
            animate={titleInView ? 'visible' : 'hidden'}
            transition={{ duration: 1, delay: 0.15, ease: [0.42, 0, 0.2, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
              Home / Certificate
            </span>
          </motion.div>
        </div>
      </section>

      <section className="bg-primary py-5">
        <div className="mx-auto">
          <p className="uppercase text-white text-center font-[16px] font-bold">
            If you are a member of The Passion Physique, please log in to access all books
          </p>
        </div>
      </section>

      <section className="py-[120px] ">
        <div className="container px-4">
          {loading ? (
            <p className="text-center text-white/70">Loading certificates…</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {certs.map((cert, idx) => {
                const canDownload = !!cert.pdfUrl;
                const imgSrc = cert.thumbUrl ? apiUrl(cert.thumbUrl) : '/favicon.ico';

                return (
                  <motion.div
                    key={cert._id}
                    variants={cardVariants}
                    className="bg-[#2E2E2E] md:px-[45px] px-[15px] py-[40px] flex md:flex-row flex-col items-center rounded-none shadow-none p-6 relative min-h-[180px] gap-4"
                    style={{ minHeight: 180 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.42, 0, 0.2, 1],
                      delay: idx * 0.13,
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    custom={idx}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: '0 8px 38px 0 rgba(237,35,42,0.13)',
                      rotateY: 3,
                    }}
                  >
                    {/* Thumbnail with optional blur/veil when not downloadable */}
                    <div className="relative overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={cert.name}
                        className={`h-[180px] object-contain transition ${
                          canDownload ? '' : 'blur-[2px] scale-[1.02] opacity-80'
                        }`}
                        draggable={false}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/favicon.ico';
                        }}
                      />
                      {!canDownload && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center ">
                          
                        </div>
                      )}
                    </div>

                    {/* Info Side */}
                    <div className="flex-1 flex flex-col justify-center h-full relative">
                      <div className="flex flex-row items-start justify-between">
                        <div>
                          <span className="block text-white text-[20px] font-normal mb-1">
                            {cert.name}
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          {canDownload ? (
                            <button
                              onClick={() => handleDownload(cert)}
                              title="Download"
                              className="p-0 bg-transparent border-0"
                            >
                              <img
                                src={DownloadIcon}
                                alt="Download"
                                className="object-contain"
                                draggable={false}
                              />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="opacity-50 cursor-not-allowed"
                              title="Login as member to download"
                              aria-disabled="true"
                            >
                              <img
                                src={DownloadIcon}
                                alt="Download (members only)"
                                className="object-contain"
                                draggable={false}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-white text-[14px] font-normal mt-2 mb-0 leading-[24px] md:pr-[25px] pr-0">
                        {cert.description || '—'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Certificate;
