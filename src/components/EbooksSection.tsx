import { Button } from '@/components/ui/button';
import download from '@/assets/icons/download.png'; // Download icon as image
import ebookCover1 from '@/assets/ebooks/ebook-1.png';
import ebookCover2 from '@/assets/ebooks/ebook-2.png';
import ebookCover3 from '@/assets/ebooks/ebook-1.png';
import ebookCover4 from '@/assets/ebooks/ebook-1.png';

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

const EbooksSection = () => (
  <section className="py-20 min-h-screen">
    <div className="container mx-auto px-6 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-[56px]">
        <h2 className="text-[40px] font-medium text-white mb-[24px]">
          Our Coaching <span className="text-primary">E-BOOKS</span>
        </h2>
        <p className="text-white text-[14px] font-light max-w-[750px] mx-auto leading-[24px] px-4">
          Explore our curated collection of fitness eBooks designed to support your health and training goals. Enjoy 
          exclusive free content for subscribed clients and access premium eBooks.
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] mb-[20px]">
        {ebooks.map((ebook, i) => (
          <div key={ebook.id} className="flex flex-col items-start">
            {/* Book Cover Card */}
            <div className="bg-[#2E2E2E] w-full flex flex-col items-center justify-center px-[60px] py-[25px] overflow-hidden">
              <img
                src={ebook.isForAll ? ebook.cover : ebookCover2}
                alt={ebook.title}
                className="w-[180px] h-[240px] object-contain"
                style={{ aspectRatio: '3/4' }}
              />
            </div>
            {/* Info Row: badge, title, download, price */}
            <div className="flex items-center justify-between gap-2 w-full mt-5">
              {/* Badge */}
              <span className={`text-[14px] font-semibold  tracking-[1px] ${
                  ebook.isForAll ? 'text-[#ED232A]' : 'text-[#ED232A]'
                }`}
                style={{ minWidth: "fit-content" }}
              >
                {ebook.isForAll ? 'FOR ALL' : 'FOR MEMBERS ONLY'}
              </span>
              {/* Download icon */}
              <img
                src={download}
                alt="Download"
                className="w-6 h-6 mx-2"
              />
            </div>
            <div className="flex items-center justify-between gap-2 w-full mt-5">
              {/* Title */}
              <span className="flex-1 text-white text-[20px] font-normal">
                {ebook.title}
              </span>

              {/* Price */}
              <span className="text-white text-[16px] font-normal">
                {ebook.price}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Read More Button */}
      <div className="text-center mt-8">
            <Button className="bg-primary hover:bg-primary/90 text-white text-[12px] px-8 py-3 rounded font-semibold uppercase transition-all duration-300 rounded-none mt-10">
              Read More
            </Button>
      </div>
    </div>
  </section>
);

export default EbooksSection;
