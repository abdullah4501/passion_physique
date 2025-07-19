import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const WorkoutLibrarySection = () => {
  const workoutVideos = [
    {
      id: 1,
      title: "Coaching Video 1",
      description: "A balanced workout targeting all major muscle groups to build strength, endurance, and improve overall fitness."
    },
    {
      id: 2, 
      title: "Coaching Video 2",
      description: "Activate and strengthen your glutes and core with focused exercises designed for stability and shape."
    },
    {
      id: 3,
      title: "Coaching Video 3", 
      description: "Tone and define your chest, back, shoulders, and arms with this effective upper body training session."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Coaching
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
            WORKOUT LIBRARY
          </h3>
          <p className="text-white/80 text-lg max-w-4xl mx-auto leading-relaxed">
            Access our Coaching Workout Library for a wide range of expert-designed training programs. From 
            beginner to advanced, each workout is tailored to support your goals with structured, effective routines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {workoutVideos.map((video, index) => (
            <div key={video.id} className="group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative mb-6">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 left-4">
                  <span className="bg-primary px-3 py-1 text-xs font-semibold text-white rounded">
                    LEVEL 1
                  </span>
                </div>
              </div>
              
              <div className="mb-2">
                <span className="text-primary text-sm font-semibold">FOR MEMBERS ONLY</span>
              </div>
              
              <h3 className="text-white text-xl font-bold mb-3">{video.title}</h3>
              
              <p className="text-white/80 text-sm leading-relaxed">
                {video.description}
              </p>
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

export default WorkoutLibrarySection;