---
layout: default
title: candlestick
---

<p class="lede">
Notes from building <a href="https://github.com/cm45t3r/candlestick">candlestick</a>,
an open-source candlestick pattern detection library for Node.js — 18 patterns,
zero runtime dependencies, no native build step.
</p>

<ul class="post-list">
{% for post in site.posts %}
  <li>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %-d, %Y" }}</time>
    {% if post.description %}<p>{{ post.description }}</p>{% endif %}
  </li>
{% endfor %}
</ul>
