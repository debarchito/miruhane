{ pkgs, ... }:

{
  dotenv.enable = true;
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_23;
    pnpm.enable = true;
  };
  packages = with pkgs; [
    typescript-language-server
    svelte-language-server
  ];
  enterShell = "pnpm db:up";
}
