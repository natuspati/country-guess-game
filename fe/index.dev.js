import React from 'react';
import './custom.scss';
import {GameApp} from "./App.dev";

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<GameApp tab="home" />);