#!/bin/bash

echo "🚀 Deploy Script para nlsp"
echo "=========================="

# Verificar se é GitHub Pages ou domínio próprio
read -p "Deploy para (1) GitHub Pages ou (2) Domínio próprio? [1/2]: " choice

if [ "$choice" = "1" ]; then
    echo "📦 Configurando para GitHub Pages..."
    
    # Pedir informações do usuário
    read -p "Digite seu usuário do GitHub: " github_user
    read -p "Digite o nome do repositório: " repo_name
    
    # Atualizar configurações
    sed -i "s/SEU_USUARIO/$github_user/g" package.json
    sed -i "s/NOME_DO_REPOSITORIO/$repo_name/g" package.json
    sed -i "s/NOME_DO_REPOSITORIO/$repo_name/g" vite.config.ts
    
    echo "✅ Configurações atualizadas!"
    echo "🔧 Instalando dependências..."
    npm install
    
    echo "🚀 Fazendo deploy..."
    npm run deploy
    
    echo "✅ Deploy concluído!"
    echo "🌐 Seu site estará disponível em: https://$github_user.github.io/$repo_name"
    
elif [ "$choice" = "2" ]; then
    echo "🌐 Configurando para domínio próprio..."
    
    read -p "Digite seu domínio (ex: meusite.com): " domain
    
    # Configurar para domínio próprio
    sed -i 's|base: "/.*"|base: "/"|g' vite.config.ts
    echo "$domain" > public/CNAME
    
    echo "✅ Configurações atualizadas!"
    echo "🔧 Instalando dependências..."
    npm install
    
    echo "🚀 Fazendo deploy..."
    npm run deploy
    
    echo "✅ Deploy concluído!"
    echo "🌐 Configure seu DNS para apontar para GitHub Pages"
    echo "📋 Adicione um registro CNAME: $domain → SEU_USUARIO.github.io"
    
else
    echo "❌ Opção inválida!"
fi