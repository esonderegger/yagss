---
template: Article
title: Charts in figures
description: A short demo of an article featuring charts made with recharts
js: charts-in-figures.jsx
---

This is an example article showing how to include interactive charts using the [recharts](http://recharts.org/en-US) library.

---linechart
template: LineChartDemo
caption: Fig. 1. Simple Line Chart
---

Each figure can be self-contained because each element can have its own call to [hydrateRoot](https://beta.reactjs.org/reference/react-dom/client/hydrateRoot). In other words, this doesn't need to be a "single page application" where there is one root element and every child is rendered by React. I prefer thinking of these as "single div applications."

---piechart
template: PieChartDemo
caption: Fig. 2. Simple Pie Chart
items:
- name: Group A
  value: 400
- name: Group B
  value: 200
---

Eventually we will want to migrate this example to something that makes charts that are usable prior to calling `hydrateRoot`.
