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
    getGlobalSequence,
    setGlobalSequence
} from './game.js';

import {
    showScreen as showIntroMovie,
} from './intro.js';

export async function showScreen(app) {
    // Create the language sequence container
    const langSequence = new Container({
        isRenderGroup: true
    });

    // State to track the currently selected flag
    let selectedFlag = null;

    // Sequence tracker, helps to determine the order of events
    setGlobalSequence("languageSelect");
    let sequence = getGlobalSequence();

    // Sprite resizing function
    function resizeFlags(sprite, xPositionFactor = 0.5, containerWidth, containerHeight) {
        if (containerWidth === undefined || containerHeight === undefined) {
            containerWidth = window.innerWidth;
            containerHeight = window.innerHeight;
        }

        // Calculate scale to maintain aspect ratio
        const scaleWidth = containerWidth / sprite.texture.width;
        const scaleHeight = containerHeight / sprite.texture.height;
        let scaleFactor = Math.min(scaleWidth, scaleHeight) * 0.14;

        // Adjust position based on screen width
        if (containerWidth < 600) { // Adjust this value as needed
            // Align vertically
            scaleFactor *= 1.2;
            sprite.x = containerWidth / 2;
            sprite.y = containerHeight * xPositionFactor;
        } else {
            // Align horizontally
            sprite.x = containerWidth * xPositionFactor;
            sprite.y = containerHeight / 2;
        }
        // Apply scaling
        sprite.scale.set(scaleFactor);
    }

    // Setting up a container for Flags
    const flagsRender = new Container({
        isRenderGroup: true
    });

    // Move flags container into langSequence
    langSequence.addChild(flagsRender);

    // Function to load and setup a sprite
    async function setupFlags(imagePath, xPositionFactor = 0.5) {
        await Assets.load(imagePath); // Preload the texture
        const sprite = Sprite.from(imagePath);
        sprite.anchor.set(0.5);
        sprite.alpha = 0.4;
        sprite.interactive = true;
        sprite.buttonFrameMode = true;
        sprite.cursor = 'pointer';

        // Flicker logic
        let flickerDuration = 220;
        let flickerInterval = 25;
        let targetAlpha = sprite.alpha;
        let flickering = false;
        let flickerTimer = 0;

        app.ticker.add(() => {
            if (flickering) {
                flickerTimer += app.ticker.deltaMS;
                if (Math.floor(flickerTimer / flickerInterval) % 2 === 0) {
                    sprite.alpha = 1;
                } else {
                    sprite.alpha = 0.1 + (flickerTimer / flickerDuration);
                }

                if (flickerTimer >= flickerDuration) {
                    flickering = false;
                    flickerTimer = 0;
                    sprite.alpha = targetAlpha;
                }
            }
        });

        sprite.on('pointerenter', () => {
            if (sprite !== selectedFlag) {
                flickering = true;
                flickerTimer = 0;
                targetAlpha = 1;
            }
        });

        sprite.on('pointerleave', () => {
            if (sprite !== selectedFlag) {
                flickering = true;
                flickerTimer = 0;
                targetAlpha = 0.4;
            }
        });

        sprite.on('pointerdown', () => {
            selectFlag(sprite);
        });

        resizeFlags(sprite, xPositionFactor);
        flagsRender.addChild(sprite);
        return sprite;
    }

    let flagMoved = false;
    let langSelect;
    // Function to select a flag
    function selectFlag(flag) {
        if (selectedFlag) {
            selectedFlag.alpha = 0.4; // Deselect current flag
        }
        selectedFlag = flag;
        if (selectedFlag === flagGB) {
            langSelect = 'en';
        } else {
            langSelect = 'vn';
        }
        selectedFlag.alpha = 1; // Keep alpha at 1 for the selected flag
        if (flagMoved != true) {
            animateFlagsRenderUpwards();
            flagMoved = true;
        }
        if (textSpawn != true) {
            disclaimerText(selectedFlag);
            textSpawn = true;
        } else {
            if (selectedFlag === flagGB) {
                langDisclaimerText = GBLangDisclaimerText;
            } else {
                langDisclaimerText = VNLangDisclaimerText;
            }
            cookieDisclaimerText.text = langDisclaimerText;
            resizeDisclaimer(cookieDisclaimerText, window.innerWidth, window.innerHeight);
        }
        if (buttonCreated != true) {
            createButtonFrame(selectedFlag);
            buttonCreated = true;
        } else {
            if (selectedFlag === flagGB) {
                langButtonText = GBButtonText;
            } else {
                langButtonText = VNButtonText;
            }
            buttonFrameText.text = langButtonText;
        }

    }

    // define flagTicker "globally" to be able to destroy it later
    const flagTicker = new Ticker();

    // Function to animate the flagsRender container upwards
    function animateFlagsRenderUpwards() {
        const startY = flagsRender.y; // Current position
        const targetY = startY - 50; // Move up by 50 pixels
        const duration = 1250; // Animation duration in milliseconds
        const easing = (t) => 1 - Math.pow(2, -10 * t); // Ease-out Exponential function

        let elapsedTime = 0;

        // Add a ticker to animate the movement
        flagTicker.add((delta) => {
            elapsedTime += flagTicker.deltaMS;

            // Calculate the current progress (0 to 1)
            const progress = Math.min(elapsedTime / duration, 1);

            // Apply easing
            const easedProgress = easing(progress);

            // Update the container's position
            flagsRender.y = startY + (targetY - startY) * easedProgress;

            if (progress >= 1) {
                flagTicker.destroy(); // Remove the ticker
            }
        });
        flagTicker.start();
    };
    const GBLangDisclaimerText = "THIS SITE USES COOKIES TO \nSAVE YOUR PROGRESS. CONTINUE?";
    const VNLangDisclaimerText = "WEBSITE NÀY SỬ DỤNG COOKIES ĐỂ \nLƯU QUÁ TRÌNH CỦA BẠN. TIẾP TỤC?";
    let cookieDisclaimerText;
    let textSpawn = false;
    let langDisclaimerText;

    function disclaimerText(flag) {
        const style = new TextStyle({
            fontFamily: 'Roboto Mono',
            fontSize: 20,
            fill: '0xffffff',
        });
        if (flag === flagGB) {
            langDisclaimerText = GBLangDisclaimerText;
        } else {
            langDisclaimerText = VNLangDisclaimerText;
        }
        cookieDisclaimerText = new Text({
            text: langDisclaimerText,
            style
        });
        cookieDisclaimerText.anchor.set(0.5);
        cookieDisclaimerText.alpha = 0; // Set initial alpha to 0
        resizeDisclaimer(cookieDisclaimerText, window.innerWidth, window.innerHeight);
        animateDisclaimerText(cookieDisclaimerText, window.innerWidth, window.innerHeight);
        langSequence.addChild(cookieDisclaimerText);
    }

    function resizeDisclaimer(text, containerWidth, containerHeight) {
        // Ensure word wrap is enabled
        // text.style.wordWrap = true;
        // text.style.wordWrapWidth = containerWidth;

        // Initial scaling factor
        let scaleFactor = Math.min(containerWidth / text.width, containerHeight / text.height) / 5;

        // Apply initial scaling
        text.style.fontSize *= scaleFactor;

        // Adjust position
        text.x = containerWidth / 2;
        text.y = containerHeight / 1.65;

        // Check dimensions and adjust font size iteratively if needed
        while (text.width > containerWidth || text.height > containerHeight) {
            text.style.fontSize *= 0.9; // Decrease font size by 10%
            text.text = text.text; // Trigger text update
        }

        // Set a minimum font size
        const minFontSize = 14; // Adjust this value as needed
        if (text.style.fontSize < minFontSize) {
            text.style.fontSize = minFontSize;
        }
    }

    function animateDisclaimerText(text, containerWidth, containerHeight) {
        const startY = text.y - 50; // Current position
        const targetY = startY + 50; // Move up by 50 pixels
        const duration = 1250; // Animation duration in milliseconds
        const easing = (t) => 1 - Math.pow(2, -10 * t); // Ease-out Exponential function

        let elapsedTime = 0;

        // Add a ticker to animate the movement
        const cookieTicker = new Ticker()
        cookieTicker.add((delta) => {
            elapsedTime += cookieTicker.deltaMS;

            // Calculate the current progress (0 to 1)
            const progress = Math.min(elapsedTime / duration, 1);

            // Raise alpha from 0 to 1
            if (progress < 0.5) {
                text.alpha = progress * 2;
            }

            // Apply easing
            const easedProgress = easing(progress);

            // Update the container's position
            text.y = startY + (targetY - startY) * easedProgress;

            // Stop the animation when it's done
            if (progress >= 1) {
                cookieTicker.destroy(); // Remove the ticker
            }
        });
        cookieTicker.start();
    }

    // Initialize and place sprites
    let flagGB, flagVN;
    async function initSprites() {
        flagGB = await setupFlags('/assets/flaggb_lowres.png', 0.4);
        flagVN = await setupFlags('/assets/flagvn_lowres.png', 0.6);
    }

    await initSprites();

    // Add container to the stage
    langSequence.addChild(flagsRender);

    const cookieButton = new Container({
        isRenderGroup: true
    });

    const buttonWidth = window.innerWidth / 7;
    const buttonHeight = window.innerHeight / 12;
    const GBButtonText = 'CONTINUE';
    const VNButtonText = 'TIẾP TỤC';
    let langButtonText, buttonCreated, buttonFrameText;
    const buttonFrame = new Graphics();

    function createButtonFrame(flag) {
        buttonFrame.rect(0, 0, buttonWidth, buttonHeight);
        buttonFrame.fill({
            alpha: 0,
            color: 0x8c8c8c
        });
        buttonFrame.stroke({
            color: 0xffffff,
            alpha: 1,
            width: 5
        });

        setTimeout(() => {
            buttonFrame.interactive = true;
        }, 1250); // Match the duration of the longest animation (1250ms)
        buttonFrame.buttonMode = true;
        buttonFrame.cursor = 'pointer';
        buttonFrame.on('pointerdown', () => {
            finishSetup(langSequence);
        });
        buttonFrame.x = (window.innerWidth - buttonFrame.width) / 2;
        buttonFrame.y = (window.innerHeight - buttonFrame.height) / 1.35;
        cookieButton.addChild(buttonFrame);
        if (flag === flagGB) {
            langButtonText = GBButtonText;
        } else {
            langButtonText = VNButtonText;
        }
        // Add "Continue" text in the middle of the frame
        const style = new TextStyle({
            fontFamily: 'Roboto Mono',
            fontSize: 20,
            fill: '0xffffff',
        });
        buttonFrameText = new Text({
            text: langButtonText,
            style
        });
        buttonFrameText.anchor.set(0.5);
        buttonFrameText.x = buttonFrame.x + buttonWidth / 2;
        buttonFrameText.y = buttonFrame.y + buttonHeight / 2;
        cookieButton.alpha = 0;
        setTimeout(() => {
            resizeButton(buttonFrame, buttonFrameText, window.innerWidth, window.innerHeight);
            animateCookieButton(cookieButton);
            cookieButton.addChild(buttonFrameText);
            langSequence.addChild(cookieButton);
        }, 600);
    }

    function resizeButton(buttonFrame, buttonFrameText, containerWidth, containerHeight) {
        // Calculate new button dimensions based on container size
        let newButtonWidth, newButtonHeight;
        if (containerWidth < 600) { // Adjust this value as needed
            // Align vertically
            newButtonWidth = containerWidth / 4;
            newButtonHeight = containerHeight / 12;
        } else {
            // Align horizontally
            newButtonWidth = containerWidth / 7;
            newButtonHeight = containerHeight / 12;
        }

        // Update button frame dimensions
        buttonFrame.clear();
        buttonFrame.beginFill(0x8c8c8c, 0);
        buttonFrame.lineStyle(5, 0xffffff, 1);
        buttonFrame.drawRect(0, 0, newButtonWidth, newButtonHeight);
        buttonFrame.endFill();

        // Update button frame position
        buttonFrame.x = (containerWidth - newButtonWidth) / 2;
        buttonFrame.y = (containerHeight - newButtonHeight) / 1.35;

        // Update button text position
        buttonFrameText.anchor.set(0.5); // Center the text
        buttonFrameText.x = buttonFrame.x + newButtonWidth / 2;
        buttonFrameText.y = buttonFrame.y + newButtonHeight / 2;

        // Update button text font
        buttonFrameText.style.fontSize = Math.min(newButtonWidth, newButtonHeight) / 4;

        // Ensure the text is centered after resizing
        buttonFrameText.x = buttonFrame.x + newButtonWidth / 2;
        buttonFrameText.y = buttonFrame.y + newButtonHeight / 2;
    }

    // define buttonTicker "globally" to be able to destroy it later
    const buttonTicker = new Ticker();

    function animateCookieButton(cookieButton) {
        const startY = cookieButton.y - 50; // Current position
        const targetY = startY + 50; // Move up by 50 pixels
        const duration = 1250; // Animation duration in milliseconds
        const easing = (t) => 1 - Math.pow(2, -10 * t); // Ease-out Exponential function

        let elapsedTime = 0;

        // Add a ticker to animate the movement
        buttonTicker.add((delta) => {
            elapsedTime += buttonTicker.deltaMS;

            // Calculate the current progress (0 to 1)
            const progress = Math.min(elapsedTime / duration, 1);

            // Raise alpha from 0 to 1
            if (progress < 0.5) {
                cookieButton.alpha = progress * 2;
            }

            // Apply easing
            const easedProgress = easing(progress);

            // Update the container's position
            cookieButton.y = startY + (targetY - startY) * easedProgress;

            // Stop the animation when it's done
            if (progress >= 1) {
                buttonTicker.destroy(); // Remove the ticker
            }
        });
        buttonTicker.start();
    }

    app.stage.addChild(langSequence);

    function finishSetup(container) {
        buttonFrame.interactive = false; // Disable button interactivity
        const startY = container.y; // Current position
        const targetY = startY + 50; // Move down by 50 pixels
        const duration = 750; // Animation duration in milliseconds
        const easing = (t) => t * t; // Ease-in Exponential function

        let elapsedTime = 0;

        // Add a ticker to animate the movement
        const exitTicker = new Ticker()
        exitTicker.add((delta) => {
            elapsedTime += exitTicker.deltaMS;

            // Calculate the current progress (0 to 1)
            const progress = Math.min(elapsedTime / duration, 1);

            // Lower brightness from 1 to 0
            if (progress < 0.5) {
                container.alpha = 1 - progress * 2;
                if (container.alpha < 0.12) {
                    container.alpha = 0;
                }
            }

            // Apply easing
            const easedProgress = easing(progress);

            // Update the container's position
            container.y = startY + (targetY - startY) * easedProgress;

            // Stop the animation when it's done
            if (progress >= 1) {
                exitTicker.destroy(); // Remove the ticker
                app.stage.removeChild(container); // Remove the container from the stage
                Assets.unload(['/assets/flaggb_lowres.png', '/assets/flagvn_lowres.png']); // Unload all assets
                container.destroy({
                    children: true,
                    baseTexture: true
                }); // Destroy the container and its children
            }
        });
        const language = langSelect; // language locked in
        document.cookie = `language=${language}`;
        exitTicker.start();
        showIntroMovie(app);
        sequence = getGlobalSequence();
    }

    // handle resizing
    console.log(sequence);
    // Store the resize handler as a named function so we can remove it later
    const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        resizeFlags(flagGB, 0.4, containerWidth, containerHeight);
        resizeFlags(flagVN, 0.6, containerWidth, containerHeight);
        resizeDisclaimer(cookieDisclaimerText, containerWidth, containerHeight);
        resizeButton(buttonFrame, buttonFrameText, containerWidth, containerHeight);
    };

    // Check sequence and add listener if appropriate
    if (sequence === "languageSelect") {
        window.addEventListener('resize', handleResize);

        // Create an interval to check the sequence and remove listener if needed
        const checkSequence = setInterval(() => {
            const currentSequence = getGlobalSequence();
            if (currentSequence !== "languageSelect") {
                window.removeEventListener('resize', handleResize);
                clearInterval(checkSequence);
            }
        }, 1000);
    }
}