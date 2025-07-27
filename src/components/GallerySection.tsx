import gallery1 from '@/assets/gallery/IMG_1156.jpg';
import gallery2 from '@/assets/gallery/image2.png';
import gallery3 from '@/assets/gallery/IMG_1157.jpg';
import gallery4 from '@/assets/gallery/IMG_8128.jpg';
import gallery5 from '@/assets/gallery/IMG_0093.jpg';
import gallery6 from '@/assets/gallery/IMG_1155.jpg';
import instaIcon from '@/assets/gallery/instaicon.png';
import { motion } from 'framer-motion';

// Animation for each gallery image (zoom-in, fade-up)
const imageVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export default function GallerySection() {
  return (
    <section className="w-full bg-black px-0 py-0 mt-[60px]">
      <div className="mx-auto overflow-hidden">
        <motion.div
          className="
            grid
            md:grid-cols-5
            grid-cols-4
            grid-rows-2
            gap-2
            w-full
            md:aspect-[1440/573]
            aspect-0
          "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.12 }}
        >
          {/* 1. Big left image */}
          <motion.div
            className="relative group cursor-pointer md:row-span-2 row-span-1 col-span-2"
            variants={imageVariants}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src={gallery1} alt="" className="object-cover w-full h-full" draggable={false} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 z-10 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <img
                src={instaIcon}
                alt="Instagram"
                className="w-[80px] h-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                draggable={false}
              />
            </div>
          </motion.div>
          {/* 2. Top middle */}
          <motion.div
            className="relative group cursor-pointer md:col-span-1 col-span-2 row-span-1"
            variants={imageVariants}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src={gallery2} alt="" className="object-cover w-full h-full" draggable={false} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 z-10 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <img
                src={instaIcon}
                alt="Instagram"
                className="w-[80px] h-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                draggable={false}
              />
            </div>
          </motion.div>
          {/* 3. Top right */}
          <motion.div
            className="relative group cursor-pointer md:col-span-1 col-span-2 row-span-1"
            variants={imageVariants}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src={gallery3} alt="" className="object-cover w-full h-full" draggable={false} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 z-10 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <img
                src={instaIcon}
                alt="Instagram"
                className="w-[80px] h-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                draggable={false}
              />
            </div>
          </motion.div>
          {/* 4. Top far right */}
          <motion.div
            className="relative group cursor-pointer md:col-span-1 col-span-2 row-span-1"
            variants={imageVariants}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src={gallery4} alt="" className="object-cover w-full h-full" draggable={false} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 z-10 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <img
                src={instaIcon}
                alt="Instagram"
                className="w-[80px] h-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                draggable={false}
              />
            </div>
          </motion.div>
          {/* 5. Bottom mid */}
          <motion.div
            className="relative group cursor-pointer md:col-span-1 col-span-2 row-span-1"
            variants={imageVariants}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src={gallery5} alt="" className="object-cover w-full h-full" draggable={false} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 z-10 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <img
                src={instaIcon}
                alt="Instagram"
                className="w-[80px] h-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                draggable={false}
              />
            </div>
          </motion.div>
          {/* 6. Bottom wide */}
          <motion.div
            className="relative group cursor-pointer col-span-2 row-span-1"
            variants={imageVariants}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src={gallery6} alt="" className="object-cover w-full h-full" draggable={false} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 z-10 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <img
                src={instaIcon}
                alt="Instagram"
                className="w-[80px] h-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                draggable={false}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
