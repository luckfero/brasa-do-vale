type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: "meat" | "buffet" | "events" | "rodizio" | "history" | "contact";
  action?: { href: string; label: string };
};

export default function PageHero({ eyebrow, title, description, image = "meat", action }: PageHeroProps) {
  return (
    <section className={`page-hero page-hero-${image}`} aria-labelledby="page-title">
      <div className="page-hero-overlay" />
      <div className="container page-hero-content">
        <p className="eyebrow hero-eyebrow">{eyebrow}</p>
        <h1 id="page-title">{title}</h1>
        <p>{description}</p>
        {action ? <a className="button button-gold" href={action.href}>{action.label}</a> : null}
      </div>
    </section>
  );
}
