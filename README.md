# TurboSito – Projekt‑Dossier

Dieses Repository enthält alle Assets für das „TurboSito“‑Angebot.  Es liefert drei Branchen‑Demos (Restaurant, Friseur/Barber, Ferienwohnung), eine Verkaufs‑Landingpage, rechtliche Seiten, Dankes‑/Abbruchseiten sowie eine vollständige Begleitdokumentation.  Die Seiten sind komplett statisch, verwenden Tailwind CSS via CDN und benötigen keine Build‑Tools.  Alle Seiten sind zweisprachig (Deutsch / Italienisch) und mobil‑optimiert.  Das Branding wurde konsolidiert: Orange `#F97316` wird als Akzentfarbe genutzt und der Dark‑Mode basiert auf `#111827`.

## Ordnerstruktur

```
├── assets/
│   └── img/                 # Platzhalterbilder für Helden‐Bilder und Galerien
├── demos/
│   ├── restaurant/          # One‑Pager für Gastronomie
│   │   └── index.html
│   ├── barber/              # One‑Pager für Friseur/Barber
│   │   └── index.html
│   └── apartment/           # One‑Pager für Ferienwohnung
│       └── index.html
├── landing/
│   └── index.html           # Verkaufs‑Landingpage für das Angebot
├── legal/
│   ├── impressum.html       # Platzhalter für Impressum/Note legali
│   └── privacy.html         # Platzhalter für Datenschutzerklärung/Informativa sulla privacy
├── thanks.html              # Erfolgs‑Seite nach Bezahlung (Stripe)
├── cancel.html              # Abbruch‑Seite für Payment
├── sitemap.xml              # XML‑Sitemap für Suchmaschinen
├── robots.txt               # robots.txt zum Verweis auf die Sitemap
└── README.md                # Dieses Dossier mit Erläuterungen und Checklisten
```

## Deployment (Netlify / GitHub Pages)

1. **Repository kopieren**: Forken oder herunterladen und in ein eigenes Git‑Repository einchecken.
2. **Assets anpassen**: Ersetze die Platzhalterbilder in `assets/img/` durch passende Fotos (Achtung: Dateinamen beibehalten oder in den HTML‑Dateien anpassen).  Aktualisiere außerdem die Platzhalterwerte (siehe Variablenliste).
3. **Form & Payment Links**: Ersetze die Platzhalter `INTAKE_FORM_URL` und `STRIPE_PAYMENT_LINK` im Landing‑Page‑HTML durch echte URLs aus deinem Formular‑ bzw. Stripe‑Setup.
4. **Netlify einrichten**:
   - Neues Projekt in [Netlify](https://www.netlify.com/) anlegen und dein Git‑Repository verbinden.
   - Build‑Command leer lassen (es ist ein reines HTML‑Projekt).  Als Publish‑Ordner den Root‑Ordner (`/`) wählen.
   - Nach dem Deploy kannst du eine eigene Domain verbinden und Redirects (z. B. von `/` nach `/landing/`) konfigurieren.
5. **GitHub Pages**: Alternativ kann das Projekt aus dem `main`‑Branch als GitHub Pages bereitgestellt werden.  Aktiviere dafür in den Repository‑Settings unter *Pages* den Branch `main` und wähle `/(root)` als Quelle.
6. **DNS & Domain**: Richte eine Domain bei deinem Registrar ein und verweise die DNS‑Einträge auf Netlify oder GitHub Pages.

## Variablenliste

Die HTML‑Dateien enthalten mehrere Platzhalter, die vor dem Launch ersetzt werden müssen.  Die nachstehende Tabelle fasst alle Variablen zusammen:

| Platzhalter             | Beschreibung |
|-------------------------|-------------|
| `PHONE`                 | Telefonnummer inkl. Ländervorwahl für WhatsApp‑Links (`wa.me/…`). |
| `ADDRESS`               | Straße und Hausnummer des Unternehmens. |
| `CITY` / `REGION` / `ZIP` | Ort, Region und Postleitzahl für Schema.org und Kontakt. |
| `SOCIAL_INSTAGRAM`      | Link zum Instagram‑Profil (oder andere soziale Kanäle). |
| `SOCIAL_FACEBOOK`       | Link zur Facebook‑Seite. |
| `LOGO_URL`              | Optionaler Pfad oder externe URL zum Firmenlogo. |
| `INTAKE_FORM_URL`       | URL zum eingebetteten Intake‑Formular (Tally/Typeform). |
| `STRIPE_PAYMENT_LINK`   | Stripe‑Payment‑Link für die Anzahlung (40 %). |

Bei Bedarf können weitere Farben angepasst werden, aber standardmäßig wird die Akzentfarbe Orange (`#F97316`) verwendet.  Der Dark‑Mode basiert auf der Farbe `#111827`.

## Intake‑Formular

Der Onboarding‑Prozess beginnt mit einem ausführlichen Formular.  Nachfolgend findest du ein Beispielschema sowie ein Einbettungs‑Snippet für Tally (alternativ Typeform):

```json
{
  "title": "Website in 48h – Intake",
  "fields": [
    {"type": "text", "name": "company", "label": "Firma/Name", "required": true},
    {"type": "select", "name": "industry", "label": "Branche", "options": ["Gastro", "Friseur", "Ferienwohnung", "Andere"], "required": true},
    {"type": "select", "name": "goal", "label": "Web‑Ziel", "options": ["Leads", "Reservierungen", "Information"], "required": true},
    {"type": "email", "name": "email", "label": "E‑Mail", "required": true},
    {"type": "tel", "name": "whatsapp", "label": "WhatsApp/Telefon", "required": true},
    {"type": "checkbox", "name": "languages", "label": "Sprache(n)", "options": ["DE", "IT", "EN"], "required": true},
    {"type": "file", "name": "logo", "label": "Logo", "maxFiles": 1},
    {"type": "text", "name": "primary_color", "label": "Primärfarbe (HEX)"},
    {"type": "text", "name": "secondary_color", "label": "Sekundärfarbe (HEX)"},
    {"type": "file", "name": "images", "label": "Bildpaket", "maxFiles": 10},
    {"type": "text", "name": "opening_hours", "label": "Öffnungszeiten"},
    {"type": "text", "name": "address", "label": "Adresse/Google‑Maps‑Link", "required": true},
    {"type": "text", "name": "phone", "label": "Telefonnummer", "required": true},
    {"type": "radio", "name": "cta", "label": "Haupt‑CTA", "options": ["WhatsApp", "E‑Mail", "Telefon"], "required": true},
    {"type": "text", "name": "socials", "label": "Socials (IG/FB/TA)"},
    {"type": "textarea", "name": "description", "label": "Kurzbeschreibung (max. 300 Zeichen)", "required": true},
    {"type": "textarea", "name": "services", "label": "Leistungen/Preise", "required": true},
    {"type": "checkbox", "name": "privacy", "label": "Datenschutzeinwilligung", "required": true},
    {"type": "checkbox", "name": "agb", "label": "AGB akzeptieren", "required": true}
  ]
}
```

### Einbettungssnippet (Tally)

Blende das Formular in deine Seite ein, indem du den folgenden Code verwendest (ersetze `FORM_ID` mit deiner Tally‑ID):

```html
<iframe data-tally-src="https://tally.so/r/FORM_ID?hideTitle=1&transparentBackground=1" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0" title="Website‑Intake"></iframe>
<script>function loadTally(){const d=document,s=d.createElement("script");s.src="https://tally.so/widgets/embed.js";s.onload=() => {Tally.loadEmbeds()};d.body.appendChild(s);}document.addEventListener("DOMContentLoaded", loadTally);</script>
```

### Automatisierung (Make/Zapier)

1. **Trigger**: Neues Formular‑Submit (Tally/Typeform Trigger).
2. **Formatter/Parser**: Felder normalisieren (z. B. Farben prüfen, Telefonnummer formatieren, Checkbox‑Arrays in Strings umwandeln).
3. **Datenspeicher**: Upsert in Notion‑Datenbank oder Google Sheet mit Spalten wie `company`, `industry`, `goal`, `email`, `whatsapp`, `languages`, `colors`, `images`, `opening_hours`, `address`, `phone`, `cta`, `socials`, `description`, `services`, `privacy`, `agb`, `timestamp`.
4. **Benachrichtigung**: Automatische E‑Mail an den Kunden (z. B. „Danke für deine Angaben, wir starten sofort mit dem Aufbau.“) und Slack/Teams‑Nachricht an das interne Team mit allen Details.
5. **Stripe**: Optional kann ein Schritt integriert werden, um automatisch den Anzahlung‑Link zu versenden, falls der Kunde noch nicht bezahlt hat.

## Stripe‑Setup (Testmodus)

1. **Produkt anlegen**: Erstelle in Stripe ein Produkt namens „Website in 48 h – Anzahlung 40 %“.
2. **Preis definieren**: Lege für jedes Paket (Basic €490, Standard €890, Premium €1.490) eine Preisvariante an und berechne 40 % des Gesamtpreises als Anzahlung (z. B. Basic = €196).  Aktiviere den Testmodus, um nicht mit echten Zahlungen zu arbeiten.
3. **Payment‑Link erzeugen**: Erstelle für jede Variante einen Payment‑Link.  Als Erfolgs‑URL wähle `/thanks.html`, als Abbruch‑URL `/cancel.html`.  Aktiviere die Option, nach Zahlung eine Bestätigungs‑E‑Mail zu senden.
4. **Link im Landing‑Page**: Ersetze im Landing‑Page‑HTML (`landing/index.html`) den Platzhalter `STRIPE_PAYMENT_LINK` durch den generierten Link.  Für kundenindividuelle Auswahl kann der Link auch erst nach dem Ausfüllen des Intake‑Formulars per E‑Mail versendet werden.
5. **Rechnung und Restbetrag**: Weise den Kunden darauf hin, dass der Restbetrag (60 %) nach Abnahme fällig ist und eine Rechnung separat versendet wird.

## Performance‑Optimierung & SEO

Die Seiten sind bewusst schlank aufgebaut.  Um die Core Web Vitals einzuhalten, sollten folgende Best‑Practices beachtet werden:

* **Largest Contentful Paint (LCP)**: Lade das größte Element (meist das Hero‑Bild) schnell.  Bilder werden daher als `<link rel="preload">` vorab geladen.  Laut Google gilt ein LCP unter 2,5 Sekunden als gut【857787954025474†L171-L176】.
* **Largest Contentful Paint (LCP)**: Lade das größte Element (meist das Hero‑Bild) schnell.  Alle Heldenbilder nutzen jetzt das `<picture>`‑Element mit WebP und JPEG sowie ein Preload mit `fetchpriority="high"`.  Laut Google gilt ein LCP unter 2,5 Sekunden als gut【857787954025474†L171-L176】.
* **Cumulative Layout Shift (CLS)**: Alle Bilder besitzen feste `width`/`height`‑Attribute, damit der Platz reserviert wird und es nicht zu Layout‑Verschiebungen kommt.  Ein CLS‑Wert unter 0,1 wird empfohlen【52268135763575†L139-L144】.
* **Lazy Loading**: Galerie‑Bilder nutzen das Attribut `loading="lazy"`, um erst beim Scrollen geladen zu werden.
* **Dark Mode & Theme**: Über eine kleine JavaScript‑Funktion wird das `class="dark"`‑Attribut am `<html>`‑Element gesetzt.  Der Nutzer kann den Modus per Button wechseln; die Wahl wird in `localStorage` gespeichert.
* **Branding & Farben**: Alle CTAs und Key‑Elemente nutzen die Markenfarbe Orange (`#F97316`), und der Dark‑Mode verwendet einen dunklen Basiston (`#111827`).
* **SEO & Schema.org**: Jede Demo enthält ein JSON‑LD‑Snippet (Restaurant, HairSalon oder LodgingBusiness) mit Name, Adresse, Öffnungszeiten und Social‑Links.  Dies verbessert das Local‑SEO‑Ranking.  Außerdem sind `meta description` und `og:title/description` gesetzt.
* **Sprachumschaltung**: Die Texte sind per `data-lang`‑Attribut hinterlegt.  Eine kleine Funktion setzt `data-language` im `<html>`‑Tag und blendet die passende Sprache ein.  Dadurch ist kein Reload nötig.
* **Dateigröße**: Da Tailwind per CDN eingebunden ist und keine Build‑Tools nötig sind, bleiben die Seiten schlank.  Die CSS‑Datei wird auf mobile Geräte zugeschnitten.  Zusätzlich sollten unnötige Klassen entfernt werden, falls eigenständige CSS‑Anpassungen vorgenommen werden.

## DSGVO‑Checkliste

* **Impressum & Datenschutz**: Fülle `legal/impressum.html` und `legal/privacy.html` mit deinen Unternehmensdaten.  Verlinke diese Seiten in allen Footern.
* **Cookie‑Banner**: Da die Seiten ohne Tracking‑Skripte auskommen, wird kein Cookie‑Banner benötigt.  Nur wenn externe Ressourcen (z. B. eingebettete Karten) Cookies setzen, muss ein Banner eingeblendet werden.
* **WhatsApp‑Hinweis**: Weist darauf hin, dass die Kontaktaufnahme via WhatsApp den Nutzungsbedingungen von WhatsApp unterliegt und eventuell Daten in Drittländer übertragen werden.
* **Vertragsverarbeitung**: Schließe mit Dienstleistern (Netlify, Stripe, Tally) Auftragsverarbeitungsverträge ab, falls personenbezogene Daten verarbeitet werden.

## Go‑Live‑Checkliste

1. **Domains & DNS**: Domain einrichten und DNS auf Netlify/GitHub Pages verweisen.
2. **Formular testen**: Teste das Intake‑Formular inkl. Automatisierung (Make/Zapier) und prüfe, ob Daten richtig im Notion/Sheet landen.
3. **Payment‑Link testen**: Im Testmodus den Stripe‑Link ausführen, die Erfolgs‑ und Abbruchseiten prüfen und E‑Mail‑Bestätigung kontrollieren.
4. **Responsives Design**: Mit verschiedenen Geräten (Mobil, Tablet, Desktop) testen.  Browser‑DevTools und Lighthouse helfen dabei.
5. **404/Sitemap/robots.txt**: Füge bei Bedarf eine 404‑Seite, eine Sitemap und eine robots.txt hinzu.  GitHub/Netlify generieren eine einfache 404 automatisch, wenn die Datei `404.html` vorhanden ist.
6. **Pagespeed testen**: Überprüfe die Seiten mit [PageSpeed Insights](https://pagespeed.web.dev/) und strebe einen Score ≥ 90 an.  Optimiere ggf. Bilder und CSS weiter.
7. **Zugänglichkeit**: Stelle sicher, dass Buttons Labels haben (`aria‑label`), Kontraste ausreichend sind und Formularfelder beschriftet sind.

## Loom‑Skript (60 Sekunden)

**Hook (5–7 s)**

> „Ich baue Websites in 48 Stunden – ohne Telefonate. Schau dir diese Live‑Demos an!“  
> *(IT: „Realizzo siti in 48 ore – senza telefonate. Guarda queste demo!“)*

**Body (40–45 s)**

1. **Feature 1 – WhatsApp‑CTA**: Zeige die Demo‑Seite (z. B. Restaurant) und demonstriere den WhatsApp‑Button.  Erläutere, dass Kunden direkt mit einem Klick reservieren oder anfragen können.  On‑Screen‑Text: „Direkter Kontakt per WhatsApp“ / „Contatto diretto via WhatsApp“.
2. **Feature 2 – Zweisprachigkeit**: Aktiviere per Klick den Sprach‑Toggle und zeige, wie sich der Content sofort ändert.  On‑Screen‑Text: „DE/IT ohne Neuladen“ / „DE/IT senza ricaricare“.
3. **Feature 3 – Local SEO & Snappy UI**: Scrolle durch die Seite und zeige die Geschwindigkeit (LCP unter 2,5 s, CLS < 0,1).  Erwähne das Schema.org‑Snippet und die mobile Optimierung.  On‑Screen‑Text: „Lädt in <2,5 s“ / „Carica in <2,5 s“.
4. **Ablauf**: Erkläre den 3‑Schritte‑Prozess (Intake → 48h Build → Go‑Live).  Zeige die entsprechende Sektion der Landing‑Page.  On‑Screen‑Text: „Intake, Umsetzung, Online“ / „Modulo, realizzazione, online“.

**CTA (10 s)**

> „Klicke auf den Link unter diesem Video, antworte mit ‘Start’ und fülle das kurze Formular aus.  In 48 Stunden ist deine neue Website online!“  
> *(IT: „Clicca sul link sotto questo video, scrivi ‘Start’ e compila il modulo.  In 48 ore il tuo nuovo sito sarà online!“)*

**Shotlist**

1. *Intro‑Shot*: Bildschirmaufnahme der Landing‑Page mit Einblendung des Hooks.
2. *Demo‑Shot*: Schnell wechselnde Screenshots/Scrolls durch die drei Demo‑Seiten mit Fokus auf WhatsApp‑CTA und Sprach‑Toggle.
3. *Leistung‑Shot*: Lighthouse‑Audit‑Screenshot mit hohem Score (> 90) und Hinweis auf LCP/CLS.
4. *Prozess‑Shot*: Bildschirmaufnahme der 3‑Schritte‑Sektion mit Pfeilen oder Hervorhebungen.
5. *Outro‑Shot*: Zurück zur Landing‑Page mit eingeblendeter CTA‑URL und dem Hinweis, das Formular auszufüllen.

## To‑Do Liste für Tag 3–4

* **Partner‑Kit erstellen**: Erstelle ein kurzes PDF/Deck für Reseller/Partner mit Preisen, Ablauf und Vorteilen.
* **Thumbnails & Screenshots**: Ersetze die Platzhalter‑Thumbnails der Demos durch echte Screenshots der finalen Seiten.  Die Thumbnails sollten 600 × 400 px groß sein und sowohl in der Light‑ als auch in der Dark‑Variante vorliegen.
* **Animationen & Feinschliff**: Kleine Hover‑Effekte, sanfte Scroll‑Animationen und feinere Typografie verbessern den Look.  Bei Bedarf kann Tailwind mit kleinen CSS‑Snippets ergänzt werden.
* **Analytics & Monitoring**: Integriere z. B. plausible.io oder Matomo für anonymes Tracking.  Beachte dabei die DSGVO und passe gegebenenfalls die Datenschutzerklärung an.
* **Multi‑Language‑Support erweitern**: Füge weitere Sprachen hinzu (EN), indem du die bestehenden `data-lang`‑Attribute erweiterst.

---

*Diese Dokumentation fasst alle nötigen Schritte zusammen, um in 48 Stunden eine branchenspezifische Website zu liefern.  Die Performance‑Ziele orientieren sich an den Core Web Vitals von Google, bei denen eine LCP unter 2,5 s und ein CLS unter 0,1 als gut gelten【857787954025474†L171-L176】【52268135763575†L139-L144】.  Bitte ersetze die Platzhalter im Code, überprüfe die rechtlichen Anforderungen und teste alle Funktionen vor dem Launch.*
## Build
- Entwicklung: `npm i` → `npm run build` → Ausgabe in /dist
- Pages Source: GitHub Actions (Settings → Pages → Source: GitHub Actions)
