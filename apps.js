const apps = [
    {
        name: "Discord",
        icon: "./icon/discord.svg",
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
        name: "Telegram",
        icon: "./icon/telegram.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install telegram-desktop",
            "Arch": "sudo pacman -S telegram-desktop",
            "Fedora": "sudo dnf install telegram-desktop",
            "Flatpak": "flatpak install flathub org.telegram.desktop",
            "Snap": "sudo snap install telegram-desktop"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/0088cc/ffffff?text=Telegram",
            website: "https://telegram.org"
        }
    },
    {
        name: "WhatsApp",
        icon: "./icon/whatsapp-desktop.svg",
        supported: false,
        alt: "WhatsApp Web",
        alternatives: [
            {
                name: "WhatsApp Web (Tarayıcı)",
                description: "WhatsApp'ın resmi web versiyonu",
                screenshot: "https://via.placeholder.com/400x250/25d366/ffffff?text=WhatsApp+Web",
                website: "https://web.whatsapp.com"
            },
            {
                name: "Whatsie",
                description: "WhatsApp Web için Electron wrapper",
                screenshot: "https://via.placeholder.com/400x250/25d366/ffffff?text=Whatsie",
                website: "https://github.com/gsantner/whatsie"
            }
        ],
        about: {
            website: "https://www.whatsapp.com"
        }
    },
    {
        name: "1Password",
        icon: "./icon/1password.svg",
        supported: true,
        install: {
            "DEB/RPM": "https://1password.com/downloads/linux/",
            "Flatpak": "flatpak install flathub com.1password.OnePassword",
            "Snap": "sudo snap install 1password"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/0076e2/ffffff?text=1Password",
            website: "https://1password.com"
        }
    },
    {
        name: "Adobe AIR",
        icon: "./icon/adobe-air.svg",
        supported: false,
        unsupportedReason: "Adobe AIR resmi olarak Linux desteğini 2011'de sonlandırmıştır. Alternatif olarak web tabanlı uygulamalar veya Electron wrapper'ları kullanılabilir.",
        about: {
            website: "https://www.adobe.com/products/air.html"
        }
    },
    {
        name: "Chromium",
        icon: "./icon/chromium.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install chromium-browser",
            "Arch": "sudo pacman -S chromium",
            "Fedora": "sudo dnf install chromium",
            "Flatpak": "flatpak install flathub org.chromium.Chromium",
            "Snap": "sudo snap install chromium"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/4688f4/ffffff?text=Chromium",
            website: "https://www.chromium.org"
        }
    },
    {
        name: "Electron",
        icon: "./icon/electron.svg",
        supported: true,
        install: {
            "npm": "npm install -g electron",
            "Debian/Ubuntu": "sudo apt install electron",
            "Arch": "sudo pacman -S electron",
            "Fedora": "sudo dnf install electron"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/494c60/ffffff?text=Electron",
            website: "https://www.electronjs.org"
        }
    },
    {
        name: "GitHub Desktop",
        icon: "./icon/github-desktop.svg",
        supported: true,
        install: {
            "DEB/RPM": "https://github.com/shiftkey/desktop/releases",
            "Flatpak": "flatpak install flathub io.github.shiftey.Desktop",
            "AppImage": "https://github.com/shiftkey/desktop/releases"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/8034a9/ffffff?text=GitHub+Desktop",
            website: "https://desktop.github.com"
        }
    },
    {
        name: "Heroic Games Launcher",
        icon: "./icon/heroic.svg",
        supported: true,
        install: {
            "AppImage": "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases",
            "Flatpak": "flatpak install flathub com.heroicgameslauncher.hgl",
            "DEB/RPM": "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/50beee/ffffff?text=Heroic",
            website: "https://heroicgameslauncher.com"
        }
    },
    {
        name: "LibreWolf",
        icon: "./icon/io.gitlab.LibreWolf.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "https://librewolf.net/installation/debian/",
            "Arch": "yay -S librewolf-bin",
            "Fedora": "https://librewolf.net/installation/fedora/",
            "Flatpak": "flatpak install flathub io.gitlab.LibreWolf",
            "AppImage": "https://gitlab.com/librewolf-community/browser/appimage/-/releases"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/31aae4/ffffff?text=LibreWolf",
            website: "https://librewolf.net"
        }
    },
    {
        name: "KeePass",
        icon: "./icon/keepass.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install keepass2",
            "Arch": "sudo pacman -S keepass",
            "Fedora": "sudo dnf install keepass",
            "Flatpak": "flatpak install flathub org.keepassxc.KeePassXC"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/587de6/ffffff?text=KeePass",
            website: "https://keepass.info"
        }
    },
    {
        name: "Opera",
        icon: "./icon/opera.svg",
        supported: true,
        install: {
            "DEB/RPM": "https://www.opera.com/download",
            "Flatpak": "flatpak install flathub com.opera.Opera",
            "Snap": "sudo snap install opera"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/c0191f/ffffff?text=Opera",
            website: "https://www.opera.com"
        }
    },
    {
        name: "Proton VPN",
        icon: "./icon/proton-vpn-logo.svg",
        supported: true,
        install: {
            "DEB/RPM": "https://protonvpn.com/download-linux",
            "Flatpak": "flatpak install flathub com.protonvpn.www"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/3974ff/ffffff?text=Proton+VPN",
            website: "https://protonvpn.com"
        }
    },
    {
        name: "Thunderbird",
        icon: "./icon/thunderbird.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install thunderbird",
            "Arch": "sudo pacman -S thunderbird",
            "Fedora": "sudo dnf install thunderbird",
            "Flatpak": "flatpak install flathub org.mozilla.Thunderbird",
            "Snap": "sudo snap install thunderbird"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/248afd/ffffff?text=Thunderbird",
            website: "https://www.thunderbird.net"
        }
    },
    {
        name: "TIDAL Hi-Fi",
        icon: "./icon/tidal-hifi.svg",
        supported: true,
        install: {
            "AppImage": "https://github.com/Mastermindzh/tidal-hifi/releases",
            "DEB/RPM": "https://github.com/Mastermindzh/tidal-hifi/releases",
            "AUR": "yay -S tidal-hifi"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/3f3f3f/ffffff?text=TIDAL+Hi-Fi",
            website: "https://github.com/Mastermindzh/tidal-hifi"
        }
    },
    {
        name: "UBinary",
        icon: "./icon/ubinary.svg",
        supported: true,
        install: {
            "AppImage": "https://github.com/mtxr/ubinary/releases",
            "DEB": "https://github.com/mtxr/ubinary/releases"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/243a85/ffffff?text=UBinary",
            website: "https://github.com/mtxr/ubinary"
        }
    },
    {
        name: "Zen Browser",
        icon: "./icon/zen-browser.svg",
        supported: true,
        install: {
            "AppImage": "https://github.com/zen-browser/desktop/releases",
            "Flatpak": "flatpak install flathub io.github.zen_browser.zen",
            "AUR": "yay -S zen-browser-bin"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/f76f53/ffffff?text=Zen+Browser",
            website: "https://zen-browser.app"
        }
    },
    {
        name: "OnlyOffice",
        icon: "./icon/onlyoffice-desktopeditors.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": `wget -qO - https://download.onlyoffice.com/GPG-KEY-ONLYOFFICE | sudo apt-key add -
echo "deb https://download.onlyoffice.com/repo/debian squeeze main" | sudo tee /etc/apt/sources.list.d/onlyoffice.list
sudo apt update && sudo apt install onlyoffice-desktopeditors`,
            "Arch": "yay -S onlyoffice-bin",
            "Fedora": `sudo yum install https://download.onlyoffice.com/repo/centos/main/noarch/onlyoffice-repo.noarch.rpm
sudo yum install onlyoffice-desktopeditors`,
            "Flatpak": "flatpak install flathub org.onlyoffice.desktopeditors",
            "Snap": "sudo snap install onlyoffice-desktopeditors",
            "AppImage": "https://www.onlyoffice.com/tr/download-desktop.aspx"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/ff6f3d/ffffff?text=OnlyOffice",
            website: "https://www.onlyoffice.com"
        }
    },
    {
        name: "Audacity",
        icon: "./icon/audacity.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install audacity",
            "Arch": "sudo pacman -S audacity",
            "Fedora": "sudo dnf install audacity",
            "Flatpak": "flatpak install flathub org.audacityteam.Audacity"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/7289da/ffffff?text=Audacity",
            website: "https://www.audacityteam.org/"
        }
    },
{
    name: "Adobe Photoshop",
    icon: "./icon/AdobePhotoshop.svg",
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
    ],
    about: {
        website: "https://www.adobe.com/products/photoshop.html"
    }
},
{
    name: "Adobe Premiere Pro",
    icon: "./icon/Premiere.svg",
    supported: false,
    alt: "DaVinci Resolve",
    alternatives: [
        {
            name: "DaVinci Resolve",
            description: "Güçlü ve ücretsiz video düzenleyicisi",
            screenshot: "https://via.placeholder.com/400x250/5c616c/ffffff?text=DaVinci+Resolve",
            website: "https://www.blackmagicdesign.com/tr/products/davinciresolve"
        }
    ],
    about: {
        website: "https://www.adobe.com/products/premiere.html"
    }
},
    {
        name: "Microsoft Edge",
        icon: "./icon/edge.svg",
        supported: true,
        install: {
            "DEB/RPM": "https://www.microsoft.com/en-us/edge/business/download?form=MA13FJ",
            "Arch": "yay -S microsoft-edge-stable-bin",
            "Flatpak": "flatpak install flathub com.microsoft.Edge"
        },
        about: {
            screenshot: "./ss/ms-edge.png",
            website: "https://www.microsoft.com/edge"
        }
    },
    {
        name: "Brave",
        icon: "./icon/brave.svg",
        supported: true,
        install: {
            "Genel kod": "curl -fsS https://dl.brave.com/install.sh | sh",
            "Flatpak": "flatpak install flathub com.brave.Browser"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/fb542b/ffffff?text=Brave",
            website: "https://brave.com/linux/"
        }
    },
    {
        name: "Steam",
        icon: "./icon/steam.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install steam",
            "Arch": "sudo pacman -S steam",
            "Fedora": "sudo dnf install steam",
            "Flatpak": "flatpak install flathub com.valvesoftware.Steam"
        },
        about: {
            screenshot: "./ss/steam.png",
            website: "https://store.steampowered.com"
        }
    },
    {
        name: "VLC",
        icon: "./icon/vlc.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install vlc",
            "Arch": "sudo pacman -S vlc",
            "Fedora": "sudo dnf install vlc",
            "Flatpak": "flatpak install flathub org.videolan.VLC"
        },
        about: {
            screenshot: "./ss/vlc.png",
            website: "https://www.videolan.org/"
        }
    },
{
    name: "Microsoft Office",
    icon: "./icon/ms-office.svg",
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
    ],
    about: {
        website: "https://www.microsoft.com/microsoft-365"
    }
},
    {
        name: "Visual Studio Code",
        icon: "./icon/vscode.svg",
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
        icon: "./icon/spotify-client.svg",
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
    },
    {
        name: "Adobe Illustrator",
        icon: "./icon/AdobeIllustrator.svg",
        supported: false,
        unsupportedReason: "Adobe Illustrator resmi olarak Linux için geliştirilmemektedir. Adobe şirketi sadece Windows ve macOS platformlarını desteklemektedir. Wine ile çalıştırılabilir ancak kararlı performans garanti edilemez.",
        about: {
            website: "https://www.adobe.com/products/illustrator.html"
        }
    },
    {
        name: "Riot Games",
        icon: "./icon/riot.svg",
        supported: false,
        unsupportedReason:"Vanguard, Windows'ta çekirdek (kernel) seviyesinde çalışmakta. Linux'ta çalışamadığı için Riot'un Vanguard kullanan oyunları oynanamamakta.",
        about: {
            website: "https://www.riotgames.com/tr"
        }
    },
    {
        name: "Figma Desktop",
        icon: "./icon/figma.svg",
        supported: false,
        unsupportedReason: "Figma Desktop uygulaması Linux için resmi olarak sunulmamaktadır. Ancak Figma web tarayıcısından tam özellikli olarak kullanılabilir. Alternatif olarak electron-based wrapper'lar kullanılabilir.",
        about: {
            website: "https://www.figma.com"
        }
    },
    {
        name: "Adobe Dreamweaver",
        icon: "./icon/AdobeDreamweaver.svg",
        supported: false,
        alt: "Visual Studio Code",
        alternatives: [
            {
                name: "Visual Studio Code",
                description: "Güçlü kod editörü - web geliştirme için eklentilerle desteklenir",
                screenshot: "https://via.placeholder.com/400x250/007acc/ffffff?text=VS+Code",
                website: "https://code.visualstudio.com"
            },
            {
                name: "Brackets",
                description: "Web tasarımcıları için özel tasarlanmış editör",
                screenshot: "https://via.placeholder.com/400x250/5c616c/ffffff?text=Brackets",
                website: "http://brackets.io"
            }
        ],
        about: {
            website: "https://www.adobe.com/products/dreamweaver.html"
        }
    },
    {
        name: "Adobe Edge Animate",
        icon: "./icon/AdobeEdgeAnimate.svg",
        supported: false,
        unsupportedReason: "Adobe Edge Animate artık geliştirilmiyor ve Linux desteği hiç sunulmadı. Alternatif olarak web tabanlı animasyon araçları kullanılabilir.",
        about: {
            website: "https://www.adobe.com/"
        }
    },
    {
        name: "Adobe Lightroom",
        icon: "./icon/AdobeLightroom.svg",
        supported: false,
        alt: "RawTherapee",
        alternatives: [
            {
                name: "RawTherapee",
                description: "Güçlü RAW fotoğraf işleme programı",
                screenshot: "https://via.placeholder.com/400x250/5c616c/ffffff?text=RawTherapee",
                website: "https://rawtherapee.com"
            },
            {
                name: "darktable",
                description: "Profesyonel fotoğraf düzenleme ve RAW geliştirme",
                screenshot: "https://via.placeholder.com/400x250/3daee9/ffffff?text=darktable",
                website: "https://www.darktable.org"
            }
        ],
        about: {
            website: "https://www.adobe.com/products/photoshop-lightroom.html"
        }
    },
    {
        name: "Zoom",
        icon: "./icon/Zoom.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "wget https://zoom.us/client/latest/zoom_amd64.deb && sudo dpkg -i zoom_amd64.deb",
            "Arch": "yay -S zoom",
            "Fedora": "wget https://zoom.us/client/latest/zoom_x86_64.rpm && sudo dnf install zoom_x86_64.rpm",
            "Flatpak": "flatpak install flathub us.zoom.Zoom"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/4992fd/ffffff?text=Zoom",
            website: "https://zoom.us"
        }
    },
    {
        name: "AnyDesk",
        icon: "./icon/anydesk.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": `wget -qO - https://keys.anydesk.com/repos/DEB-GPG-KEY | apt-key add -
echo "deb http://deb.anydesk.com/ all main" | sudo tee /etc/apt/sources.list.d/anydesk-stable.list
sudo apt update && sudo apt install anydesk`,
            "Arch": "yay -S anydesk-bin",
            "Fedora": `sudo rpm --import https://keys.anydesk.com/repos/RPM-GPG-KEY
echo -e "[anydesk]\\nname=AnyDesk\\nbaseurl=http://rpm.anydesk.com/rhel/\\$basearch/\\nenabled=1\\ngpgcheck=1\\ngpgkey=https://keys.anydesk.com/repos/RPM-GPG-KEY" | sudo tee /etc/yum.repos.d/AnyDesk.repo
sudo dnf install anydesk`,
            "Flatpak": "flatpak install flathub com.anydesk.Anydesk"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/8e8e8e/ffffff?text=AnyDesk",
            website: "https://anydesk.com"
        }
    },
    {
        name: "AutoCAD",
        icon: "./icon/autocad.svg",
        supported: false,
        alt: "FreeCAD",
        alternatives: [
            {
                name: "FreeCAD",
                description: "Açık kaynak 3D CAD modelleme programı",
                screenshot: "https://via.placeholder.com/400x250/5c616c/ffffff?text=FreeCAD",
                website: "https://www.freecadweb.org"
            },
            {
                name: "LibreCAD",
                description: "2D CAD çizim programı",
                screenshot: "https://via.placeholder.com/400x250/3daee9/ffffff?text=LibreCAD",
                website: "https://librecad.org"
            }
        ],
        about: {
            website: "https://www.autodesk.com/products/autocad"
        }
    },
    {
        name: "Bitwarden",
        icon: "./icon/bitwarden.svg",
        supported: true,
        install: {
            "AppImage": "https://vault.bitwarden.com/download/?app=desktop&platform=linux",
            "Flatpak": "flatpak install flathub com.bitwarden.desktop",
            "Snap": "sudo snap install bitwarden"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/175ddc/ffffff?text=Bitwarden",
            website: "https://bitwarden.com"
        }
    },
    {
        name: "Blender",
        icon: "./icon/blender.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install blender",
            "Arch": "sudo pacman -S blender",
            "Fedora": "sudo dnf install blender",
            "Flatpak": "flatpak install flathub org.blender.Blender",
            "Snap": "sudo snap install blender --classic"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/f4b43f/ffffff?text=Blender",
            website: "https://www.blender.org"
        }
    },
    {
        name: "Google Chrome",
        icon: "./icon/chrome.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": `wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update && sudo apt install google-chrome-stable`,
            "Arch": "yay -S google-chrome",
            "Fedora": `sudo dnf config-manager --add-repo https://dl.google.com/linux/chrome/rpm/stable/x86_64
sudo dnf install google-chrome-stable`,
            "Flatpak": "flatpak install flathub com.google.Chrome"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/4285f4/ffffff?text=Chrome",
            website: "https://www.google.com/chrome"
        }
    },
    {
        name: "CLion",
        icon: "./icon/clion.svg",
        supported: true,
        install: {
            "Toolbox": "JetBrains Toolbox üzerinden",
            "Snap": "sudo snap install clion --classic",
            "Flatpak": "flatpak install flathub com.jetbrains.CLion",
            "Tarball": "https://www.jetbrains.com/clion/download/#section=linux"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/21d789/ffffff?text=CLion",
            website: "https://www.jetbrains.com/clion"
        }
    },
    {
        name: "Epic Games Launcher",
        icon: "./icon/epic-games.svg",
        supported: false,
        alt: "Heroic Games Launcher",
        alternatives: [
            {
                name: "Heroic Games Launcher",
                description: "Epic Games Store için açık kaynak alternatif launcher",
                screenshot: "https://via.placeholder.com/400x250/4f4f4f/ffffff?text=Heroic",
                website: "https://heroicgameslauncher.com"
            },
            {
                name: "Legendary",
                description: "Epic Games Store için komut satırı aracı",
                screenshot: "https://via.placeholder.com/400x250/5c616c/ffffff?text=Legendary",
                website: "https://github.com/derrod/legendary"
            }
        ],
        about: {
            website: "https://www.epicgames.com"
        }
    },
    {
        name: "IntelliJ IDEA",
        icon: "./icon/intellij.svg",
        supported: true,
        install: {
            "Toolbox": "JetBrains Toolbox üzerinden",
            "Snap": "sudo snap install intellij-idea-community --classic",
            "Flatpak": "flatpak install flathub com.jetbrains.IntelliJ-IDEA-Community",
            "Tarball": "https://www.jetbrains.com/idea/download/#section=linux"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/fe4b71/ffffff?text=IntelliJ",
            website: "https://www.jetbrains.com/idea"
        }
    },
    {
        name: "Obsidian",
        icon: "./icon/obsidian.svg",
        supported: true,
        install: {
            "AppImage": "https://obsidian.md/download",
            "Flatpak": "flatpak install flathub md.obsidian.Obsidian",
            "Snap": "sudo snap install obsidian --classic"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/b091f0/ffffff?text=Obsidian",
            website: "https://obsidian.md"
        }
    },
    {
        name: "PeaZip",
        icon: "./icon/peazip.svg",
        supported: true,
        install: {
            "DEB/RPM": "https://peazip.github.io/peazip-linux.html",
            "Flatpak": "flatpak install flathub io.github.peazip.PeaZip"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/7de63e/ffffff?text=PeaZip",
            website: "https://peazip.github.io"
        }
    },
    {
        name: "PyCharm",
        icon: "./icon/pycharm.svg",
        supported: true,
        install: {
            "Toolbox": "JetBrains Toolbox üzerinden",
            "Snap": "sudo snap install pycharm-community --classic",
            "Flatpak": "flatpak install flathub com.jetbrains.PyCharm-Community",
            "Tarball": "https://www.jetbrains.com/pycharm/download/#section=linux"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/a2e36e/ffffff?text=PyCharm",
            website: "https://www.jetbrains.com/pycharm"
        }
    },
    {
        name: "RemNote",
        icon: "./icon/remnote.svg",
        supported: true,
        install: {
            "AppImage": "https://www.remnote.com/download",
            "DEB": "https://www.remnote.com/download"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/e4e4e4/ffffff?text=RemNote",
            website: "https://www.remnote.com"
        }
    },
    {
        name: "Revolt",
        icon: "./icon/revolt-desktop.svg",
        supported: true,
        install: {
            "AppImage": "https://github.com/revoltchat/desktop/releases",
            "Flatpak": "flatpak install flathub chat.revolt.RevoltDesktop"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/ff4654/ffffff?text=Revolt",
            website: "https://revolt.chat"
        }
    },
    {
        name: "Rider",
        icon: "./icon/rider.svg",
        supported: true,
        install: {
            "Toolbox": "JetBrains Toolbox üzerinden",
            "Snap": "sudo snap install rider --classic",
            "Flatpak": "flatpak install flathub com.jetbrains.Rider",
            "Tarball": "https://www.jetbrains.com/rider/download/#section=linux"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/c72566/ffffff?text=Rider",
            website: "https://www.jetbrains.com/rider"
        }
    },
    {
        name: "RustDesk",
        icon: "./icon/rustdesk.svg",
        supported: true,
        install: {
            "AppImage": "https://github.com/rustdesk/rustdesk/releases",
            "DEB/RPM": "https://github.com/rustdesk/rustdesk/releases",
            "Flatpak": "flatpak install flathub com.rustdesk.RustDesk"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/0071ff/ffffff?text=RustDesk",
            website: "https://rustdesk.com"
        }
    },
    {
        name: "Scratch",
        icon: "./icon/scratch.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install scratch",
            "Arch": "sudo pacman -S scratch",
            "Fedora": "sudo dnf install scratch",
            "Flatpak": "flatpak install flathub edu.mit.Scratch"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/ff7f00/ffffff?text=Scratch",
            website: "https://scratch.mit.edu"
        }
    },
    {
        name: "Sublime Text",
        icon: "./icon/sublime-text.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": `wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | sudo apt-key add -
echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list
sudo apt update && sudo apt install sublime-text`,
            "Arch": "yay -S sublime-text-4",
            "Fedora": `sudo rpm -v --import https://download.sublimetext.com/sublimehq-rpm-pub.gpg
sudo dnf config-manager --add-repo https://download.sublimetext.com/rpm/stable/x86_64/sublime-text.repo
sudo dnf install sublime-text`,
            "Flatpak": "flatpak install flathub com.sublimetext.four"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/ffab36/ffffff?text=Sublime+Text",
            website: "https://www.sublimetext.com"
        }
    },
    {
        name: "Syncthing",
        icon: "./icon/syncthing.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": "sudo apt install syncthing",
            "Arch": "sudo pacman -S syncthing",
            "Fedora": "sudo dnf install syncthing",
            "Flatpak": "flatpak install flathub me.kozec.syncthingtk"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/1ca4d4/ffffff?text=Syncthing",
            website: "https://syncthing.net"
        }
    },
    {
        name: "TeamSpeak",
        icon: "./icon/teamspeak.svg",
        supported: true,
        install: {
            "Official": "https://www.teamspeak.com/en/downloads/#client",
            "Flatpak": "flatpak install flathub com.teamspeak.TeamSpeak"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/334468/ffffff?text=TeamSpeak",
            website: "https://www.teamspeak.com"
        }
    },
    {
        name: "TeamViewer",
        icon: "./icon/teamviewer.svg",
        supported: true,
        install: {
            "DEB/RPM": "https://www.teamviewer.com/tr/download/linux/",
            "Flatpak": "flatpak install flathub com.teamviewer.TeamViewer"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/4e7ad9/ffffff?text=TeamViewer",
            website: "https://www.teamviewer.com"
        }
    },
    {
        name: "Tor Browser",
        icon: "./icon/tor.svg",
        supported: true,
        install: {
            "Official": "https://www.torproject.org/download/",
            "Flatpak": "flatpak install flathub com.github.micahflee.torbrowser-launcher"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/7a1ea9/ffffff?text=Tor+Browser",
            website: "https://www.torproject.org"
        }
    },
    {
        name: "Unity Hub",
        icon: "./icon/unityhub.svg",
        supported: true,
        install: {
            "Official": "https://unity3d.com/get-unity/download",
            "AppImage": "https://unity3d.com/get-unity/download"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/e4e4e4/ffffff?text=Unity+Hub",
            website: "https://unity.com"
        }
    },
    {
        name: "VirtualBox",
        icon: "./icon/virtualbox.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": `wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo apt-key add -
echo "deb [arch=amd64] http://download.virtualbox.org/virtualbox/debian $(lsb_release -cs) contrib" | sudo tee /etc/apt/sources.list.d/virtualbox.list
sudo apt update && sudo apt install virtualbox-7.0`,
            "Arch": "sudo pacman -S virtualbox",
            "Fedora": "sudo dnf install VirtualBox",
            "Flatpak": "flatpak install flathub org.virtualbox.VirtualBox"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/1159d4/ffffff?text=VirtualBox",
            website: "https://www.virtualbox.org"
        }
    },
    {
        name: "Vivaldi",
        icon: "./icon/vivaldi.svg",
        supported: true,
        install: {
            "Debian/Ubuntu": `wget -qO- https://repo.vivaldi.com/archive/linux_signing_key.pub | sudo apt-key add -
echo "deb https://repo.vivaldi.com/archive/deb/ stable main" | sudo tee /etc/apt/sources.list.d/vivaldi-archive.list
sudo apt update && sudo apt install vivaldi-stable`,
            "Arch": "yay -S vivaldi",
            "Fedora": `sudo dnf config-manager --add-repo https://repo.vivaldi.com/archive/vivaldi-fedora.repo
sudo dnf install vivaldi-stable`,
            "Flatpak": "flatpak install flathub com.vivaldi.Vivaldi"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/ef3939/ffffff?text=Vivaldi",
            website: "https://vivaldi.com"
        }
    },
    {
        name: "VMware Workstation",
        icon: "./icon/vmware.svg",
        supported: true,
        install: {
            "Official": "https://www.vmware.com/products/workstation-pro/workstation-pro-evaluation.html"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/407ec2/ffffff?text=VMware",
            website: "https://www.vmware.com"
        }
    },
    {
        name: "WebStorm",
        icon: "./icon/webstorm.svg",
        supported: true,
        install: {
            "Toolbox": "JetBrains Toolbox üzerinden",
            "Snap": "sudo snap install webstorm --classic",
            "Flatpak": "flatpak install flathub com.jetbrains.WebStorm",
            "Tarball": "https://www.jetbrains.com/webstorm/download/#section=linux"
        },
        about: {
            screenshot: "https://via.placeholder.com/400x250/14ddb1/ffffff?text=WebStorm",
            website: "https://www.jetbrains.com/webstorm"
        }
    },
    {
        name: "WinRAR",
        icon: "./icon/winrar.svg",
        supported: false,
        alt: "Archive Manager",
        alternatives: [
            {
                name: "Archive Manager (File Roller)",
                description: "GNOME varsayılan arşiv yöneticisi",
                screenshot: "https://via.placeholder.com/400x250/5c616c/ffffff?text=Archive+Manager",
                website: "https://wiki.gnome.org/Apps/FileRoller"
            },
            {
                name: "7-Zip",
                description: "Güçlü arşiv yöneticisi (p7zip paketi)",
                screenshot: "https://via.placeholder.com/400x250/3daee9/ffffff?text=7-Zip",
                website: "https://www.7-zip.org"
            },
            {
                name: "PeaZip",
                description: "Çoklu platform arşiv yöneticisi",
                screenshot: "https://via.placeholder.com/400x250/7de63e/ffffff?text=PeaZip",
                website: "https://peazip.github.io"
            }
        ],
        about: {
            website: "https://www.win-rar.com"
        }
    }
];
