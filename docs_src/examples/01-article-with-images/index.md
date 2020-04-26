---
template: Article
title: Article with Images
description: Automatically create responsive images
---

This is an example article showing how to include static components like images in them.

One of the most powerful features of Yagss is how it automatically scales jpeg images in the source directory and parses their metadata, making that metadata availale to the rendering context.

---flowers
template: ImageFigure
image: flowers
caption: A close-up of a flower in Crestwood, Washington, DC
---

This is simply a collection of snippets of text written in markdown, interspersed with snippets of yaml specifying which template to use.

---birds
template: ImageFigure
image: birds
caption: Two doves sitting on a fence in Crestwood, Washington, DC
---

There is no need for hydration because the DOM never changes after the build process is run.
