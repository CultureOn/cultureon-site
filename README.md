# CultureOn — website (v1, Home)

Site estático em HTML, CSS e JS. Não precisa de build nem de dependências.

## Estrutura

```
index.html                     Home
about/                         Sobre Nós
projetos/                      Lista de projetos (com filtros)
projetos/<projeto>/            Caso de estudo (6)
os-nossos-videos/              Vídeos (YouTube, carregam ao clicar)
contactos/                     Contactos + formulário completo
styles.css · main.js           Estilos e scripts partilhados
assets/img · assets/video      Imagens e vídeos otimizados
```

## Ver localmente

```
python3 -m http.server
```
Depois abre http://localhost:8000.

## Publicar no GitHub Pages

1. Cria um repositório novo, por exemplo `CultureOn/cultureon-site`, e envia estes ficheiros.
2. Vai a Settings → Pages → Source: *Deploy from a branch* → `main` / `root`.
3. Em Custom domain, escreve `cultureon.pt` (o GitHub cria o ficheiro `CNAME`).
4. No dominios.pt, aponta o DNS para o GitHub Pages:
   - Registos `A` para `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - Registo `CNAME` para `www`: `cultureon.github.io`
5. Quando o certificado estiver pronto, ativa **Enforce HTTPS**.

Só mudes o DNS quando as páginas Sobre, Projetos, Vídeos e Contactos também estiverem prontas. Até lá, o Framer continua a servir o site.

## Formulário

O formulário usa o [Formspree](https://formspree.io), que tem plano gratuito:
1. Cria um formulário no Formspree.
2. Substitui `SEU_ID` no `action` do `<form>` em `index.html` pelo ID que o Formspree te der.

## Por fazer

- Ligar os formulários ao Formspree (substituir `SEU_ID` em todos os `index.html`)
- Imagens de galeria dos casos de estudo (só a Gilberto's tem galeria por agora)
- Favicon e imagem de partilha (og:image) definitivos
- Quando tudo estiver aprovado: domínio cultureon.pt (ver passos acima)
