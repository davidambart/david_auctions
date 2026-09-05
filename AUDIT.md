# Prüfung der Auktionsseite — 5. September 2026

Geprüft wurden https://david-ambarzumjan.com/auctions sowie das lokale Archiv-Modul und die separate HTML-Seite. Die Verbesserungen wurden nach Freigabe veröffentlicht; Squarespace verwendet die Version `b33bdc7`.

## Behoben

- Ganze Galerien werden nicht mehr allein durch Scrollen vorgeladen. Vorladen erfolgt bei Hover, Tastaturfokus, Berührung oder Öffnen einer Galerie. Nur die ersten drei Vorschaubilder sind sofort priorisiert; weitere werden bedarfsgerecht geladen.
- Beim schnellen Scrollen werden bereits geladene Karten vor der aufwendigen Positionsmessung ausgeschlossen.
- Gleiche Filterergebnisse werden nicht erneut aufgebaut; bestehende Bilder und Einblendungen bleiben erhalten. Die separate HTML-Seite sortiert ihre Karten nur bei geänderter Sortierauswahl neu.
- Fehlgeschlagene Galerieanfragen bleiben nicht dauerhaft im Cache. Ein erneuter Versuch ist möglich; die Galerie zeigt bei Fehlern einen Hinweis.
- Entfernen und erneutes Einsetzen des Archiv-Elements initialisiert Ereignisse und Beobachter neu. Veraltete Datenanfragen werden abgebrochen; eine geöffnete Galerie gibt die Scrollsperre frei.
- Mehrfache Ausführung des Embed-Skripts wird bereits am Anfang abgefangen.
- Galerie erhält einen zugänglichen Namen, einen angesagten Bildzähler und sichtbaren Tastaturfokus. Pfeiltasten verhindern nebenher ausgelöstes Scrollen.
- Filter zeigen die aktuelle Trefferzahl. Mobile Eingaben verwenden 16 px Schriftgröße.
- Widersprüchliche Robots-Angaben und doppelte CSS-Regeln der separaten HTML-Seite bereinigt. Die vorhandene Noindex-Einstellung bleibt bestehen.
- Galerie-Datenattribute der separaten HTML-Seite werden vollständig HTML-escaped; Schließen entfernt die Bildquelle statt einer leeren URL.

## Prüfergebnisse

- 91 Werke, 266 referenzierte Bilddateien: alle lokal vorhanden, keine doppelten IDs.
- Live: Suche, leere Trefferliste, Reset, Galerie-Bildwechsel und höchste Preissortierung funktionieren.
- Lokales Embed: Suche, Trefferzahl, Reset, Jahresfilter (2018: 13 Werke), alle vier Sortierungen, Galerie per Pfeiltaste/Escape und erneutes Einsetzen geprüft.
- Erwartete erste Werke: neueste Lori, älteste Coastline, höchster Betrag Gelid, niedrigster Betrag Mirror.
- Mobile Breiten 320 und 390 px ohne horizontalen Dokumentüberlauf; Desktopansicht bei 1280 px geprüft. Kein Test auf einem physischen iPhone.
- Separate HTML-Seite: Suche nach Änderung der Sortierung, Trefferzahl, Galerie und Reset geprüft.
- Keine JavaScript-Fehler in den geprüften lokalen Browserabläufen. Live nur beobachtete Squarespace-YUI-Warnungen.
- `node scripts/check.mjs` prüft CSV-Sonderzeichen, Daten/Bildpfade, bestehende Währungsumrechnung, Wiederholung fehlgeschlagener Bildanfragen, Cache-Wiederverwendung, Scrollsperre und mehrfache Skripteinbindung.
- JavaScript-Syntaxprüfung und `git diff --check` bestanden.

## Squarespace: Ausgangsbefunde und Umsetzung

1. **Veralteter Auktionsbanner:** Die Seite zeigt noch „New Auction · Closes Sep 3, 18:00 UTC“ und „Join the Auction“. Das angegebene Datum liegt vor dem Prüfungstag. Banner aktualisieren oder entfernen; ein automatisches Ablaufdatum wäre sinnvoll. Der Banner liegt nicht in diesem Repository.
2. **Vier Skripteinbindungen:** Im Live-DOM steht dieselbe Embed-URL viermal. Auf eine Einbindung reduzieren. Der neue frühe Schutz vermeidet zusätzliche Initialisierung, ersetzt aber die Bereinigung der Einbindungen nicht.
3. **Fest angegebene ältere Version:** Die Live-URL verweist auf `@14874be/assets/embed.js?v=14874be`; lokaler Ausgangsstand ist `a3e4e4d`. Nach Veröffentlichung der Änderungen muss die Squarespace-Einbindung auf die neue veröffentlichte Version gesetzt werden.

Alle drei Punkte wurden anschließend umgesetzt: Der Banner-Loader ist als `text/plain` deaktiviert und bleibt zur späteren Wiederverwendung gespeichert. Der globale Footer enthält nur noch eine reguläre Archiv-Einbindung und einen Fallback-Loader, jeweils mit der Version `b33bdc7`. Die übrigen Inhalte der Code-Injektion bleiben unverändert. Die CDN-Datei wurde vor der Umstellung bytegenau mit der geprüften lokalen Version verglichen.

Die öffentliche Seite wurde nach dem Speichern erneut geladen: kein Banner, genau eine geladene Archiv-Skript-URL, 91 Werke. Suche mit aktualisierter Trefferzahl, Galerie-Bildwechsel, Reset und höchste Preissortierung funktionieren. Die mobile Live-Ansicht bei 390 px zeigt keinen horizontalen Überlauf; in den geprüften Abläufen wurden keine JavaScript-Fehler protokolliert.

Es wurde kein Lighthouse-Lauf und keine Messung unter gedrosseltem Mobilfunk durchgeführt; daher keine numerische Geschwindigkeitszusage. Historische Auktionsergebnisse und Wechselkurse wurden auf technische Verarbeitung, nicht anhand externer Originalbelege geprüft.

## Lokal nachprüfen

Im Projekt einen lokalen Webserver starten und `/scripts/preview.html` für das Embed oder `/` für die separate Seite öffnen. Die Vorschau bietet einen Knopf zum erneuten Einsetzen des Moduls. `node scripts/check.mjs` führt die automatischen Prüfungen aus.
