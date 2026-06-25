import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play, Search, X } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ALBUM_PHOTO_PATHS } from "@/lib/album-manifest";
import detailHeroBg from "@/assets/info-section.webp";

export const Route = createFileRoute("/album")({
  head: () => ({
    meta: [
      { title: "Album photo — Sommet de la Cybersécurité Madagascar 2026" },
      {
        name: "description",
        content:
          "Retrouvez les moments forts du Sommet de la Cybersécurité Madagascar 2026 en images : conférences, ateliers, CTF, networking.",
      },
      { property: "og:title", content: "Album photo — Édition 2026" },
      {
        property: "og:description",
        content: "Galerie photos officielle du Sommet de la Cybersécurité Madagascar 2026.",
      },
    ],
  }),
  component: AlbumPage,
});

type Photo = {
  url: string;
  file: string;
  caption: string;
  day: string;
  section: string;
};

type Section = { title: string; photos: Photo[] };
type Day = { title: string; sections: Section[] };

function formatDayTitle(title: string) {
  return title.replace(/^(Jour\s+\d+)\s+(.+)$/, "$1, $2");
}

function publicAlbumUrl(parts: string[]) {
  return encodeURI(`/album-webp/${parts.join("/")}`);
}

function buildAlbum(): Day[] {
  const byDay = new Map<string, Map<string, Photo[]>>();
  for (const path of ALBUM_PHOTO_PATHS) {
    const parts = path.split("/");
    if (parts.length < 3) continue;
    const [day, section, file] = parts;
    const num = file.match(/^(\d+)/)?.[1] ?? "";
    const photo: Photo = {
      url: publicAlbumUrl(parts),
      file,
      caption: `${section.replace(/^\d+\s+/, "")} — #${num}`,
      day,
      section,
    };
    if (!byDay.has(day)) byDay.set(day, new Map());
    const sec = byDay.get(day)!;
    if (!sec.has(section)) sec.set(section, []);
    sec.get(section)!.push(photo);
  }

  const sortAlpha = (a: string, b: string) =>
    a.localeCompare(b, "fr", { numeric: true });

  return [...byDay.entries()].sort(([a], [b]) => sortAlpha(a, b)).map(([day, secMap]) => ({
    title: day,
    sections: [...secMap.entries()].sort(([a], [b]) => sortAlpha(a, b)).map(([section, photos]) => ({
      title: section,
      photos: photos.sort((a, b) => sortAlpha(a.file, b.file)),
    })),
  }));
}

function preloadUrl(url?: string) {
  if (!url) return;
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}

function AlbumPage() {
  const days = useMemo(buildAlbum, []);
  const allPhotos = useMemo(
    () => days.flatMap((d) => d.sections.flatMap((s) => s.photos)),
    [days],
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [autoplay, setAutoplay] = useState(true);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % allPhotos.length)),
    [allPhotos.length],
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + allPhotos.length) % allPhotos.length,
      ),
    [allPhotos.length],
  );

  // Preload neighbours around the active photo (±2)
  useEffect(() => {
    if (activeIndex === null) return;
    const offsets = [-2, -1, 1, 2];
    for (const o of offsets) {
      const idx = (activeIndex + o + allPhotos.length) % allPhotos.length;
      preloadUrl(allPhotos[idx]?.url);
    }
  }, [activeIndex, allPhotos]);

  // Lock body scroll while lightbox open
  useEffect(() => {
    if (activeIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-[#02082d] text-foreground">
      <SiteHeader />

      <main className="pt-16 md:pt-20">
        <section className="relative isolate overflow-hidden border-b border-iris-cyan/25 bg-[#03164a] text-white">
        <img
          src={detailHeroBg}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-35 mix-blend-screen"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-100"
          style={{
            background:
              "radial-gradient(circle at 88% 12%, rgba(214, 255, 87, 0.18), transparent 26%), radial-gradient(circle at 8% 82%, rgba(142, 60, 255, 0.22), transparent 30%), linear-gradient(180deg, rgba(3, 27, 89, 0.92) 0%, rgba(3, 20, 74, 0.94) 52%, rgba(2, 8, 45, 0.98) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
          <Link
            to="/"
            hash="informations"
            className="mb-6 inline-flex items-center gap-1 rounded-md border border-iris-cyan/25 bg-[#03164a]/85 px-3 py-2 text-sm font-semibold text-iris-lime shadow-[0_14px_35px_-28px_rgba(34,211,238,0.75)] transition-colors hover:bg-[#041a5d] hover:text-iris-cyan"
          >
            <ArrowLeft className="size-4" /> Retour aux informations
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex"
          >
            <Badge
              className="border-iris-cyan/35 bg-iris-cyan/10 text-iris-lime hover:bg-iris-cyan/15"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              Édition 2026
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-5 text-3xl uppercase leading-tight text-iris bg-iris animate-iris md:text-5xl"
            style={{ fontFamily: "var(--font-turret)", letterSpacing: "0.02em" }}
          >
            Album photo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-4 max-w-2xl text-base text-white/82 md:text-lg"
          >
            Revivez en images les deux journées du Sommet de la Cybersécurité Madagascar :
            cérémonies, conférences plénières, ateliers, CTF & Hackathon, networking et
            espace exposition.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            {days.map((day, index) => (
              <Button
                key={day.title}
                asChild
                size="lg"
                className={
                  index === 0
                    ? "bg-iris-lime text-primary-deep shadow-[0_14px_35px_-22px_rgba(214,255,87,0.85)] hover:bg-iris-lime/90"
                    : "border-iris-cyan/35 bg-transparent text-white hover:bg-iris-cyan/10 hover:text-iris-lime"
                }
                variant={index === 0 ? "default" : "outline"}
              >
                <a href={`#jour-${index + 1}`}>Jour {index + 1}</a>
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        {days.map((day, index) => (
          <DaySection
            key={day.title}
            index={index}
            day={day}
            onOpen={(p) => setActiveIndex(allPhotos.indexOf(p))}
          />
        ))}
      </div>
      </main>

      <SiteFooter />

      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            photo={allPhotos[activeIndex]}
            index={activeIndex}
            total={allPhotos.length}
            autoplay={autoplay}
            onToggleAutoplay={() => setAutoplay((a) => !a)}
            onClose={close}
            onNext={next}
            onPrev={prev}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DaySection({
  day,
  index,
  onOpen,
}: {
  day: Day;
  index: number;
  onOpen: (p: Photo) => void;
}) {
  const [openItem, setOpenItem] = useState<string>(day.sections[0]?.title ?? "");

  return (
    <section
      id={`jour-${index + 1}`}
      className="mb-16 scroll-mt-24 last:mb-0 md:scroll-mt-28"
    >
      <header className="mb-6 flex flex-col gap-2 border-b border-white/10 pb-3 text-white sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">{formatDayTitle(day.title)}</h2>
        <span className="text-sm text-muted-foreground">
          {day.sections.reduce((n, s) => n + s.photos.length, 0)} photos
        </span>
      </header>

      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className="space-y-0"
      >
        {day.sections.map((sec, i) => (
          <AccordionItem
            key={sec.title}
            value={sec.title}
            className={
              "border-0 " +
              (i < day.sections.length - 1
                ? "border-b border-white/10 "
                : "")
            }
          >
            <AccordionTrigger className="py-5 text-left hover:no-underline">
              <div className="flex flex-1 items-center justify-between gap-4 pr-3">
                <h3 className="text-base font-semibold text-white/90 md:text-xl">
                  {sec.title.replace(/^\d+\s+/, "")}
                </h3>
                <span className="text-xs text-muted-foreground md:text-sm">
                  {sec.photos.length} photos
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-8">
              <Grid photos={sec.photos} onOpen={onOpen} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Grid({
  photos,
  onOpen,
}: {
  photos: Photo[];
  onOpen: (p: Photo) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {photos.map((p) => (
        <button
          key={p.url}
          type="button"
          onClick={() => onOpen(p)}
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/15 bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris-lime"
          aria-label={`Agrandir : ${p.caption}`}
        >
          <img
            src={p.url}
            alt={p.caption}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-contain p-1 transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex w-full items-center justify-between gap-2 p-3 text-white">
              <span className="line-clamp-2 text-xs font-medium">{p.caption}</span>
              <Search className="size-4 shrink-0" aria-hidden />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function Lightbox({
  photo,
  index,
  total,
  autoplay,
  onToggleAutoplay,
  onClose,
  onNext,
  onPrev,
}: {
  photo: Photo;
  index: number;
  total: number;
  autoplay: boolean;
  onToggleAutoplay: () => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Keyboard: Esc / arrows / space + focus trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === " ") {
        e.preventDefault();
        onToggleAutoplay();
      } else if (e.key === "Tab") {
        const root = containerRef.current;
        if (!root) return;
        const focusable = root.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev, onToggleAutoplay]);

  // Initial focus
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(onNext, 3500);
    return () => clearTimeout(t);
  }, [autoplay, onNext, index]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse photo"
      onClick={onClose}
    >
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between gap-2 p-3 text-white md:p-5">
        <span className="text-xs opacity-80 md:text-sm">
          {index + 1} / {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAutoplay();
            }}
            aria-label={autoplay ? "Pause défilement" : "Reprendre défilement"}
            className="rounded-full bg-white/10 p-2 hover:bg-white/20"
          >
            {autoplay ? <Pause className="size-5" /> : <Play className="size-5" />}
          </button>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Fermer"
            className="rounded-full bg-white/10 p-2 hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Photo précédente"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:left-6 md:p-3"
      >
        <ChevronLeft className="size-6" />
      </button>

      <AnimatePresence mode="wait">
        <motion.figure
          key={photo.url}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-4 flex max-h-[88vh] max-w-[92vw] flex-col items-center md:mx-12"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={photo.url}
            alt={photo.caption}
            className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          <figcaption className="mt-3 max-w-2xl text-center text-sm text-white/85">
            <span className="block font-medium">{photo.section.replace(/^\d+\s+/, "")}</span>
            <span className="block text-xs text-white/60">{formatDayTitle(photo.day)}</span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Photo suivante"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:right-6 md:p-3"
      >
        <ChevronRight className="size-6" />
      </button>
    </motion.div>
  );
}
