# Auction archive

The archive is embedded in Squarespace. GitHub Pages publishes the `main` branch at https://davidambart.github.io/david_auctions/.

## Adding an auction

1. Upload images into `assets/images/`. Start with the painting name, for example `witnesses-2026-david-ambarzumjan-01.jpg`. The final `01`, `02`, etc. identifies the gallery image; no auction number belongs at the beginning.
2. Add a row to `data/auctions.csv`. Keep the column names. Both semicolon-delimited spreadsheet exports and comma-delimited CSV files are supported. Use an ISO auction date such as `2026-09-03`.
3. In the `images` cell, list the paths separated by ` | `, for example `assets/images/witnesses-2026-david-ambarzumjan-01.jpg | assets/images/witnesses-2026-david-ambarzumjan-02.jpg`.
   For a non-square painting, add a separate square thumbnail named `witnesses-2026-david-ambarzumjan-thumb.jpg` and put its path in the optional `thumbnail` column. Keep it out of the `images` list. The grid uses this square thumbnail; the gallery shows the numbered full-format images in the listed order, fitted without cropping. If `thumbnail` is blank, the grid uses the first gallery image as before.
4. Commit and push to `main`. Allow the GitHub Pages deployment and browser cache to refresh.

IDs should be unique and stable. Existing auctions do not need to be renumbered when a new one is added. Prices such as `13000,00 €`, `13.000,00 €`, `13,000.00 EUR`, and `$1300 USD` are supported. Records without images display an explicit placeholder and no active gallery button.

The former `untitled` image files for Սևան and Աշուն use the distinct names `sevan` and `ashun` to avoid filename collisions.

## Squarespace integration

Use a single versioned script in Footer Code Injection, with `data-base-url="https://davidambart.github.io/david_auctions/"`. This keeps the application code versioned while allowing the CSV and images to update through GitHub Pages. For example, replace `COMMIT` with the published application commit:

```html
<script src="https://cdn.jsdelivr.net/gh/davidambart/david_auctions@COMMIT/assets/embed.js?v=COMMIT"
        data-base-url="https://davidambart.github.io/david_auctions/" defer></script>
```

If the existing fallback loader is retained, update its script URL to the same version and set `script.dataset.baseUrl = "https://davidambart.github.io/david_auctions/"` before appending it. Retain the disabled auction banner unless a new banner is explicitly requested.

This integration setting must be saved in Squarespace before future data updates become independent of the application commit. Merely pushing these files does not change Squarespace's pinned script URL.

## Checks

Run `node scripts/check.mjs`. Serve the project locally and open `/scripts/preview.html` to inspect the embed, or `/` for the standalone archive.
