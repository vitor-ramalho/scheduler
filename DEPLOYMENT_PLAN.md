# 🚀 Plano de Deploy - Scheduler MVP

## 📋 Sumário Executivo

Este documento contém o plano completo de deploy da aplicação Scheduler, incluindo correções nos Dockerfiles, configuração de ambiente, e opções de hospedagem.

---

## 🔍 Análise dos Dockerfiles

### ✅ Status Atual

#### Client (Frontend - Next.js)
- **Status**: ✅ **BOM** - Dockerfile multi-stage funcional
- **Build**: Otimizado com cache de dependências
- **Tamanho**: Reduzido com Alpine Linux
- **Segurança**: ⚠️ Precisa melhorar (rodando como root)

#### API (Backend - NestJS)
- **Status**: ⚠️ **PRECISA CORREÇÃO**
- **Problema 1**: Dockerfile básico não está otimizado
- **Problema 2**: Dockerfile.prod está usando Node 18 (deveria ser 20)
- **Problema 3**: Falta instalação do curl para healthcheck
- **Problema 4**: Não está configurado para rodar migrations automaticamente

#### Docker Compose
- **Status**: ⚠️ **PRECISA ATUALIZAÇÃO**
- **Problema 1**: Falta configuração de email (MAIL_*)
- **Problema 2**: Falta configuração de migrations
- **Problema 3**: Variáveis de ambiente não estão mapeadas corretamente

---

## 🛠️ Correções Necessárias

### 1. API Dockerfile.prod

**Problemas identificados:**
- ✅ Node 18 → Atualizar para Node 20
- ✅ Falta curl para healthcheck
- ✅ Não roda migrations automaticamente
- ✅ Não copia arquivos de migration

### 2. Docker Compose Principal

**Problemas identificados:**
- ✅ Falta variáveis de ambiente de email
- ✅ Falta configuração de migrations
- ✅ Falta volumes para uploads (futuro)
- ✅ API_URL e CLIENT_URL hardcoded

### 3. Client Dockerfile

**Melhorias necessárias:**
- ✅ Adicionar usuário não-root
- ✅ Adicionar healthcheck
- ✅ Melhorar variáveis de ambiente

---

## 📦 Arquivos de Deploy

### Estrutura de Arquivos Necessários

```
scheduler/
├── docker-compose.yml           # ✅ Existe - precisa atualização
├── docker-compose.prod.yml      # ❌ Criar - para produção
├── .env.example                 # ❌ Criar - template de variáveis
├── .env.production              # ❌ Criar - variáveis de produção
├── nginx/
│   └── nginx.conf              # ❌ Criar - reverse proxy
├── scripts/
│   ├── deploy.sh               # ❌ Criar - script de deploy
│   └── backup.sh               # ✅ Existe em api/scripts
└── docs/
    └── DEPLOYMENT_GUIDE.md     # ❌ Criar - guia detalhado
```

---

## 🎯 Plano de Deploy - 3 Opções

### Opção 1: VPS Simples (Recomendado para MVP)
**Custo**: ~$5-10/mês  
**Complexidade**: ⭐⭐☆☆☆  
**Tempo**: 1-2 horas

#### Provedores Recomendados:
- **DigitalOcean** (Droplet $6/mês)
- **Linode** ($5/mês)
- **Vultr** ($6/mês)
- **Hetzner** (€4.5/mês - mais barato)

#### Stack:
```
Internet → Nginx (80/443) → Docker Compose
                             ├── API (3000)
                             ├── Client (3001)
                             └── PostgreSQL (5432)
```

#### Passos:
1. ✅ Corrigir Dockerfiles
2. ✅ Criar docker-compose.prod.yml
3. ✅ Configurar variáveis de ambiente
4. ✅ Provisionar VPS
5. ✅ Instalar Docker + Docker Compose
6. ✅ Configurar Nginx reverse proxy
7. ✅ Configurar SSL com Let's Encrypt
8. ✅ Deploy e teste

---

### Opção 2: Railway / Render (Mais Rápido)
**Custo**: $0-20/mês (Railway free tier)  
**Complexidade**: ⭐☆☆☆☆  
**Tempo**: 30 minutos

#### Vantagens:
- ✅ Deploy automático via Git
- ✅ SSL gratuito
- ✅ Banco PostgreSQL incluído
- ✅ CI/CD integrado
- ✅ Logs e monitoring

#### Desvantagens:
- ⚠️ Free tier com limitações
- ⚠️ Menos controle
- ⚠️ Pode dormir após inatividade (free tier)

#### Passos:
1. Criar conta no Railway/Render
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy automático

---

### Opção 3: AWS / GCP (Produção Escalável)
**Custo**: $30-100/mês  
**Complexidade**: ⭐⭐⭐⭐⭐  
**Tempo**: 4-8 horas

#### Stack AWS:
```
Route 53 → CloudFront → ALB → ECS (Fargate)
                                ├── API
                                ├── Client
                                └── RDS PostgreSQL
```

#### Não recomendado para MVP por:
- ❌ Complexidade alta
- ❌ Custo inicial mais alto
- ❌ Over-engineering para MVP

---

## 🔧 Implementação - Opção 1 (VPS)

### Fase 1: Preparação Local (30min)

#### 1.1 Corrigir Dockerfiles ✅
- Atualizar API Dockerfile.prod
- Melhorar Client Dockerfile
- Atualizar docker-compose.yml

#### 1.2 Criar Arquivos de Configuração ✅
- docker-compose.prod.yml
- nginx.conf
- .env.production.example

#### 1.3 Testar Localmente
```bash
# Build e teste local
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up
```

---

### Fase 2: Provisionar VPS (15min)

#### 2.1 Criar Droplet/VPS
**Specs mínimas:**
- RAM: 2GB (4GB recomendado)
- CPU: 1 vCore (2 recomendado)
- Disco: 25GB SSD
- OS: Ubuntu 22.04 LTS

#### 2.2 Configuração Inicial
```bash
# SSH no servidor
ssh root@seu-ip

# Update sistema
apt update && apt upgrade -y

# Criar usuário
adduser scheduler
usermod -aG sudo scheduler
su - scheduler
```

---

### Fase 3: Instalar Dependências (20min)

#### 3.1 Docker & Docker Compose
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y
```

#### 3.2 Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

#### 3.3 Certbot (SSL)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

---

### Fase 4: Deploy Aplicação (30min)

#### 4.1 Clonar Repositório
```bash
# Instalar Git
sudo apt install git -y

# Clonar repo
cd /home/scheduler
git clone https://github.com/vitor-ramalho/scheduler.git
cd scheduler
```

#### 4.2 Configurar Variáveis de Ambiente
```bash
# Criar .env de produção
cp .env.production.example .env

# Editar com credenciais reais
nano .env
```

#### 4.3 Build e Deploy
```bash
# Build imagens
docker compose -f docker-compose.prod.yml build

# Rodar migrations
docker compose -f docker-compose.prod.yml run --rm api npm run migration:run

# Subir aplicação
docker compose -f docker-compose.prod.yml up -d
```

---

### Fase 5: Configurar Nginx (20min)

#### 5.1 Configurar Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/scheduler
```

#### 5.2 Habilitar Site
```bash
sudo ln -s /etc/nginx/sites-available/scheduler /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5.3 Configurar SSL
```bash
sudo certbot --nginx -d seudominio.com -d api.seudominio.com
```

---

### Fase 6: Configuração Final (10min)

#### 6.1 Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

#### 6.2 Verificar Status
```bash
# Verificar containers
docker ps

# Verificar logs
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f client

# Testar API
curl http://localhost:3000/health

# Testar Client
curl http://localhost:3001
```

---

## 🔄 CI/CD (Opcional)

### GitHub Actions Workflow

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /home/scheduler/scheduler
            git pull origin main
            docker compose -f docker-compose.prod.yml build
            docker compose -f docker-compose.prod.yml up -d
```

---

## 📊 Monitoramento

### Ferramentas Recomendadas:

1. **Logs**: Docker logs + Grafana Loki
2. **Métricas**: Prometheus + Grafana
3. **Uptime**: UptimeRobot (free)
4. **Errors**: Sentry (free tier)

---

## 💰 Estimativa de Custos (MVP)

### Opção 1: VPS (Recomendado)
| Item | Custo Mensal |
|------|--------------|
| DigitalOcean Droplet (4GB) | $24 |
| Domínio (.com) | $1 |
| Backups automáticos | $5 |
| Email SendGrid (free tier) | $0 |
| **Total** | **~$30/mês** |

### Opção 2: Railway
| Item | Custo Mensal |
|------|--------------|
| Railway Pro | $5 |
| Database | $5 |
| Bandwidth | $0-5 |
| Domínio (.com) | $1 |
| **Total** | **~$11-16/mês** |

---

## 🎯 Próximos Passos

### Agora (Crítico):
1. ✅ Corrigir Dockerfiles
2. ✅ Criar docker-compose.prod.yml
3. ✅ Criar nginx.conf
4. ✅ Testar build local

### Depois (Importante):
5. ⏳ Provisionar VPS
6. ⏳ Fazer deploy inicial
7. ⏳ Configurar domínio e SSL
8. ⏳ Configurar backups automáticos

### Futuro (Melhorias):
9. 📝 CI/CD com GitHub Actions
10. 📝 Monitoramento com Grafana
11. 📝 Alertas com Sentry
12. 📝 CDN para assets estáticos

---

## ❓ FAQ

### Q: Qual opção escolher?
**A**: Para MVP, recomendo **Opção 1 (VPS)** com DigitalOcean. Melhor custo-benefício e controle total.

### Q: Preciso de domínio próprio?
**A**: Não é obrigatório para testar, mas recomendado para produção. Pode usar Cloudflare (grátis) + Namecheap (~$10/ano).

### Q: Como fazer backup do banco?
**A**: Já tem script em `api/scripts/backup-db.sh`. Vamos criar um cron job para rodar automaticamente.

### Q: E se der problema?
**A**: Todos os logs ficam disponíveis via `docker logs`. Vou adicionar troubleshooting guide.

---

## 📚 Referências

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup.html)

---

**Criado em**: 19 de Novembro de 2025  
**Versão**: 1.0  
**Status**: 🟡 Em progresso
