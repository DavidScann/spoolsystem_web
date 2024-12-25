import {
    Container,
    Text,
    TextStyle,
} from 'pixi.js';

export class Terminal extends Container {
    constructor() {
        super();
        this.textStyle = {
            fontFamily: 'Roboto Mono',
            fontSize: 14,
            fill: 0xffffff,
            lineHeight: 18,
        };
        this.prompt();
        this.buf = '';
    }

    prompt() {
        const evalKey = (e) => {
            e.preventDefault();

            const key = e.key;
            const navKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
            if (e.key === "Enter") {
                commandHistory.push(this.buf + "\n");
                commandHistory.push(this.basicResponse(this.buf) + "\n\n");
                console.log(commandHistory);
                for (commandHistory.length; count < commandHistory.length; count++) {
                    if (count % 2 != 0) {
                        commandHistoryDisplay += commandHistory[count];
                    } else {
                        commandHistoryDisplay += directory + commandHistory[count];
                    }
                }
                displayShell.text += "\n";
                this.buf = '';
            } else if (e.key === "Backspace") {
                this.buf = this.buf.slice(0, -1);
            } else if (e.key === "ArrowUp") {
                if (count > 0) {
                    count -= 2;
                    this.buf = commandHistory[count];
                }
            } else if (e.key === "ArrowDown") {
                if (count < commandHistory.length) {
                    count += 2;
                    this.buf = commandHistory[count];
                }
            }
            else if (e.key.length === 1) {
                this.buf += e.key;
            }

            // Update display
            displayShell.text = commandHistoryDisplay + directory + this.buf;
        }

        let count = 0;
        let nread;
        let commandHistory = [];
        let commandHistoryDisplay = "";
        const directory = "username@spoolsystem:~$ ";

        const displayShell = new Text({
            text: directory, // replace "username" with actual username later
            style: this.textStyle,
        })

        // get keypress from global input box
        const textBox = document.getElementById("input-box");
        textBox.addEventListener("keydown", evalKey);
        textBox.focus();

        let cursorVisible = true;

        setInterval(() => {
            const baseText = commandHistoryDisplay + directory + this.buf;
            if (cursorVisible) {
                displayShell.text = baseText + "_";
            } else {
                displayShell.text = baseText;
            }
            cursorVisible = !cursorVisible;
        }, 1000);

        // placeholder, replace with resize later
        displayShell.x = 10;
        displayShell.y = 10;

        this.addChild(displayShell);
        return null;
    }

    basicResponse(buf) {
        switch (buf) {
            case "help":
            return `\
    help [command]              Show this general help page, and help for specific commands.
    info                        Show information about this system.
    clear                       Clear the page of text.
    collection                  View your collection of files.
    submitkey [keystring]       Enter a key for the Spool System.
    tips                        View tips to using this terminal effectively.
    passwd                      Change the password for your account.
    reset                       Reset the Spool System. [NON-RECOVERABLE]
    exit                        ITEM_DESCRIPTION_INVALID`;
    case "info":
        return ` 
 @@@@@@@@@@@@@@@@@@@@@      		username@spoolsystem
@                     @     		-----------------------------
@@                   @@     		OS: ThreadOS BETA v1.2.0
  @@@@@@@@@@@@@@@@@@@       		CPU: aDX Series 9 (36) @ 4.3GHz
   @        @@@    @        		GPU: N/A
   @    @@@        @@       		Memory: 16 GiB
   @ @@         @@ @  @@    		SpoolSystem version: b1.2.0
   @        @@@    @    @@  		>INIT_keys: 1/4
   @    @@@        @     @  
   @ @@@        @@@@     @  
   @        @@@    @     @  
   @    @@@        @        
  @@@@@@@@@@@@@@@@@@@       
@@                   @@     
@                     @     
 @@@@@@@@@@@@@@@@@@@@@
`;
            default:
            return `${buf}: command not found`;
        }
    }
}