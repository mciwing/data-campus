[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?style=flat-square&logo=github&logoColor=white)](https://github.com/mciwing/data-campus)
[![Zensical](https://img.shields.io/badge/built%20with-Zensical-FFB482?style=flat-square)](https://zensical.org)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-2496ED?style=flat-square&logo=postgresql&logoColor=white)
![pgAdmin](https://img.shields.io/badge/pgAdmin-4-2496ED?style=flat-square&logo=pgadmin&logoColor=white)
![Excel](https://img.shields.io/badge/Excel-365-2496ED?style=flat-square&logo=microsoftexcel&logoColor=white)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg?style=flat-square&logo=creativecommons&logoColor=black)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

<div align="center">
  <h1><b>DATA CAMPUS</b></h1>
  <img src="docs/assets/icon.png" alt="WING Logo" style="width: 250px; height: auto;">
  <hr>
</div>

This site offers a variety of courses focused on Data, including:

- Data Basics
- Databases with PostgreSQL
- Excel

📚 Visit the site [here](https://learn-data.at)!

## Local development

Eager to contribute or develop locally? Here's how to get started!

> [!NOTE]
> The site is built with [Zensical](https://zensical.org) — the Rust-based
> successor to Material for MkDocs from the same team. The existing
> `mkdocs.yml` config is reused via Zensical's compatibility layer.

### 1️⃣ Install `uv`

This site uses the `uv` package manager. If you haven't installed it yet,
follow the [installation guide](https://docs.astral.sh/uv/getting-started/installation/).

### 2️⃣ Project setup

Install all dependencies with:

```bash
uv sync
```

### 3️⃣ Serve the site

Serve the site locally with live reload:

```bash
uv run zensical serve
```

Visit `localhost:8000` in your browser to view the site. 🎉

To produce a static build into `site/`:

```bash
uv run zensical build
```

### 4️⃣ Write content

While the site is served locally, any changes will automatically trigger a
reload in your browser.

> [!TIP]
> The site's content lives in `docs/` and is written in Markdown. Since
> Zensical is configuration-compatible with Material for MkDocs, the
> [Material for MkDocs reference](https://squidfunk.github.io/mkdocs-material/reference/)
> is still the right place for formatting and admonition syntax.

## Contributions

Found a mistake, have an idea or want to report an issue? Contributions in any form are always welcome! 😊
