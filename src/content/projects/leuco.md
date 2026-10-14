---
title: "Leuco: Privacy-first Pool Safety"
date: 2026-02-28
description: "A home-pool drowning-risk proof of concept that grew from a hackathon idea into a local camera and Jetson demo."
tags:
  - Python
  - Computer Vision
  - NVIDIA Jetson
  - AI
repo: "https://github.com/Muifrend/leuco_live_demo"
link_url: "https://www.youtube.com/watch?v=uVCIBp2lz4Q"
link_text: "Watch the demo"
---

As a certified lifeguard, I was appalled to learn that **drowning is the leading cause of death for children ages 1–4 in the United States** ([CDC](https://www.cdc.gov/drowning/data-research/facts/index.html)). Leuco is an on-device drowning-risk proof of concept for home pools, keeping video of children and families on the local network instead of streaming it to the cloud.

<iframe
  src="https://www.youtube.com/embed/uVCIBp2lz4Q?feature=oembed"
  title="Leuco: on-device pool drowning-risk detection demo"
  width="720"
  height="405"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  allow="encrypted-media; picture-in-picture"
  allowfullscreen
  style="display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; border: 0; border-radius: 12px; margin: 2rem 0;"
></iframe>

### An idea I kept coming back to

I built the first version at the **Google DeepMind × InstaLILY AI Hackathon in San Francisco on February 28, 2026** ([participation certificate](https://certopus.com/c/6e5e1893fb964da696886e78ff7442e1)). It was an **edge AI hackathon**, focused on running AI on the device. For a home-pool camera, that is a privacy requirement: footage of children swimming in their backyard should not have to pass through a third-party inference service. That was where Leuco was born. I kept returning to the idea afterward, developing it through further hackathon iterations and thinking about what it would take to make it useful beyond a demo.

The opportunity to build something more concrete came from another project. In May 2026, my team placed **third at the Physical AI Hack World Tour SF**, a 48-hour hackathon hosted by MakerMods Robotics and Founders, Inc., with 300 builders and 20 robots. We built an autonomous bread-flipping robot on the MakerMods XLeRobot, chaining imitation-learning policies to complete a full multi-step task sequence. The prize included a **Jetson Orin Nano**.

That Jetson became the hardware for Leuco. Over the summer, a friend who is a hardware engineer and I decided to use it to turn the idea into a more concrete system. Having the device gave us a way to explore the constraint I cared about: processing a home-pool camera feed locally, without continuously sending video to a cloud service.

### From a camera feed to a local demo

The current proof of concept runs on the Jetson and reads a local Amcrest camera feed. It uses pose or motion inference, tracks one swimmer, and limits risk scoring to a calibrated pool area. It looks at activity over time, including upper-body movement, limited forward progress, and a previously tracked swimmer disappearing from view.

Inference, tracking, risk scoring, and the alert decision all happen locally. An annotated stream and status dashboard are available on the local network, with optional notifications through ntfy. The [recorded demo](https://www.youtube.com/watch?v=uVCIBp2lz4Q) shows this version in action.

This is still a proof of concept, with camera placement, calibration, and real-world reliability left to develop. It is an additional safety idea, not a replacement for adult supervision or established pool-safety measures.

### Top 10%, then a rejection

We applied to **Founders, Inc. Off Season II** as a next step for the project. The application landed in the **top 10% of the full pool**, but we were not accepted. Their June 20, 2026 email encouraged us to keep building and apply again.

[![Cropped Founders, Inc. email titled Off Season II — Application Update, declining the application and confirming that it landed in the top 10% of the full pool.](/images/projects/leuco-offseason-email.webp)](/images/projects/leuco-offseason-email.webp)

*Rejection of the Off Season II application*

### The rejection did not change why I started Leuco. I hope to continue this project.
