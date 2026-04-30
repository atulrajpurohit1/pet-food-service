import HeroSection from './sections/HeroSection';
import ImageTextSection from './sections/ImageTextSection';
import CardsGridSection from './sections/CardsGridSection';
import CategoriesGridSection from './sections/CategoriesGridSection';
import TeamSection from './sections/TeamSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactInfoSection from './sections/ContactInfoSection';
import TextBlockSection from './sections/TextBlockSection';
import BannerSection from './sections/BannerSection';

const SECTION_MAP = {
  hero: HeroSection,
  image_text: ImageTextSection,
  cards_grid: CardsGridSection,
  categories_grid: CategoriesGridSection,
  team: TeamSection,
  testimonials: TestimonialsSection,
  contact_info: ContactInfoSection,
  text_block: TextBlockSection,
  banner: BannerSection,
};

export default function SectionRenderer({ sections, settings }) {
  if (!sections || !Array.isArray(sections) || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => {
        const Component = SECTION_MAP[section.type];
        if (!Component) return null;
        return <Component key={index} data={section.data} settings={settings} />;
      })}
    </>
  );
}
