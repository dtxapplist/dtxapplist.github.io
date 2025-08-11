const apps = [
    {
        name: "Discord",
        icon: "./icon/discord.svg", // ✅ Zaten doğru
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
        name: "Audacity",
        icon: "./icon/audacity.svg", // ✅ Zaten doğru
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install audacity",
            "Arch": "sudo pacman -S audacity",
            "Fedora": "sudo dnf install audacity",
            "Flatpak": "flatpak install flathub org.audacityteam.Audacity"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/7289da/ffffff?text=Discord",
            website: "https://www.audacityteam.org/"
        }
    },
    {
        name: "Adobe Photoshop",
        icon: "./icon/AdobePhotoshop.svg", // ✅ Zaten doğru
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
    {name: "Adobe Premiere Pro",
        icon: "./icon/Premiere.svg", // ✅ Zaten doğru
        supported: false,
        alt: "DaVinci Resolve",
        alternatives: [
            {
                name: "DaVinci Resolve",
                description: "Güçlü ve ücretsiz video düzenleyicisi. ",
                screenshot: "https://via.placeholder.com/400x250/5c616c/ffffff?text=GIMP",
                website: "https://www.blackmagicdesign.com/tr/products/davinciresolve"
            },
        ]
    },
{
        name: "Brave",
        icon: "./icon/brave.svg", // ✅ Zaten doğru
        supported: true,
        install: {
            "Genel kod": " curl -fsS https://dl.brave.com/install.sh | sh ",
            "Flatpak": "flatpak install flathub com.brave.Browser"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/7289da/ffffff?text=Discord",
            website: "https://brave.com/linux/"
        }
    },
    {
        name: "Steam",
        icon: "./icon/steam.svg", // ✅ Nokta eklendi
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install steam",
            "Arch": "sudo pacman -S steam",
            "Fedora": "sudo dnf install steam",
            "Flatpak": "flatpak install flathub com.valvesoftware.Steam"
        },
        about: {
            screenshot: "https://linuxiac.com/wp-content/uploads/2023/08/steam-on-linux.jpg",
            website: "https://store.steampowered.com"
        }
    },
    {
        name: "VLC",
        icon: "./icon/vlc.svg", // ✅ Nokta eklendi
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install vlc",
            "Arch": "sudo pacman -S vlc",
            "Fedora": "sudo dnf install vlc",
            "Flatpak": "flatpak install flathub org.videolan.VLC"
        },
        about: {
            screenshot: "https://pimylifeup.com/wp-content/uploads/2021/05/install-vlc-on-ubuntu-thumbnail.jpg",
            website: "https://www.videolan.org/"
        }
    },
    {
        name: "Microsoft Office",
        icon: "./icon/ms-office.svg", // ✅ Nokta eklendi
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
        icon: "./icon/vscode.svg", // ✅ Nokta eklendi
        supported: true,
        install: {
            "Debian/Ubuntu": `wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update && sudo apt install code`,
            "Arch": "yay -S visual-studio-code-bin",
            "Fedora": `sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[code]\\nname=Visual Studio Code\\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\\nenabled=1\\ngpgcheck=1\\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
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
        icon: "./icon/spotify-client.svg", // ✅ Nokta eklendi (NOT: spotify-client.svg değil spotify.svg olmalı)
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
