import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Video from '../../../docs_templates/Video.jsx';

import { sections, videos } from '../../../.cache/siteData/examples/03-article-with-video';

const nodeOne = document.getElementById('lolo');
hydrateRoot(nodeOne, <Video videos={videos} src={sections[1].src} />);
