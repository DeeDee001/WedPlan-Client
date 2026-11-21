import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedServices } from '@/components/home/FeaturedServices';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <FeaturedServices />
      <CategoryShowcase />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}
