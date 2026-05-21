import type { Question, Domain } from "./types";

export const QUESTIONS: Question[] = [
  // Réseaux
  { id: "NET-BEG-001", domain: "Réseaux", level: "Débutant", text: "Expliquez la différence entre TCP et UDP et donnez un cas d'usage typique pour chacun.", keywords: ["tcp", "udp", "transport", "fiabilité", "connexion"] },
  { id: "NET-BEG-002", domain: "Réseaux", level: "Débutant", text: "Décrivez le fonctionnement complet d'une résolution DNS, depuis la requête utilisateur jusqu'à la réponse.", keywords: ["dns", "résolution", "récursif", "autoritaire", "cache"] },
  { id: "NET-INT-001", domain: "Réseaux", level: "Intermédiaire", text: "Qu'est-ce qu'une attaque ARP spoofing ? Comment la détecter et s'en protéger ?", keywords: ["arp", "spoofing", "mitm", "détection", "statique"] },
  { id: "NET-INT-002", domain: "Réseaux", level: "Intermédiaire", text: "Comparez les rôles d'un IDS et d'un IPS dans une architecture défensive.", keywords: ["ids", "ips", "détection", "prévention", "inline"] },
  { id: "NET-ADV-001", domain: "Réseaux", level: "Avancé", text: "Expliquez le concept de BGP Hijacking et les contre-mesures (RPKI, ROA).", keywords: ["bgp", "hijacking", "rpki", "roa", "routing"] },

  // Web
  { id: "WEB-BEG-001", domain: "Web", level: "Débutant", text: "Quelle est la différence entre une XSS reflected et une XSS stored ? Donnez un exemple.", keywords: ["xss", "reflected", "stored", "injection", "javascript"] },
  { id: "WEB-BEG-002", domain: "Web", level: "Débutant", text: "Expliquez le principe d'une injection SQL et comment l'éviter en pratique.", keywords: ["sql", "injection", "prepared", "paramétré", "orm"] },
  { id: "WEB-INT-001", domain: "Web", level: "Intermédiaire", text: "Qu'est-ce qu'une attaque SSRF ? Quels sont ses impacts dans un environnement cloud ?", keywords: ["ssrf", "metadata", "cloud", "imds", "interne"] },
  { id: "WEB-INT-002", domain: "Web", level: "Intermédiaire", text: "Expliquez le fonctionnement d'une attaque CSRF et les défenses modernes.", keywords: ["csrf", "token", "samesite", "cookie", "synchronizer"] },
  { id: "WEB-ADV-001", domain: "Web", level: "Avancé", text: "Présentez plusieurs techniques de contournement (bypass) d'une Content Security Policy.", keywords: ["csp", "bypass", "nonce", "jsonp", "dangling"] },

  // Cryptographie
  { id: "CRY-BEG-001", domain: "Cryptographie", level: "Débutant", text: "Expliquez le fonctionnement de RSA et le rôle des clés publique et privée.", keywords: ["rsa", "asymétrique", "clé", "publique", "modulo"] },
  { id: "CRY-BEG-002", domain: "Cryptographie", level: "Débutant", text: "Décrivez l'échange de clés Diffie-Hellman et ce qu'il garantit.", keywords: ["diffie", "hellman", "échange", "secret", "discret"] },
  { id: "CRY-INT-001", domain: "Cryptographie", level: "Intermédiaire", text: "Qu'est-ce qu'une attaque par Padding Oracle ? Donnez un cas concret (ex: CBC).", keywords: ["padding", "oracle", "cbc", "déchiffrement", "vaudenay"] },
  { id: "CRY-INT-002", domain: "Cryptographie", level: "Intermédiaire", text: "Pourquoi le mode ECB d'AES est-il considéré comme dangereux par rapport au CBC ?", keywords: ["aes", "ecb", "cbc", "pattern", "iv"] },
  { id: "CRY-ADV-001", domain: "Cryptographie", level: "Avancé", text: "Expliquez l'attaque de Bleichenbacher contre RSA PKCS#1 v1.5.", keywords: ["bleichenbacher", "rsa", "pkcs", "oracle", "padding"] },

  // Forensics
  { id: "FOR-BEG-001", domain: "Forensics", level: "Débutant", text: "Qu'est-ce que la chain of custody ? Pourquoi est-elle critique en investigation numérique ?", keywords: ["chain", "custody", "preuve", "intégrité", "traçabilité"] },
  { id: "FOR-BEG-002", domain: "Forensics", level: "Débutant", text: "À quoi sert Volatility ? Donnez deux plugins utiles pour l'analyse mémoire.", keywords: ["volatility", "mémoire", "pslist", "netscan", "dump"] },
  { id: "FOR-INT-001", domain: "Forensics", level: "Intermédiaire", text: "Que peut-on déduire des fichiers Prefetch de Windows lors d'une investigation ?", keywords: ["prefetch", "windows", "exécution", "timestamp", ".pf"] },
  { id: "FOR-INT-002", domain: "Forensics", level: "Intermédiaire", text: "Qu'est-ce qu'un malware fileless ? Comment l'investiguer ?", keywords: ["fileless", "mémoire", "powershell", "wmi", "lolbins"] },
  { id: "FOR-ADV-001", domain: "Forensics", level: "Avancé", text: "Quelles sont les particularités de la forensique sur un environnement Docker en production ?", keywords: ["docker", "container", "volume", "overlay", "runtime"] },

  // Reverse
  { id: "REV-BEG-001", domain: "Reverse", level: "Débutant", text: "Quelle est la différence entre un désassembleur et un décompilateur ?", keywords: ["désassembleur", "décompilateur", "ida", "ghidra", "assembly"] },
  { id: "REV-BEG-002", domain: "Reverse", level: "Débutant", text: "Expliquez comment unpacker un binaire packé avec UPX.", keywords: ["upx", "unpack", "packer", "oep", "section"] },
  { id: "REV-INT-001", domain: "Reverse", level: "Intermédiaire", text: "Qu'est-ce que la technique de process hollowing utilisée par certains malwares ?", keywords: ["process", "hollowing", "injection", "ntunmap", "suspended"] },
  { id: "REV-INT-002", domain: "Reverse", level: "Intermédiaire", text: "Comment VMProtect rend-il l'analyse statique d'un binaire plus difficile ?", keywords: ["vmprotect", "virtualisation", "obfuscation", "handler", "bytecode"] },
  { id: "REV-ADV-001", domain: "Reverse", level: "Avancé", text: "Expliquez le principe d'une attaque ROP (Return-Oriented Programming).", keywords: ["rop", "gadget", "stack", "ret", "dep"] },
];

export function pickQuestions(nq = 5): Question[] {
  const domains: Domain[] = ["Réseaux", "Web", "Cryptographie", "Forensics", "Reverse"];
  const byDomain = new Map<Domain, Question[]>();
  for (const d of domains) {
    byDomain.set(
      d,
      [...QUESTIONS.filter((q) => q.domain === d)].sort(() => Math.random() - 0.5),
    );
  }
  const picked: Question[] = [];
  const shuffledDomains = [...domains].sort(() => Math.random() - 0.5);
  for (let i = 0; i < nq; i++) {
    const d = shuffledDomains[i % shuffledDomains.length];
    const pool = byDomain.get(d)!;
    const q = pool.shift();
    if (q) picked.push(q);
  }
  return picked.sort(() => Math.random() - 0.5);
}