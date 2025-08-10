const apps = [
    {
        name: "Discord",
        icon: "🎮",
        supported: true,
        install: `# Debian/Ubuntu
sudo apt install discord

# Arch
sudo pacman -S discord

# Flatpak (tüm dağıtımlar için)
flatpak install flathub com.discordapp.Discord`
    },
    {
        name: "Adobe Photoshop",
        icon: "🎨",
        supported: false,
        alt: "GIMP",
        install: `# GIMP Kurulumu (Photoshop alternatifi)

# Debian/Ubuntu
sudo apt install gimp

# Arch
sudo pacman -S gimp

# Flatpak
flatpak install flathub org.gimp.GIMP`
    },
    {
        name: "Steam",
        icon: "🎯",
        supported: true,
        install: `# Debian/Ubuntu
sudo apt install steam

# Arch
sudo pacman -S steam

# Flatpak
flatpak install flathub com.valvesoftware.Steam`
    },
    {
        name: "Microsoft Office",
        icon: "📝",
        supported: false,
        alt: "LibreOffice",
        install: `# LibreOffice Kurulumu (Office alternatifi)

# Debian/Ubuntu
sudo apt install libreoffice

# Arch
sudo pacman -S libreoffice-fresh

# Flatpak
flatpak install flathub org.libreoffice.LibreOffice`
    },
    {
        name: "Visual Studio Code",
        icon: "💻",
        supported: true,
        install: `# VS Code Kurulumu

# Debian/Ubuntu (Microsoft deposu)
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update
sudo apt install code

# Arch (AUR)
yay -S visual-studio-code-bin

# Flatpak
flatpak install flathub com.visualstudio.code`
    },
    {
        name: "Spotify",
        icon: "🎵",
        supported: true,
        install: `# Spotify Kurulumu

# Debian/Ubuntu
curl -sS https://download.spotify.com/debian/pubkey_6224F9941A8AA6D1.gpg | sudo gpg --dearmor --yes -o /etc/apt/trusted.gpg.d/spotify.gpg
echo "deb http://repository.spotify.com stable non-free" | sudo tee /etc/apt/sources.list.d/spotify.list
sudo apt update
sudo apt install spotify-client

# Arch (AUR)
yay -S spotify

# Flatpak
flatpak install flathub com.spotify.Client`
    }
];
