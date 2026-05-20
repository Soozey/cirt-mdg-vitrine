import './App.css'

const essentialInfo = [
  '2 jours',
  '5 axes thématiques',
  'Experts nationaux et internationaux',
  'Cyberdrill National',
  'CTF étudiant',
  'Espace exposition',
]

const themes = [
  'Axe juridique',
  'Axe opérationnel / SOC',
  'Axe technique',
  'Sensibilisation & formation',
  'Coopération internationale',
]

function BrandMark({ large = false }: { large?: boolean }) {
  return (
    <div className={large ? 'brand-mark brand-mark-large' : 'brand-mark'} aria-label="CIRT MDG">
      <span className="brand-symbol" aria-hidden="true">
        C
      </span>
      <span>
        <strong>CIRT MDG</strong>
        <small>Cyber Incident Response Team</small>
      </span>
    </div>
  )
}

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand-link" href="#accueil" aria-label="Accueil CIRT MDG">
          <BrandMark />
        </a>
        <nav className="site-nav" aria-label="Navigation principale">
          <a href="#accueil">Accueil</a>
          <a href="#projet">Projet</a>
          <a href="#informations">Informations</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="accueil">
          <div className="hero-content">
            <BrandMark large />
            <p className="eyebrow">CIRT MDG</p>
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
                Programme à venir
              </a>
            </div>
          </div>
          <div className="hero-panel" aria-label="Informations evenement">
            <span className="panel-label">Événement institutionnel</span>
            <strong>23–24 Mai 2026</strong>
            <p>
              <span>Novotel Convention & Spa</span>
              <span>Antananarivo</span>
            </p>
          </div>
        </section>

        <section className="section" id="projet">
          <div className="section-heading">
            <p className="eyebrow">Projet</p>
            <h2>Presentation courte</h2>
          </div>
          <p className="intro-text">
            Le Sommet de la Cybersécurité Madagascar — 1ère édition 2026 est un événement dédié à la
            confiance numérique, à la sensibilisation cyber et au renforcement de la résilience numérique à
            Madagascar.
          </p>
        </section>

        <section className="section muted-section" id="informations">
          <div className="section-heading">
            <p className="eyebrow">Informations</p>
            <h2>Informations essentielles</h2>
          </div>
          <div className="info-grid">
            {essentialInfo.map((item) => (
              <article className="info-card" key={item} id={item === '5 axes thématiques' ? 'programme' : undefined}>
                <span aria-hidden="true"></span>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Axes</p>
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
            <p className="eyebrow">Contact</p>
            <h2>Demandes d'information</h2>
            <p>
              Pour toute demande d’information, de partenariat ou de sponsoring, veuillez contacter l’équipe
              d'organisation.
            </p>
          </div>
          <div className="contact-actions" id="sponsor">
            <button className="button button-primary" type="button" disabled>
              Contact à venir
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <strong>CIRT MDG</strong>
        <span>Sommet de la Cybersécurité Madagascar 2026</span>
        <span>Site vitrine en cours de préparation</span>
      </footer>
    </div>
  )
}

export default App
