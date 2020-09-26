import React from 'react';
import { format } from 'date-fns';

const item = (props) => {
  if (props.audios.length < 1) {
    return null;
  }
  const audio = props.audios[0];
  const audioUrl = `${props.siteUrl}${props.relativeDir}/${audio.name}`;
  const children = [
    React.createElement('guid', { isPermalink: 'true' }, audioUrl),
    React.createElement('xml-link', {}, props.url),
    React.createElement('title', {}, props.title),
    React.createElement('description', {}, props.description),
    React.createElement('itunes:summary', {}, props.description),
    React.createElement('pubDate', {}, format(new Date(props.pubDate), 'iii, dd LLL y HH:mm:ss xx')),
    React.createElement('itunes:duration', {}, audio.probe.streams[0].duration),
    React.createElement('enclosure', { length: audio.encodedSize, url: audioUrl, type: 'audio/mpeg' }),
  ];
  return React.createElement('item', {}, children);
};

const image = (props) => {
  const children = [
    React.createElement('url', {}, props.url),
    React.createElement('title', {}, props.title),
    React.createElement('xml-link', {}, props.link),
  ];
  return React.createElement('image', {}, children);
};

const owner = (props) => {
  const children = [
    React.createElement('itunes:name', {}, props.name),
    React.createElement('itunes:email', {}, props.email),
  ];
  return React.createElement('itunes:owner', {}, children);
};

const category = (categorStr) => {
  const parts = categorStr.split('>');
  const stripped = parts.map((part) => part.trim());
  if (stripped.length === 1) {
    return React.createElement('itunes:category', { text: stripped[0] });
  }
  const child = React.createElement('itunes:category', { text: stripped[1] });
  return React.createElement('itunes:category', { text: stripped[0] }, [child]);
};

const channel = (props) => {
  const now = new Date();
  const linkUrl = `${props.siteUrl}${props.relativeDir}/${props.link}`;
  const imageUrl = `${props.siteUrl}${props.relativeDir}/${props.image}`;
  const channelElements = [
    React.createElement('language', {}, props.language || 'en-us'),
    React.createElement('title', {}, props.title),
    React.createElement('xml-link', {}, linkUrl),
    React.createElement('copyright', {}, props.copyright),
    React.createElement('description', {}, props.description),
    React.createElement('docs', {}, 'https://cyber.harvard.edu/rss/rss.html'),
    React.createElement('itunes:summary', {}, props.description),
    image({ url: imageUrl, title: props.title, link: linkUrl}),
    React.createElement('itunes:image', { href: imageUrl }, null),
    React.createElement('itunes:author', {}, props.author),
    owner({ name: props.author, email: props.email }),
    React.createElement('itunes:explicit', {}, props.explicit ? 'Yes' : 'No'),
    React.createElement('lastBuildDate', {}, format(now, 'iii, dd LLL y HH:mm:ss xx')),
    React.createElement('atom:link', { href: props.url, rel: 'self', type: 'application/rss+xml'}),
  ];
  const categories = props.categories.map(category);
  const items = props.items.map((i) => item(i));
  const children = channelElements.concat(categories, items);
  return React.createElement('channel', {}, children);
};

const rss = (props) => {
  const attrs = { version: '2.0' };
  attrs['xmlns:atom'] = 'http://www.w3.org/2005/Atom';
  attrs['xmlns:itunes'] = 'http://www.itunes.com/dtds/podcast-1.0.dtd';
  const child = channel(props);
  return React.createElement('rss', attrs, child);
};

export default rss;
