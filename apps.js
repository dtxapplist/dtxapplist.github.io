const apps = [
    {
        name: "Discord",
        icon: "icons/discord.png",
        supported: true,
        install: `# Debian/Ubuntu
sudo apt install discord

# Arch
sudo pacman -S discord`
    },
    {
        name: "Adobe Photoshop",
        icon: "icons/photoshop.png",
        supported: false,
        alt: "GIMP",
        install: `# GIMP Kurulumu (Photoshop alternatifi)
sudo apt install gimp
sudo pacman -S gimp`
    },
    {
        name: "Steam",
        icon: "icons/steam.png",
        supported: true,
        install: `# Debian/Ubuntu
sudo apt install steam

# Arch
sudo pacman -S steam`
    },
    {
        name: "Microsoft Office",
        icon: "icons/office.png",
        supported: false,
        alt: "LibreOffice",
        install: `# LibreOffice Kurulumu (Office alternatifi)
sudo apt install libreoffice
sudo pacman -S libreoffice`
    }
];
