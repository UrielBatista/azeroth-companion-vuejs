# Etapa de build: usa Node.js para construir a aplicação Vue.js
FROM node:14-alpine as build-stage

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências para instalar os pacotes
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código do projeto para o contêiner
COPY . .

# Constrói a aplicação Vue.js para produção (gera os arquivos otimizados em /dist)
RUN npm run build

# Etapa de produção: usa Nginx para servir os arquivos estáticos
FROM nginx:1.19.0-alpine as production-stage

# Copia os arquivos gerados na etapa de build para o diretório do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expõe a porta 80 para acesso externo
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]