# 🚀 Guia Rápido de Deploy - Scheduler

## ⚡ Deploy em 15 Minutos (Local/Testing)

### 1. Preparar Ambiente Local

```bash
# 1. Copiar variáveis de ambiente
cp .env.production.example .env

# 2. Editar .env com suas credenciais
nano .env

# 3. Gerar JWT_SECRET
openssl rand -base64 64

# 4. Build e start
./scripts/deploy.sh production
```

---

## 🌐 Deploy em VPS (DigitalOcean/Linode)

### Pré-requisitos:
- VPS com Ubuntu 22.04 LTS
- Mínimo 2GB RAM, 1 CPU, 25GB disco
- Domínio configurado apontando para o IP do VPS

---

### Passo 1: Configurar VPS (10 minutos)

```bash
# 1. SSH no servidor
ssh root@seu-ip

# 2. Criar usuário
adduser scheduler
usermod -aG sudo scheduler
su - scheduler

# 3. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 4. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 5. Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# 6. Instalar Nginx
sudo apt install nginx -y

# 7. Instalar Certbot (SSL)
sudo apt install certbot python3-certbot-nginx -y

# 8. Configurar Firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 9. Reiniciar para aplicar docker group
sudo reboot
```

---

### Passo 2: Deploy da Aplicação (5 minutos)

```bash
# 1. SSH novamente
ssh scheduler@seu-ip

# 2. Instalar Git
sudo apt install git -y

# 3. Clonar repositório
git clone https://github.com/vitor-ramalho/scheduler.git
cd scheduler

# 4. Configurar variáveis
cp .env.production.example .env
nano .env

# Editar:
# - POSTGRES_PASSWORD (senha forte)
# - JWT_SECRET (openssl rand -base64 64)
# - API_URL=https://api.seudominio.com
# - CLIENT_URL=https://seudominio.com
# - MAIL_USER e MAIL_PASSWORD (Gmail App Password)

# 5. Deploy!
./scripts/deploy.sh production
```

---

### Passo 3: Configurar Nginx (5 minutos)

```bash
# 1. Copiar configuração
sudo cp nginx/nginx.conf /etc/nginx/sites-available/scheduler

# 2. Editar com seu domínio
sudo nano /etc/nginx/sites-available/scheduler
# Substituir "seudominio.com" pelo seu domínio real

# 3. Habilitar site
sudo ln -s /etc/nginx/sites-available/scheduler /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. Configurar SSL (Let's Encrypt)
sudo certbot --nginx -d seudominio.com -d www.seudominio.com -d api.seudominio.com

# 5. Verificar
curl https://api.seudominio.com/health
# Deve retornar: {"status":"ok"}
```

---

## ✅ Verificação

```bash
# 1. Verificar containers
docker ps

# Deve mostrar 3 containers rodando:
# - scheduler-db-prod
# - scheduler-api-prod  
# - scheduler-client-prod

# 2. Verificar logs
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f client

# 3. Testar endpoints
curl http://localhost:3000/health
# Resposta: {"status":"ok"}

curl http://localhost:3001
# Resposta: HTML da aplicação

# 4. Testar via domínio
curl https://api.seudominio.com/health
curl https://seudominio.com

# 5. Verificar SSL
curl -I https://seudominio.com | grep "HTTP"
# Deve retornar: HTTP/2 200
```

---

## 🔄 Comandos Úteis

### Ver Logs
```bash
# Todos os serviços
docker compose -f docker-compose.prod.yml logs -f

# Apenas API
docker compose -f docker-compose.prod.yml logs -f api

# Apenas Client
docker compose -f docker-compose.prod.yml logs -f client

# Últimas 100 linhas
docker compose -f docker-compose.prod.yml logs --tail=100
```

### Restart Serviços
```bash
# Restart tudo
docker compose -f docker-compose.prod.yml restart

# Restart apenas API
docker compose -f docker-compose.prod.yml restart api

# Restart apenas Client
docker compose -f docker-compose.prod.yml restart client
```

### Backup Manual
```bash
# Criar backup
mkdir -p backups
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U scheduler_prod scheduler_production > backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker compose -f docker-compose.prod.yml exec -T postgres psql -U scheduler_prod scheduler_production < backups/backup_20251119_150000.sql
```

### Atualizar Aplicação
```bash
# Pull latest code
git pull origin main

# Redeploy
./scripts/deploy.sh production
```

### Parar Aplicação
```bash
docker compose -f docker-compose.prod.yml down
```

### Limpar Tudo (⚠️ Cuidado!)
```bash
# Para e remove containers + volumes (deleta banco!)
docker compose -f docker-compose.prod.yml down -v

# Remove imagens antigas
docker image prune -a
```

---

## 🐛 Troubleshooting

### Problema: API não inicia
```bash
# Ver logs detalhados
docker compose -f docker-compose.prod.yml logs api

# Verificar variáveis de ambiente
docker compose -f docker-compose.prod.yml exec api env | grep DB

# Restart
docker compose -f docker-compose.prod.yml restart api
```

### Problema: Migrations falham
```bash
# Ver status das migrations
docker compose -f docker-compose.prod.yml exec api npm run migration:show

# Rodar migrations manualmente
docker compose -f docker-compose.prod.yml exec api npm run migration:run

# Reverter última migration
docker compose -f docker-compose.prod.yml exec api npm run migration:revert
```

### Problema: Email não envia
```bash
# Verificar variáveis
docker compose -f docker-compose.prod.yml exec api env | grep MAIL

# Testar conexão SMTP
docker compose -f docker-compose.prod.yml exec api npm run test:email

# Ver logs de email
docker compose -f docker-compose.prod.yml logs api | grep Email
```

### Problema: Porta já em uso
```bash
# Ver o que está usando a porta
sudo lsof -i :3000
sudo lsof -i :3001

# Matar processo
sudo kill -9 <PID>
```

### Problema: Sem espaço em disco
```bash
# Ver uso de disco
df -h

# Limpar logs antigos do Docker
docker system prune -a

# Limpar backups antigos (>7 dias)
find backups -name "backup_*.sql" -mtime +7 -delete
```

---

## 📊 Monitoramento

### Verificar Recursos
```bash
# CPU e Memória dos containers
docker stats

# Espaço em disco
df -h

# Logs do Nginx
sudo tail -f /var/log/nginx/scheduler-api-access.log
sudo tail -f /var/log/nginx/scheduler-api-error.log
```

### Health Checks
```bash
# API Health
curl http://localhost:3000/health

# Client Health  
curl http://localhost:3001

# Database Health
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U scheduler_prod
```

---

## 🔐 Segurança

### Checklist Pós-Deploy:
- [ ] SSL configurado e funcionando
- [ ] Firewall habilitado (apenas portas 22, 80, 443)
- [ ] Senha forte do PostgreSQL
- [ ] JWT_SECRET gerado aleatoriamente
- [ ] Usuário não-root nos containers
- [ ] Backups automáticos configurados
- [ ] Rate limiting no Nginx ativo
- [ ] Headers de segurança configurados

---

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs: `docker compose -f docker-compose.prod.yml logs`
2. Consultar DEPLOYMENT_PLAN.md para detalhes
3. Ver issues no GitHub

---

**Última atualização**: 19 de Novembro de 2025
