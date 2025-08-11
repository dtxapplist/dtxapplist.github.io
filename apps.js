const apps = [
    {
        name: "Discord",
        icon: "🎮",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install discord",
            "Arch": "sudo pacman -S discord",
            "Fedora": "sudo dnf install discord",
            "Flatpak": "flatpak install flathub com.discordapp.Discord"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/7289da/ffffff?text=Discord",
            website: "https://discord.com"
        }
    },
    {
        name: "Adobe Photoshop",
        icon: "🎨",
        supported: false,
        alt: "GIMP",
        alternatives: [
            {
                name: "GIMP",
                description: "Güçlü açık kaynak görüntü düzenleme programı",
                screenshot: "https://via.placeholder.com/400x250/5c616c/ffffff?text=GIMP",
                website: "https://www.gimp.org"
            },
            {
                name: "Krita",
                description: "Dijital sanat ve çizim için özel tasarlanmış program",
                screenshot: "https://via.placeholder.com/400x250/3daee9/ffffff?text=Krita",
                website: "https://krita.org"
            }
        ]
    },
    {
        name: "Steam",
        icon: "🎯",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install steam",
            "Arch": "sudo pacman -S steam",
            "Fedora": "sudo dnf install steam",
            "Flatpak": "flatpak install flathub com.valvesoftware.Steam"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/171a21/ffffff?text=Steam",
            website: "https://store.steampowered.com"
        }
    },
    {
        name: "Microsoft Office",
        icon: "📝",
        supported: false,
        alt: "LibreOffice",
        alternatives: [
            {
                name: "LibreOffice",
                description: "Tam özellikli ofis paketi - Word, Excel, PowerPoint alternatifi",
                screenshot: "https://via.placeholder.com/400x250/18a303/ffffff?text=LibreOffice",
                website: "https://www.libreoffice.org"
            },
            {
                name: "OnlyOffice",
                description: "Microsoft Office ile %100 uyumlu ofis paketi",
                screenshot: "https://via.placeholder.com/400x250/ff6f3d/ffffff?text=OnlyOffice",
                website: "https://www.onlyoffice.com"
            }
        ]
    },
    {
        name: "Visual Studio Code",
        icon: "💻",
        supported: true,
        install: {
            "Debian/Ubuntu": `wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update && sudo apt install code`,
            "Arch": "yay -S visual-studio-code-bin",
            "Fedora": `sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
sudo dnf check-update && sudo dnf install code`,
            "Flatpak": "flatpak install flathub com.visualstudio.code"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/007acc/ffffff?text=VS+Code",
            website: "https://code.visualstudio.com"
        }
    },
    {
        name: "Spotify",
        icon: "🎵",
        supported: true,
        install: {
            "Debian/Ubuntu": `curl -sS https://download.spotify.com/debian/pubkey_6224F9941A8AA6D1.gpg | sudo gpg --dearmor --yes -o /etc/apt/trusted.gpg.d/spotify.gpg
echo "deb http://repository.spotify.com stable non-free" | sudo tee /etc/apt/sources.list.d/spotify.list
sudo apt update && sudo apt install spotify-client`,
            "Arch": "yay -S spotify",
            "Fedora": `sudo dnf config-manager --add-repo=https://negativo17.org/repos/fedora-spotify.repo
sudo dnf install spotify-client`,
            "Flatpak": "flatpak install flathub com.spotify.Client"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/1db954/ffffff?text=Spotify",
            website: "https://www.spotify.com"
        }
    }
];
