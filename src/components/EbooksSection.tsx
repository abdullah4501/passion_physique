import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const EbooksSection = () => {
  const ebooks = [
    {
      id: 1,
      title: "Coaching E-Book 1",
      price: "€50.00",
      isForAll: true,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Coaching E-Book 2", 
      price: "€70.00",
      isForAll: false,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Coaching E-Book 3",
      price: "€70.00", 
      isForAll: false,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Coaching E-Book 4",
      price: "€70.00",
      isForAll: false,
      image: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Coaching <span className="text-primary">E-BOOKS</span>
          </h2>
          <p className="text-white/80 text-lg max-w-4xl mx-auto leading-relaxed">
            Explore our curated collection of fitness eBooks designed to support your health and training goals. Enjoy 
            exclusive free content for subscribed clients and access premium eBooks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {ebooks.map((ebook, index) => (
            <div key={ebook.id} className="relative group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-card-bg rounded-lg overflow-hidden">
                <div className="aspect-[3/4] bg-gray-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {index === 0 ? (
                      <div className="text-center p-8">
                        <div className="text-white text-2xl font-bold mb-4">THE</div>
                        <div className="text-white text-3xl font-bold mb-4">TRAINING</div>
                        <div className="text-white text-3xl font-bold mb-8">BLUEPRINT</div>
                        <div className="text-white text-sm">THE PASSION PHYSIQUE</div>
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <div className="text-white text-2xl font-bold mb-4">THE</div>
                        <div className="text-white text-3xl font-bold mb-4">TRAINING</div>
                        <div className="text-white text-3xl font-bold mb-8">BLUEPRINT</div>
                        <div className="text-white text-sm">THE PASSION PHYSIQUE</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded ${
                    ebook.isForAll ? 'bg-primary text-white' : 'bg-primary text-white'
                  }`}>
                    {ebook.isForAll ? 'FOR ALL' : 'FOR MEMBERS ONLY'}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <h3 className="text-white font-medium">{ebook.title}</h3>
                <span className="text-white font-bold">{ebook.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="hero-button">
            READ MORE
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EbooksSection;