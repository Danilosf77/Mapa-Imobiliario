# MAPA IMOBILIÁRIO — Central de Empreendimentos (São Paulo e Grande SP)

> **AVISO IMPORTANTE:** Este projeto é um protótipo funcional para equipes comerciais. Os dados atuais são **estritamente demonstrativos e fictícios**. A arquitetura foi concebida para permitir a fácil substituição pelos dados reais fornecidos pelo cliente ou pela imobiliária.

---

## 1. Visão Geral do Projeto

O **Mapa Imobiliário** é uma ferramenta interna de consulta de empreendimentos para equipes comerciais e corretores. Ele apresenta um mapa interativo de São Paulo e Grande São Paulo utilizando **Leaflet** e **OpenStreetMap**, integrado a filtros em tempo real, painel de indicadores (dashboard), lista de empreendimentos e fichas técnicas detalhadas.

### Principais Funcionalidades:
- **Mapa Interativo:** Marcadores personalizados coloridos por status de obra com indicação visual e textual.
- **Filtros Simultâneos:**
  - Busca por texto (nome, bairro, cidade, endereço).
  - Seleção por Cidade (São Paulo, Barueri, Cotia, Guarulhos, Osasco, Santo André, São Bernardo do Campo, São Caetano do Sul).
  - Seleção por Zona (Centro, Norte, Sul, Leste, Oeste, Grande SP).
  - Seleção por Bairro (atualizado dinamicamente de acordo com a cidade).
  - Seleção por Status da Obra.
  - Seleção por Faixa de Preço.
  - Botão de limpeza rápida de filtros.
- **Dashboard de Métricas:**
  - Total de empreendimentos encontrados.
  - Unidades disponíveis.
  - Empreendimentos em obras.
  - Empreendimentos prontos para morar.
- **Ficha Detalhada (Modal):**
  - Imagem e status da obra.
  - Localização completa e botão "📍 Ver no mapa".
  - Metragens, dormitórios, vagas e previsão de entrega.
  - Descrição comercial e lista de diferenciais/lazer.
  - **📖 Book do Empreendimento** (visualização/download do material de apresentação).
  - **📊 Espelho de Vendas** (tabela interativa de disponibilidade por andar e unidade).
- **Versão Autossuficiente (Single-File):**
  - Arquivo `mapa-imobiliario.html` incluído na raiz.
  - Botão no sistema para exportar e baixar o arquivo HTML autossuficiente a qualquer momento.

---

## 2. Como Executar a Aplicação

### Opção A: Versão Autossuficiente (Sem servidor, direto no navegador)
Basta dar um **duplo clique** no arquivo:
```
mapa-imobiliario.html
```
Ele abrirá instantaneamente em qualquer navegador moderno (Chrome, Edge, Safari, Firefox), sem necessidade de instalar Node.js ou dependências.

### Opção B: Ambiente de Desenvolvimento (Vite + React)
Caso queira rodar o ambiente completo de desenvolvimento:
```bash
# 1. Instalar dependências (caso não tenham sido instaladas)
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# 3. Compilar para produção
npm run build
```
O servidor estará disponível em `http://localhost:3000`.

---

## 3. Onde os Dados Ficam Armazenados

Toda a base de dados dos empreendimentos está centralizada em:
```
src/data/empreendimentos.json
public/data/empreendimentos.json
```
**Nenhum dado fica disperso pelo código JavaScript.** Toda a aplicação consome diretamente esse arquivo JSON.

### Formato de Cada Empreendimento:
```json
{
  "id": 1,
  "nome": "Residencial Aurora",
  "cidade": "São Paulo",
  "bairro": "Moema",
  "zona": "Sul",
  "endereco": "Av. Rouxinol, 450 - Moema (Dados Demonstrativos)",
  "latitude": -23.6025,
  "longitude": -46.6668,
  "precoInicial": 850000,
  "status": "Em obras",
  "entrega": "Dezembro de 2027",
  "unidadesTotais": 120,
  "unidadesDisponiveis": 34,
  "metragem": "68m² a 112m²",
  "dormitorios": "2 e 3 dormitórios (1 suíte)",
  "vagas": "1 a 2 vagas",
  "imagem": "https://sua-imagem.com/foto.jpg",
  "descricao": "Texto descritivo do empreendimento...",
  "diferenciais": [
    "Piscina com raia aquecida",
    "Espaço fitness completo",
    "Coworking integrado"
  ],
  "bookUrl": "https://link-para-o-book.pdf",
  "espelhoUrl": "https://link-para-o-espelho.com"
}
```

---

## 4. Como Alterar e Adicionar Empreendimentos

### Como alterar um empreendimento existente:
Abra o arquivo `src/data/empreendimentos.json`, localize o objeto correspondente pelo `id` ou `nome` e edite as propriedades desejadas.

### Como adicionar um novo empreendimento:
Copie um dos blocos existentes no array de `src/data/empreendimentos.json`, cole no final do arquivo (antes do `]`) e preencha:
1. Um novo `id` numérico sequencial único (ex: `19`).
2. O `nome` comercial do empreendimento.
3. A `cidade`, `bairro` e `zona` (`Norte`, `Sul`, `Leste`, `Oeste`, `Centro` ou `Grande SP`).
4. `latitude` e `longitude` exatas (podem ser obtidas no Google Maps ou OpenStreetMap clicando com o botão direito no local).
5. O `status` da obra (ver lista abaixo).
6. O `precoInicial` numérico (em centavos/reais sem pontos, ex: `850000`).

---

## 5. Como Alterar Status da Obra

O sistema possui 5 status padronizados com cores e legendas próprias:

| Status da Obra | Cor do Marcador | Significado |
|---|---|---|
| `"Lançamento"` | Azul (`#2563EB`) | Imóvel em fase inicial de pré-lançamento ou lançamento |
| `"Em obras"` | Laranja (`#EA580C`) | Construção em andamento |
| `"Pronto"` | Verde (`#16A34A`) | Pronto para morar |
| `"Entrega próxima"` | Roxo (`#9333EA`) | Obra nos acabamentos finais com vistoria iminente |
| `"Esgotado"` | Cinza (`#6B7280`) | 100% comercializado |

Para alterar o status, basta atualizar o campo `"status"` com um desses 5 valores exatos.

---

## 6. Como Alterar Preços

O campo `"precoInicial"` deve ser sempre um número puro (integer), por exemplo:
- Para R$ 450.000: `"precoInicial": 450000`
- Para R$ 1.200.000: `"precoInicial": 1200000`

A formatação em Real (`R$ 1.200.000`) e a filtragem pelas faixas de preço (`Até R$ 500 mil`, `R$ 500 mil - R$ 750 mil`, etc.) são calculadas automaticamente.

---

## 7. Como Alterar Imagens

O campo `"imagem"` aceita qualquer URL direta de imagem (JPG, PNG, WebP) ou caminho local dentro da pasta `public/assets/`.
- Caso a imagem falhe no carregamento, o sistema possui proteção contra links quebrados e exibe um render arquitetônico SVG com gradiente elegante.

---

## 8. Como Alterar Links (Book e Espelho de Vendas)

- `"bookUrl"`: URL direta para a apresentação comercial, PDF ou landing page do empreendimento.
- `"espelhoUrl"`: URL para a planilha ou sistema de espelho de disponibilidade de vendas.

Dentro da aplicação, além de links externos, o usuário conta com **modais integrados** com prévia interativa do Book e do Espelho de Vendas.

---

## 9. Como Gerar / Exportar a Versão Single-File

1. **Pela Interface Web:**
   No canto superior direito do header, clique no botão **"Exportar HTML Único"**. O navegador fará o download instantâneo do arquivo `mapa-imobiliario.html`.
2. **Pelo Repositório:**
   O arquivo `mapa-imobiliario.html` já está gerado na raiz do projeto. Ele contém todo o HTML, CSS, JavaScript e o catálogo de dados embutidos.
