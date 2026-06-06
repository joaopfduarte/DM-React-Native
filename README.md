# Amigos da Fauna — React Native

Aplicativo mobile multiplataforma desenvolvido com **Expo** e **React Native**, portando o PWA *Amigos da Fauna* para Android. Projeto da disciplina de Desenvolvimento Mobile — CEFET-MG, Campus VII (2026-1).

## Sobre o app

O **Amigos da Fauna** é um projeto de educação ambiental sobre a biodiversidade da Mata Atlântica. O app oferece:

- Catálogo de animais com busca e paginação
- Mapa interativo com localização dos animais
- Quizzes educativos por animal
- Autenticação de usuários
- Compartilhamento de informações sobre animais

## Tecnologias

- Expo ~54 / React Native 0.81
- Expo Router (Tabs + Stack)
- TypeScript
- Context API (`AuthContext`, `ThemeContext`)
- Hooks customizados (`useFetch`, `useMutation`)
- Axios + fetch nativo (via `useFetch`)
- AsyncStorage + expo-secure-store
- expo-location + Share API (React Native)

## Mapeamento PWA → React Native

| PWA (navegador) | Equivalente nativo | Uso no app |
|-----------------|-------------------|------------|
| Geolocation API | `expo-location` | Mapa — posição do usuário e marcadores dos animais |
| Web Share API | `Share` (React Native) | Compartilhar dados de animais na home e detalhe |

## Estrutura do projeto

```
app/                  # Rotas (Expo Router)
  (tabs)/             # Navegação principal
  quiz.tsx            # Quiz por animal
  register.tsx        # Cadastro
  animals/[id].tsx    # Detalhe do animal
contexts/             # AuthContext, ThemeContext
hooks/                # useFetch, useMutation, useColorScheme
services/             # API, auth, storage
utils/                # Permissões de localização, compartilhamento
```

## Como executar

```bash
npm install
npx expo start
```

Escaneie o QR Code com o **Expo Go** em um dispositivo Android físico.

## Build de produção (APK)

Pré-requisitos: conta Expo ([expo.dev](https://expo.dev)) e EAS CLI instalado.

```bash
npm install -g eas-cli
eas login
eas build:configure   # já configurado via eas.json
eas build -p android --profile production
```

Após o build, baixe o `.apk` pelo painel do EAS ou CLI:

```bash
eas build:list
```

### Publicar Release no GitHub

1. Crie uma tag: `git tag v1.0.0 && git push origin v1.0.0`
2. Acesse **Releases** no GitHub → **Draft a new release**
3. Selecione a tag `v1.0.0`
4. Anexe o arquivo `.apk` gerado pelo EAS Build
5. Publique a release

## Plano de testes (Entrega 02)

Checklist de validação manual em dispositivo Android físico:

| # | Teste | Resultado esperado |
|---|-------|-------------------|
| 9 | Abrir app via Expo Go | App carrega com tabs Início, Mapa, Perfil, Sobre |
| 10a | Geolocalização no mapa | Botão "Minha localização" centraliza mapa na posição do usuário |
| 10b | Compartilhamento | Botão "Compartilhar" abre sheet nativo com dados do animal |
| 11a | Conceder permissão de localização | Mapa exibe círculo na posição do usuário |
| 11b | Negar permissão | Alerta informa negação; opção de abrir Configurações |
| — | Login / Quiz | Quiz exige login; resultados salvos localmente |
| — | Dark mode | Alternar tema em Perfil ou Sobre |
| — | Offline (home) | Sem rede, exibe cache de animais do AsyncStorage |

**Dispositivo de teste:** _preencher modelo e versão Android após teste físico_

**Data do teste:** _preencher após teste físico_

## API

Backend: `https://api-dm-69db35e2f2d0.herokuapp.com`

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o Expo |
| `npm run android` | Abre no emulador Android |
| `npm run lint` | Executa ESLint |

## Equipe

Repositório: [github.com/joaopfduarte/DM-React-Native](https://github.com/joaopfduarte/DM-React-Native)
