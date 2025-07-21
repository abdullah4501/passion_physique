import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureBar from '@/components/FeatureBar';
import AboutSection from '@/components/AboutSection';
import PricingSection from '@/components/PricingSection';
import EbooksSection from '@/components/EbooksSection';
import SessionSection from '@/components/SessionSection';
import WorkoutLibrarySection from '@/components/WorkoutLibrarySection';
import Footer from '@/components/Footer';
import GallerySection from '@/components/GallerySection';
import SectionWrapper from '@/components/SectionWrapper';

import {
  fadeUp,
  hardBounceIn,
  slideSkew,
  flipIn
} from '@/components/sectionAnimations';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HeroSection />
      <FeatureBar />
      <AboutSection />
      <PricingSection />
      <EbooksSection />
      <SessionSection />
      <SectionWrapper variants={slideSkew}><WorkoutLibrarySection /></SectionWrapper>
      <GallerySection />
    </main>
    <Footer />
  </div>
);

export default Index;
