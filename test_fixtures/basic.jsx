import React from 'react';
import { createRoot } from 'react-dom/client';

const component = (<h1>Hello, world!</h1>);
const node = document.getElementById('root');
const root = createRoot(node);
root.render(component);
