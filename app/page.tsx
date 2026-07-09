import FAQSection from "@/components/FAQSection";
import { ProductDemo } from "@/components/marketing/ProductDemo";
import Content from "@/components/Content";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero/>
      <Content/>
      <section id="product_demo" className="mb-10">
        <div className="relative">
          <ProductDemo
            className="dark:hidden block"
            animations="from-center"
            videoSrc="https://www.youtube.com/embed/WsvjIrHmDrw?si=qaZw0XEH-DyKoa2T"
            thumbnailSrc="./Scribe_thumbnail.png"
            thumbnailAlt="Product Demo"
          />
          <ProductDemo
            className="hidden dark:block"
            animations="from-center"
            videoSrc="https://www.youtube.com/embed/WsvjIrHmDrw?si=qaZw0XEH-DyKoa2T"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Product Demo"
          />
        </div>
      </section>
      <section id="faq">
        <FAQSection/>
      </section>
      <section id="footer">
        <Footer/>
      </section>
    </main>
  )
}