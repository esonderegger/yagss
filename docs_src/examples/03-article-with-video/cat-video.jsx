import React from 'react';
import ReactDOM from 'react-dom';
import Video from '../../../docs_templates/Video.jsx';

import { sections, videos } from '../../../.cache/siteData/examples/03-article-with-video';

const nodeOne = document.getElementById('lolo');
ReactDOM.hydrate(<Video videos={videos} src={sections[1].src} />, nodeOne);
