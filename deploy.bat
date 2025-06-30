@echo off
echo 🚀 Deploy Script para nlsp
echo ==========================

set /p choice="Deploy para (1) GitHub Pages ou (2) Domínio próprio? [1/2]: "

if "%choice%"=="1" (
    echo 📦 Configurando para GitHub Pages...
    
    set /p github_user="Digite seu usuário do GitHub: "
    set /p repo_name="Digite o nome do repositório: "
    
    echo ✅ Configurações precisam ser atualizadas manualmente!
    echo 📝 Edite package.json e vite.config.ts com seus dados
    echo 🔧 Instalando dependências...
    npm install
    
    echo 🚀 Fazendo deploy...
    npm run deploy
    
    echo ✅ Deploy concluído!
    echo 🌐 Seu site estará disponível em: https://%github_user%.github.io/%repo_name%
    
) else if "%choice%"=="2" (
    echo 🌐 Configurando para domínio próprio...
    
    set /p domain="Digite seu domínio (ex: meusite.com): "
    
    echo %domain% > public\CNAME
    
    echo ✅ Arquivo CNAME criado!
    echo 📝 Edite vite.config.ts: altere base para "/"
    echo 🔧 Instalando dependências...
    npm install
    
    echo 🚀 Fazendo deploy...
    npm run deploy
    
    echo ✅ Deploy concluído!
    echo 🌐 Configure seu DNS para apontar para GitHub Pages
    echo 📋 Adicione um registro CNAME: %domain% → SEU_USUARIO.github.io
    
) else (
    echo ❌ Opção inválida!
)

pause