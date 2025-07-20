import gallery1 from '@/assets/gallery/IMG_1156.jpg';
import gallery2 from '@/assets/gallery/image2.png';
import gallery3 from '@/assets/gallery/IMG_1157.jpg';
import gallery4 from '@/assets/gallery/IMG_8128.jpg';
import gallery5 from '@/assets/gallery/IMG_0093.jpg';
import gallery6 from '@/assets/gallery/IMG_1155.jpg';
import instaIcon from '@/assets/gallery/instaIcon.png';

const images = [
  gallery1, gallery2, gallery3, gallery4, gallery5, gallery6
];

export default function GallerySection() {
  // This maps grid placement to match your original layout
  const gridClasses = [
    "row-span-2 col-span-2",  // gallery1 (big left)
    "col-span-1 row-span-1",  // gallery2 (top mid)
    "col-span-1 row-span-1",  // gallery3 (top right)
    "col-span-1 row-span-1",  // gallery4 (top far right)
    "col-span-1 row-span-1",  // gallery5 (bottom mid)
    "col-span-2 row-span-1",  // gallery6 (bottom wide)
  ];

  return (
    <section className="w-full bg-black px-0 py-0 mt-[120px]">
      <div className="mx-auto overflow-hidden">
        <div
          className="
            grid
            grid-cols-5
            grid-rows-2
            gap-2
            w-full
            aspect-[1440/573]
            min-h-[573px]
          "
        >
          {images.map((img, idx) => (
            <div className={`relative group cursor-pointer ${gridClasses[idx]}`} key={idx}>
              <img
                src={img}
                alt=""
                className="object-cover w-full h-full"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 z-10 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <img
                  src={instaIcon}
                  alt="Instagram"
                  className="w-[80px] h-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
