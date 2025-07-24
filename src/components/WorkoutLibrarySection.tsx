import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import thumbnail1 from '@/assets/workout/thumbnail1.png'
import thumbnail2 from '@/assets/workout/thumbnail2.png'
import thumbnail3 from '@/assets/workout/thumbnail3.png'
import playicon from '@/assets/workout/play-circle.png'

const WorkoutLibrarySection = () => {
  const workoutVideos = [
    {
      id: 1,
      title: "Coaching Video 1",
      description: "A balanced workout targeting all major muscle groups to build strength, endurance, and improve overall fitness.",
      thumbnail: thumbnail1
    },
    {
      id: 2, 
      title: "Coaching Video 2",
      description: "Activate and strengthen your glutes and core with focused exercises designed for stability and shape.",
      thumbnail: thumbnail2
    },
    {
      id: 3,
      title: "Coaching Video 3", 
      description: "Tone and define your chest, back, shoulders, and arms with this effective upper body training session.",
      thumbnail: thumbnail3
    }
  ];

  return (
    <section className="pt-[120px] pb-[120px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-heading">
            Our Coaching <br />
            <span className="text-primary">WORKOUT LIBRARY</span>
          </h2>
          <p className="text-white text-[14px] max-w-4xl mx-auto leading-[24px] font-normal">
            Access our Coaching Workout Library for a wide range of expert-designed training programs. From 
            beginner to advanced, each workout is tailored to support your goals with structured, effective routines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {workoutVideos.map((video, index) => (
            <div key={video.id} className="group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative mb-6">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="object-cover"
                  />
                  <div className="absolute inset-0  flex items-center justify-center">
                    <div className=" transition-colors">
                      <img src={playicon}  />
                    </div>
                  </div>
                  <div className="absolute bottom-[2px] left-0">
                    <span className="bg-primary px-[45px] py-1 text-[12px] tracking-[1.2px] font-medium text-white">
                      LEVEL 1
                    </span>
                  </div>
                </div>
                
              </div>
              
              <div className="mb-2">
                <span className="text-primary text-[14px] leading[23px] tracking[1px] font-semibold">FOR MEMBERS ONLY</span>
              </div>
              
              <h3 className="text-white text-[20px] font-normal leading-[30px] mb-3">{video.title}</h3>
              
              <p className="text-white text-[15px] leading-[25px] font-normal">
                {video.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="hero-button px-[45px]">
              READ MORE
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WorkoutLibrarySection;