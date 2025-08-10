// apps.js - Uygulama Listesi
const apps = [
  {
    name: "Discord",
    supported: true,
    alternative: "",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/98/Discord_logo.svg",
    install: {
      ubuntu: "sudo snap install discord",
      arch: "sudo pacman -S discord",
      fedora: "sudo dnf install discord"
    }
  },
  {
    name: "Adobe Photoshop",
    supported: false,
    alternative: "GIMP",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
    install: {
      ubuntu: "sudo apt install gimp",
      arch: "sudo pacman -S gimp",
      fedora: "sudo dnf install gimp"
    }
  },
  {
    name: "Steam",
    supported: true,
    alternative: "",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    install: {
      ubuntu: "sudo apt install steam",
      arch: "sudo pacman -S steam",
      fedora: "sudo dnf install steam"
    }
  },
  {
    name: "Microsoft Office",
    supported: false,
    alternative: "LibreOffice",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Microsoft_Office_logo_%282013-2019%29.svg",
    install: {
      ubuntu: "sudo apt install libreoffice",
      arch: "sudo pacman -S libreoffice-fresh",
      fedora: "sudo dnf install libreoffice"
    }
  }
];
