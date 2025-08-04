{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.nodePackages.typescript
    pkgs.nodePackages.typescript-language-server
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.prettier
    pkgs.android-studio
    pkgs.jdk11
  ];
  
  env = {
    ANDROID_HOME = "${pkgs.android-studio}/android-sdk";
    JAVA_HOME = "${pkgs.jdk11}";
    PATH = "${pkgs.nodejs-18_x}/bin:${pkgs.nodePackages.npm}/bin:$PATH";
  };
}