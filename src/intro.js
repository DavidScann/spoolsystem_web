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
    Terminal
} from './terminal.js';

import {
    getGlobalSequence,
    setGlobalSequence
} from './game.js';

export async function showScreen(app) {

    setGlobalSequence("intro");
    const sequence = getGlobalSequence();

    const introSequence = new Container({
        width: window.innerWidth,
        height: window.innerHeight,
        isRenderGroup: true
    });

    const text1 = 
    "\
Probing EDD (edd=off to disable)... ok\n \
[    0.481505] [Firmware Bug]: cpu 0, try to use APIC250 (LVT offset 2) for vect\n \
or 0xf4, but the register is already in use for vector 0x0 on this cpu\n \
[    0.030902] [Firmware Bug]: cpu 1, try to use APIC250 (LVT offset 2) for vect\n \
or 0xf4, but the register is already in use for vector 0x0 on this cpu\n \
:: running early hook [udev] \
Starting systemd-udevd version 256.6-1-arch\n \
:: running early hook [archiso_pxe_nbd] \
:: running hook [udev]\n \
:: Triggering uevents...\n \
:: running hook [memdisk]\n \
:: running hook [archiso]\n \
:: running hook [archiso_loop_mnt]\n \
:: running hook [archiso_pxe_common]\n \
:: running hook [archiso_pxe_nbd]\n \
:: running hook [archiso_pxe_http]\n \
:: running hook [archiso_pxe_nfs]\n \
:: Mounting '/dev/disk/by-label/ARCH_202109' to '/run/archiso/bootmnt'\n \
:: Device '/dev/disk/by-label/ARCH_202109' mounted successfully. \n \
:: Mounting /run/archiso/cowspace (tmpfs), size=10G...\n \
:: Mounting '/dev/loop0' to '/run/archiso/sfs/airootfs'\n \
:: Device '/dev/loop0' mounted successfully.\n \
:: running late hook [archiso_pxe_common]\n \
:: running cleanup hook [udev]\n \
";
    const text2 = 
    "\
[    0.678123] PCI: Using ACPI for IRQ routing\n \
[    0.789234] PCI: pci_cache_line_size set to 64 bytes\n \
[    0.890345] e820: reserve RAM buffer [mem 0x0009fc00-0x0009ffff]\n \
[    0.901456] e820: reserve RAM buffer [mem 0x7fee0000-0x7fffffff]\n \
[    1.012567] NetLabel: Initializing\n \
[    1.123678] NetLabel: domain hash size = 128\n \
[    1.234789] NetLabel: protocols = UNLABELED CIPSOv4 CALIPSO\n \
[    1.345890] NetLabel: unlabeled traffic allowed by default\n \
[    1.456901] ACPI: bus type PCI registered\n \
[    1.567012] acpiphp: ACPI Hot Plug PCI Controller Driver version 0.5\n \
[    1.678123] PCI: Using host bridge windows from ACPI; if necessary, use \"pci=nocrs\"\n \
[    1.789234] ACPI: Interpreter enabled\n \
[    1.890345] ACPI: Using IOAPIC for interrupt routing\n \
[    1.901456] PCI: Intercepting BIOS error on device [1c:00] operation 0x7\n \
[    2.012567] ACPI: Power Resource [PUBS] enabled\n \
"
"[    1.024876] Loading initial ramdisk...\n \
[    1.142053] Starting system initialization\n \
[    1.267890] Mounting virtual filesystems... done\n \
[    1.389245] Checking root filesystem...\n \
[    1.456789] /dev/sda1: clean, 234567/2345678 files, 12345678/23456789 blocks\n \
[    1.567890] Starting network subsystem...\n \
[    1.678912] eth0: Link is up at 1000 Mbps, full duplex\n \
[    1.789023] Starting system logger... done\n \
[    1.890123] Initializing random number generator... done\n \
";
    introMovie();

    function introMovie() {
        const terminalObject = new Terminal();
        introSequence.addChild(terminalObject);
    }

    app.stage.addChild(introSequence);

    // Handle resizing
    // Store the resize handler as a named function so we can remove it later
    const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        console.log("resize running");
        // terminalObject.resize(containerWidth, containerHeight);
    };

    // Check sequence and add listener if appropriate
    if (sequence === "intro") {
        window.addEventListener('resize', handleResize);

        // Create an interval to check the sequence and remove listener if needed
        const checkSequence = setInterval(() => {
            const currentSequence = getGlobalSequence();
            if (currentSequence !== "intro") {
                window.removeEventListener('resize', handleResize);
                clearInterval(checkSequence);
            }
        }, 1000);
    }
}