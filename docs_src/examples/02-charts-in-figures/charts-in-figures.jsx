import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import LineChartDemo from '../../../docs_templates/LineChartDemo.jsx';
import PieChartDemo from '../../../docs_templates/PieChartDemo.jsx';

import { sections } from '../../../.cache/siteData/examples/02-charts-in-figures';

const nodeOne = document.getElementById('linechart');
// eslint-disable-next-line react/jsx-props-no-spreading
hydrateRoot(nodeOne, <LineChartDemo {...sections[1]} />);

const nodeTwo = document.getElementById('piechart');
// eslint-disable-next-line react/jsx-props-no-spreading
hydrateRoot(nodeTwo, <PieChartDemo {...sections[2]} />);
