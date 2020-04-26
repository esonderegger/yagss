import React from 'react';
import ReactDOM from 'react-dom';
import LineChartDemo from '../../../docs_templates/LineChartDemo.jsx';
import PieChartDemo from '../../../docs_templates/PieChartDemo.jsx';

import { sections } from '../../../.cache/siteData/examples/02-charts-in-figures';

const nodeOne = document.getElementById('linechart');
// eslint-disable-next-line react/jsx-props-no-spreading
ReactDOM.hydrate(<LineChartDemo {...sections[1]} />, nodeOne);

const nodeTwo = document.getElementById('piechart');
// eslint-disable-next-line react/jsx-props-no-spreading
ReactDOM.hydrate(<PieChartDemo {...sections[2]} />, nodeTwo);
