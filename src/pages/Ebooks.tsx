import Header from '@/components/Header';
import Footer from '@/components/Footer';
import bannerImg from '@/assets/ebooks/bg.png';
import DownloadIcon from '@/assets/icons/download.png';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberRequiredModal from '@/components/MemberRequiredModal';

const cardVariants = {
    hidden: { opacity: 0, y: 42, scale: 0.97 },
    visible: (idx) => ({
        opacity: 1,
        y: 0,
        scale: 1,
    })
};
const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

const Ebooks = () => {
    const navigate = useNavigate();
    const cardsRef = useRef(null);
    const cardsInView = useInView(cardsRef, { once: false, margin: "-100px" });
    const titleRef = useRef(null);
    const titleInView = useInView(titleRef, { once: true, margin: "-100px" });

    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);

    // 👇 ADDED: Track user purchases
    const [purchases, setPurchases] = useState([]);
    const [downloading, setDownloading] = useState('');

    // Token = user logged in
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    // Fetch all ebooks (public endpoint or protected, doesn't matter here)
    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/api/ebooks`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
        })
            .then(res => res.json())
            .then(data => {
                setEbooks(data.ebooks || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
        // eslint-disable-next-line
    }, []);

    // Fetch member status if logged in
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

    // 👇 ADDED: Fetch purchases for current user
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

    // 👇 ADDED: Helper to check if ebook is purchased (by ebookId)
    const purchasedEbookIds = new Set(
        purchases
            .filter((p) => p.itemType === "ebook" && p.itemId) // Make sure your backend is saving ebookId in purchases!
            .map((p) => p.itemId)            
        );

    // Handle download/purchase/checkout
    const handleAction = (ebook) => {
        if (!isLoggedIn) {
            navigate(`/login?redirect=/e-books`);
            return;
        }
        if (ebook.forMembersOnly && !isMember) {
            setShowMemberModal(true);
            return;
        }

        // 👇 If purchased, trigger download
        if (purchasedEbookIds.has(ebook._id)) {
            handleDownload(ebook);
            return;
        }

        // Not purchased, open checkout
        if (ebook.price > 0 && !ebook.isFree) {
            navigate(`/coaching-ebooks/payment/${ebook._id}`);
        } else {
            // Free e-book
            window.open(`${import.meta.env.VITE_API_URL}${ebook.ebookUrl}?t=${Date.now()}`, "_blank");
        }
    };

    // 👇 ADDED: Download logic for purchased ebook
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

    return (
        <>
            <Header />
            <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
                <img src={bannerImg} alt="Coaching E-Books"
                    className="absolute inset-0 w-full h-full object-cover object-center" draggable={false} />
                <div className="absolute inset-0 " />
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <motion.h1
                        ref={titleRef}
                        className="text-[66px] font-bold uppercase leading-[80px] mb-4 select-none page-title"
                        variants={titleVariants}
                        transition={{ duration: 0.85, ease: [0.42, 0, 0.2, 1] }}
                        initial="hidden"
                        animate={titleInView ? "visible" : "hidden"}
                    >
                        <span className="text-primary">Coaching</span>{" "}
                        <span className="text-white">E-Books</span>
                    </motion.h1>
                    <motion.div
                        className="flex flex-col items-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-80px" }}
                        variants={titleVariants}
                        transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
                    >
                        <span className="text-white font-bold text-[26px] leading-[26px] breadcrumbs">
                            Home / Coaching E-Books
                        </span>
                    </motion.div>
                </div>
            </section>
            <section className="bg-primary py-5">
                <div className="mx-auto ">
                    <p className='uppercase text-white text-center text-[16px] font-bold'>If you are a member of The Passion Physique, please log in to access all books </p>
                </div>
            </section>
            {/* Books Section */}
            <section className="py-[120px] ">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7" ref={cardsRef}>
                        {loading
                            ? <div className="text-white text-lg text-center py-8">Loading ebooks...</div>
                            : ebooks.map((ebook, idx) => {
                                // Cover blur logic
                                const shouldBlur = !isLoggedIn || (ebook.forMembersOnly && !isMember);
                                const isPurchased = purchasedEbookIds.has(ebook._id);
                                return (
                                    <motion.div
                                        key={ebook._id}
                                        className="bg-[#2E2E2E] md:px-[45px] px-[15px] py-[40px] flex md:flex-row flex-col items-center rounded-none shadow-none p-6 relative min-h-[180px] gap-4"
                                        style={{ minHeight: 180 }}
                                        variants={cardVariants}
                                        transition={{
                                            duration: 0.65,
                                            ease: [0.42, 0, 0.2, 1],
                                            delay: idx * 0.13,
                                        }}
                                        initial="hidden"
                                        animate={cardsInView ? "visible" : "hidden"}
                                        custom={idx}
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: "0 6px 32px 0 rgba(237,35,42,0.16)"
                                        }}
                                    >
                                        {/* Book Cover (blurred if not logged in or not member for members-only book) */}
                                        <div className="overflow-hidden relative">
                                            <img
                                                src={ebook.coverUrl ? `${import.meta.env.VITE_API_URL}${ebook.coverUrl}` : ''}
                                                alt={ebook.title}
                                                className={
                                                    "h-[180px] object-contain transition-all duration-200" +
                                                    (shouldBlur ? " blur-[3px] brightness-90 grayscale" : "")
                                                }
                                                draggable={false}
                                            />
                                        </div>
                                        {/* Info Side */}
                                        <div className="flex-1 flex flex-col justify-center h-full relative">
                                            <div className="flex flex-row items-start justify-between">
                                                <div>
                                                    <span className={`block text-[14px] font-semibold mb-1 uppercase tracking-wide text-primary`}>
                                                        {ebook.forMembersOnly ? "FOR MEMBERS ONLY" : "FOR ALL"}
                                                    </span>
                                                    <span className="block text-white text-[20px] font-normal mb-1">{ebook.title}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-3">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="rounded-full hover:bg-primary transition-all duration-150 p-2"
                                                        onClick={() => handleAction(ebook)}
                                                        disabled={shouldBlur || downloading === ebook._id}
                                                    >
                                                        <img
                                                            src={DownloadIcon}
                                                            alt="Download"
                                                            className="object-contain"
                                                            draggable={false}
                                                        />
                                                    </Button>
                                                    {/* Show green Purchased badge OR price */}
                                                    {isPurchased ? (
                                                        <span className="text-green-400 text-[15px] font-semibold ml-2">Purchased</span>
                                                    ) : (ebook.price > 0 && !ebook.isFree && (
                                                        <span className="text-white text-[17px] font-normal ml-2">
                                                            €{ebook.price}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-white text-[14px] font-normal mt-2 mb-0 leading-[24px] pr-0 md:pr-[25px]">
                                                {ebook.description}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                    </div>
                </div>
            </section>
            <MemberRequiredModal open={showMemberModal} onClose={() => setShowMemberModal(false)} />
            <Footer />
        </>
    );
}

export default Ebooks;
