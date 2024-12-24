async function showScreen(app) {

    const introSequence = new Container({
        isRenderGroup: true
    });

    function introMovie() {
        const terminalText = new Text({
            text: 'spool.systems',
            style: {
                fontFamily: 'Roboto Mono',
                fontSize: 14,
                fill: '0xffffff',
            }
        });
        introSequence.addChild(terminalText);
    }

    app.stage.addChild(introSequence);

    if (sequence = "intro") {
        return null;
    }
}