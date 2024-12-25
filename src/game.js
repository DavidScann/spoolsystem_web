import {
    Application,
    Sprite,
    Assets,
    TextureStyle,
    Container,
    Text,
    TextStyle,
    Graphics,
    Ticker
} from 'pixi.js';

import {
    CRTFilter,
    AdvancedBloomFilter,
    RGBSplitFilter
} from 'pixi-filters';

import {
    showScreen as showLangSelect,
} from './langselect.js';

import { showScreen as showIntroMovie } from './intro.js';

// import { FancyButton } from '@pixi/ui';

// Global sequence state
let _globalSequence = "";

export function getGlobalSequence() {
    return _globalSequence;
}

export function setGlobalSequence(value) {
    _globalSequence = value;
}

// WebFont loading
WebFont.load({
    google: {
        families: ['Roboto Mono'],
    }
});

// PIXI App Initialization
const app = new Application();
await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    resizeTo: window, // Auto-resize canvas to the window
});
document.body.appendChild(app.canvas);

// Global PIXI app reference for debugging
globalThis.__PIXI_APP__ = app;

// Apply filters to the stage
app.stage.filters = [
    new CRTFilter(),
    new RGBSplitFilter({
        redX: 3,
        redY: 1,
        blueX: 0,
        blueY: 0,
        greenX: -3,
        greenY: -1,
    }),
    new AdvancedBloomFilter({
        bloomScale: 1.4,
        blur: 10,
        padding: 500,
    }),
];

// Set texture scaling to nearest neighbor
TextureStyle.defaultOptions.scaleMode = 'nearest';

if (document.cookie.match("language") == null) {
    console.log("no language cookie");
    showLangSelect(app);
} else {
    console.log("language cookie found " + document.cookie);
    showIntroMovie(app);
}