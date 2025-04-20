

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="flex items-center justify-center py-20 bg-primary/5">
        <h1 className="text-4xl md:text-6xl font-great-vibes text-primary">About Us</h1>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-playfair mb-6 text-center">Our Story</h2>
          <div className="max-w-3xl mx-auto text-muted-foreground leading-relaxed space-y-4">
            <p>
              Welcome to Elegant Moments, where we transform wedding dreams into unforgettable realities. 
              Founded with a passion for creating extraordinary celebrations, we&apos;ve dedicated ourselves to 
              connecting couples with the most stunning wedding venues across Algeria.
            </p>
            <p>
              Our journey began with a simple belief: every love story deserves a perfect setting. 
              We understand that choosing the right venue is one of the most important decisions 
              in wedding planning, and we&apos;re here to make that choice easier and more inspiring.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <h2 className="text-3xl font-playfair mb-6 text-center">Our Mission</h2>
          <div className="max-w-3xl mx-auto text-muted-foreground leading-relaxed space-y-4">
            <p>
              At Elegant Moments, our mission is to simplify the venue selection process while 
              ensuring each couple finds a space that perfectly reflects their unique style and vision. 
              We carefully curate our collection of venues, partnering with locations that meet our 
              high standards for quality, service, and beauty.
            </p>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg border bg-card">
            <h3 className="text-xl font-playfair mb-4">Curated Selection</h3>
            <p className="text-muted-foreground">
              We handpick each venue, ensuring only the finest locations make it to our platform.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <h3 className="text-xl font-playfair mb-4">Local Expertise</h3>
            <p className="text-muted-foreground">
              Deep knowledge of Algerian wedding traditions and contemporary trends.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <h3 className="text-xl font-playfair mb-4">Personal Touch</h3>
            <p className="text-muted-foreground">
              We treat each couple&apos;s search with the care and attention it deserves.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
} 