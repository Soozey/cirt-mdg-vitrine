import { useEffect, useMemo, useState } from 'react'
import './App.css'

const cirtWebsite = 'https://cirt.gov.mg/'
const eventDate = new Date('2026-05-23T00:00:00+03:00')

const infoPages = [
  {
    slug: '2-jours',
    title: '2 jours',
    summary: 'Deux journées consacrées à la cybersécurité, à la confiance numérique et aux échanges professionnels.',
  },
  {
    slug: '5-axes-thematiques',
    title: '5 axes thématiques',
    summary: 'Les axes structurent les interventions autour des enjeux juridiques, opérationnels, techniques, pédagogiques et internationaux.',
  },
  {
    slug: 'experts',
    title: 'Experts nationaux et internationaux',
    summary: 'Un cadre prévu pour réunir des expertises locales et internationales autour de la résilience numérique.',
  },
  {
    slug: 'cyberdrill-national',
    title: 'Cyberdrill National',
    summary: 'Un espace dédié à l’exercice opérationnel et à la préparation des acteurs face aux incidents cyber.',
  },
  {
    slug: 'ctf-etudiant',
    title: 'CTF étudiant',
    summary: 'Le CTF étudiant sera relié à un site dédié dès que le lien officiel sera disponible.',
    externalPending: true,
  },
  {
    slug: 'espace-exposition',
    title: 'Espace exposition',
    summary: 'Un espace prévu pour les échanges, la visibilité institutionnelle et les rencontres avec les partenaires.',
  },
]

const themes = [
  'Axe juridique',
  'Axe opérationnel / SOC',
  'Axe technique',
  'Sensibilisation & formation',
  'Coopération internationale',
]

function useHashPage() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return hash
}

function useCountdown() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000)
    return () => window.clearInterval(timer)
  }, [])

  return useMemo(() => {
    const diff = Math.max(eventDate.getTime() - now.getTime(), 0)
    const days = Math.floor(diff / 86_400_000)
    const hours = Math.floor((diff % 86_400_000) / 3_600_000)
    const minutes = Math.floor((diff % 3_600_000) / 60_000)
    const seconds = Math.floor((diff % 60_000) / 1_000)
    return { days, hours, minutes, seconds }
  }, [now])
}

function BrandMark() {
  return (
    <div className="brand-mark">
      <img src="/cirt-mdg-logo.svg" alt="Logo CIRT MDG" />
    </div>
  )
}

function InfoDetailPage({ slug }: { slug: string }) {
  const page = infoPages.find((item) => item.slug === slug)

  if (!page) {
    return (
      <main className="detail-page">
        <a className="back-link" href="#informations">
          Retour aux informations essentielles
        </a>
        <h1>Information introuvable</h1>
      </main>
    )
  }

  return (
    <main className="detail-page">
      <a className="back-link" href="#informations">
        Retour aux informations essentielles
      </a>
      <div className="detail-card">
        <BrandMark />
        <h1>{page.title}</h1>
        <p>{page.summary}</p>
        {page.externalPending ? (
          <a className="button button-secondary" href="#contact">
            Lien CTF à confirmer
          </a>
        ) : (
          <a className="button button-primary" href="#contact">
            Demander des informations
          </a>
        )}
      </div>
    </main>
  )
}

function App() {
  const hash = useHashPage()
  const countdown = useCountdown()
  const detailMatch = hash.match(/^#\/informations\/(.+)$/)

  if (detailMatch) {
    return (
      <div className="site-shell">
        <InfoDetailPage slug={detailMatch[1]} />
      </div>
    )
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-main">
          <a className="brand-link" href="#accueil" aria-label="Accueil CIRT MDG">
            <BrandMark />
          </a>
          <nav className="site-nav" aria-label="Navigation principale">
            <a href="#accueil">Accueil</a>
            <a href="#projet">Projet</a>
            <a href="#informations">Informations</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section" id="accueil">
          <div className="hero-content">
            <h1>
              <span>Sommet de la</span>
              <span>Cybersécurité</span>
              <span>Madagascar</span>
              <span>— 1ère édition 2026</span>
            </h1>
            <p className="positioning">Bâtir la confiance numérique pour un Madagascar cyber-résilient</p>
            <p className="event-meta">
              <span>23–24 Mai 2026</span>
              <span>Novotel Convention & Spa</span>
              <span>Antananarivo</span>
            </p>
            <div className="hero-actions" aria-label="Actions principales">
              <a className="button button-primary" href="#contact">
                S’inscrire
              </a>
              <a className="button button-secondary" href="#sponsor">
                Devenir sponsor
              </a>
              <a className="button button-ghost" href="#programme">
                Télécharger le programme
              </a>
            </div>
          </div>
          <aside className="countdown-panel" aria-label="Avant l’événement">
            <span className="panel-label">Avant l’événement</span>
            <div className="countdown-grid">
              <span className="countdown-card">
                <strong>{countdown.days}</strong>
                <small>Jours</small>
              </span>
              <span className="countdown-card">
                <strong>{countdown.hours}</strong>
                <small>Heures</small>
              </span>
              <span className="countdown-card">
                <strong>{countdown.minutes}</strong>
                <small>Minutes</small>
              </span>
              <span className="countdown-card">
                <strong>{countdown.seconds}</strong>
                <small>Secondes</small>
              </span>
            </div>
          </aside>
        </section>

        <section className="section" id="projet">
          <div className="section-heading">
            <h2>Présentation courte</h2>
          </div>
          <p className="intro-text">
            Le Sommet de la Cybersécurité Madagascar — 1ère édition 2026 est un événement dédié à la
            confiance numérique, à la sensibilisation cyber et au renforcement de la résilience numérique à
            Madagascar.
          </p>
          <a className="text-link" href={cirtWebsite} target="_blank" rel="noopener noreferrer">
            Site officiel du CIRT MDG
          </a>
        </section>

        <section className="section muted-section" id="informations">
          <div className="section-heading">
            <h2>Informations essentielles</h2>
          </div>
          <div className="info-grid">
            {infoPages.map((item) => (
              <a
                className="info-card"
                href={`#/informations/${item.slug}`}
                key={item.slug}
                id={item.slug === '5-axes-thematiques' ? 'programme' : undefined}
              >
                <span aria-hidden="true"></span>
                <h3>{item.title}</h3>
                <p>{item.externalPending ? 'Lien externe à venir' : 'Voir la page'}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <h2>Axes thématiques</h2>
          </div>
          <div className="theme-list">
            {themes.map((theme) => (
              <div className="theme-item" key={theme}>
                {theme}
              </div>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div>
            <h2>Contact</h2>
            <p>
              Pour toute demande d’information, de partenariat ou de sponsoring, veuillez contacter l’équipe
              d’organisation.
            </p>
          </div>
          <div className="contact-grid">
            <article className="contact-card" id="contact-inscription">
              <h3>Inscription</h3>
              <p>Le parcours d’inscription sera publié dès validation.</p>
              <a className="button button-primary" href={cirtWebsite} target="_blank" rel="noopener noreferrer">
                Consulter le CIRT
              </a>
            </article>
            <article className="contact-card" id="sponsor">
              <h3>Sponsoring</h3>
              <p>Les demandes de partenariat peuvent être orientées vers l’équipe d’organisation.</p>
              <a className="button button-secondary" href={cirtWebsite} target="_blank" rel="noopener noreferrer">
                Contacter via le site officiel
              </a>
            </article>
            <article className="contact-card">
              <h3>Programme</h3>
              <p>Le programme détaillé sera ajouté uniquement lorsqu’un fichier officiel sera disponible.</p>
              <a className="button button-ghost" href="#programme">
                Suivre le programme
              </a>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <strong>CIRT MDG</strong>
        <a href={cirtWebsite} target="_blank" rel="noopener noreferrer">
          cirt.gov.mg
        </a>
        <span>Sommet de la Cybersécurité Madagascar 2026</span>
        <span>Site vitrine en cours de préparation</span>
      </footer>
    </div>
  )
}

export default App
