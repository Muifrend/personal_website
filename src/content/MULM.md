---
title: "MULM: Workflow Automation for Students"
date: 2026-01-06
description: "A productivity tool automating the workflow between Minerva's Forum and Google NotebookLM, built with React 19, Tailwind v4, and TypeScript."
tags:
  - React
  - TypeScript
  - Chrome Extension
cover: "../assets/projects/MULM.png"
repo: "https://github.com/Muifrend/MUML"
link_url: "https://chromewebstore.google.com/detail/kchcndllnnpddfldhdbphkhkdbcdeakl?utm_source=item-share-cb"
link_text: "Chrome Web Store"
---

I architected and shipped **MULM**, a production-ready Chrome Extension that integrates Minerva University's "Forum" platform with Google's NotebookLM. This project represents an end-to-end product development cycle, moving from identifying a specific user friction point to deploying a live solution for the student community.

Managing the full release lifecycle, I:
* **Designed & Developed:** Built a robust user interface using **React 19** and **Tailwind CSS v4**, implementing modern hook patterns and a high-performance styling engine.
* **Engineered the Core Logic:** Wrote complex **TypeScript** content scripts to securely scrape data across different DOM origins and inject it into third-party AI tools.
* **Configured Production Ops:** Established a custom build pipeline using **Vite 7** and `crxjs` to handle hot-module replacement and optimize assets for the Manifest V3 environment.
* **Shipped:** Successfully navigated the Chrome Web Store review process to publish Version 1.0.0, making the tool immediately available for installation.