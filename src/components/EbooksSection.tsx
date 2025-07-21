import { Button } from '@/components/ui/button';
import download from '@/assets/icons/download.png';
import ebookCover1 from '@/assets/ebooks/ebook-1.png';
import ebookCover2 from '@/assets/ebooks/ebook-2.png';
import ebookCover3 from '@/assets/ebooks/ebook-1.png';
import ebookCover4 from '@/assets/ebooks/ebook-1.png';
import { motion } from 'framer-motion';

const ebooks = [
  {
    id: 1,
    title: "Coaching E-Book 1",
    price: "€50.00",
    isForAll: true,
    cover: ebookCover1,
  },
  {
    id: 2,
    title: "Coaching E-Book 2",
    price: "€70.00",
    isForAll: false,
    cover: ebookCover2,
  },
  {
    id: 3,
    title: "Coaching E-Book 3",
    price: "€70.00",
    isForAll: false,
    cover: ebookCover3,
  },
  {
    id: 4,
    title: "Coaching E-Book 4",
    price: "€70.00",
    isForAll: false,
    cover: ebookCover4,
  }
];

// Animation variants
const sectionFade = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }
};

const cardFlip = {
  hidden: { opacity: 0, rotateY: 80, scale: 0.9 },
  visible: { opacity: 1, rotateY: 0, scale: 1, transition: { duration: 0.85, ease: [0.43, 0.13, 0.23, 0.96] } }
};

export default function EbooksSection() {
  return (
    <section className="py-[60px] mt-[60px] min-h-screen">
      <motion.div
        className="mx-auto px-[45px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFade}
      >
        {/* Header */}
        <div className="text-center mb-[56px]">
          <h2 className="section-heading">
            Our Coaching <span className="text-primary">E-BOOKS</span>
          </h2>
          <p className="text-white text-[14px] font-light max-w-[750px] mx-auto leading-[24px] px-4">
            Explore our curated collection of fitness eBooks designed to support your health and training goals. Enjoy
            exclusive free content for subscribed clients and access premium eBooks.
          </p>
        </div>

        {/* Books Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] mb-[20px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.13 }}
        >
          {ebooks.map((ebook, i) => (
            <motion.div
              key={ebook.id}
              className="flex flex-col items-start"
              variants={cardFlip}
              whileHover={{ scale: 1.04, rotateY: 2 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              {/* Book Cover Card */}
              <div className="bg-[#2E2E2E] w-full flex flex-col items-center justify-center px-[60px] py-[25px] overflow-hidden shadow-md shadow-black/10">
                <img
                  src={ebook.isForAll ? ebook.cover : ebookCover2}
                  alt={ebook.title}
                  className="w-[180px] h-[240px] object-contain"
                  style={{ aspectRatio: '3/4' }}
                />
              </div>
              {/* Info Row: badge, title, download, price */}
              <div className="flex items-center justify-between gap-2 w-full mt-5">
                <span className={`text-[14px] font-semibold tracking-[1px] ${ebook.isForAll ? 'text-[#ED232A]' : 'text-[#ED232A]'}`} style={{ minWidth: "fit-content" }}>
                  {ebook.isForAll ? 'FOR ALL' : 'FOR MEMBERS ONLY'}
                </span>
                <img
                  src={download}
                  alt="Download"
                  className="w-6 h-6 mx-2"
                />
              </div>
              <div className="flex items-center justify-between gap-2 w-full mt-5">
                <span className="flex-1 text-white text-[20px] font-normal">{ebook.title}</span>
                <span className="text-white text-[16px] font-normal">{ebook.price}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Read More Button */}
        <div className="text-center mt-[55px]">
          <Button className="hero-button">
            READ MORE
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
