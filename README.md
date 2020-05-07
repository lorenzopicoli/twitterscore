# TwitterScore - Twitter Bot Scanner

🇬🇧 A naive approach to identifying bots and trolls on Twitter

🇧🇷 Uma implementação simples para identificar bots e trolls no Twitter

<p align="center">
  <img src="https://i.pinimg.com/564x/d4/42/73/d44273f7bb30d26e9e88c765665cee84.jpg">
</p>

## English:

1. [Goal](#1--goal)
2. [Dictionary](#2--dictionary)
3. [Getting started](#3--getting-started)
4. [Commands](#4--commands)
5. Limitations

## Portuguese:

1. [Objetivo](#1--objetivo)
2. [Dicionário](#2--dicion%c3%a1rio)
3. [Primeiros passos](#3--primeiros-passos)
4. [Comandos](#4--comandos)

---

## 1- Goal

The goal of this project is to score a twitter account based on its activity and provide quick insight on how the account behaves and if it acts like a normal account.

It's clear that Twitter has a big problem with bots. Every trending topic is filled with suspicious accounts that amplify some opinion and polarizes the discussion. Humans are actually quite good at telling if an account is worth taking seriously or not, but it's simply impossible to go through each one of them and analyse it. The goal of this project is to provide a score so you can quickly know if it's worth to engage in discussion or not.

## 2- Dictionary

- **Bot**: Account that isn't controlled by a human. These accounts display some behavior that a human wouldn't do like tweeting the same hashtag over and over in for an unreasonable amount of time
- **Troll**: Account that is probably used by a human, but it doesn't express the human's opinion and never engage in discussions. These accounts can sometimes reply to other accounts and look like they're expressing an opinion, but it never really goes any further than that. They simply repeat the same thing over and over as they don't care about the discussion and explaining their point of view, they just want to throw it out there and amplify noise. Some more sophisticated bots will inevitably end up being categorized as _trolls_ but it's not a problem as the goal of this project is to quickly tell you if a user is relevant or not. Trolls are not relevant to the discussion. Keep in mind that the content is not relevant. A negative person should NOT be categorized as a troll in this project.
- **Legit user**: Self explanatory :)
- **Labeled data**: Data that we can use to improve the score and test changes. These are accounts that a HUMAN manually checked and labeled as bot, troll or legit

## 3- Getting started

To run this project you first need to clone it:

```
git clone <url>
```

Create a `.env` file with your Twitter Bearer Token in it:

```
TWITTER_TOKEN=Bearer xxxxxxxxxx
```

Install the dependencies:

```
npm ci
```

Then you need to build the typescript code

```
npm run build
```

After that you can run it

```
npm run start <commands>
```

Refer to the commands for a full list of the available commands

## 4- Commands

| Flag                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                          | Examples                          | Available when    |     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------- | --- |
| -c                          | Command that you want to run.<br><br>"user" will run the analysis on a single user<br><br>"labeledData" will display an analysis of the labeled data that shows how the labeled users score a given parameter or how their score looks like. Specially useful when tweaking the score and testing how accurate the current score implementation is <br><br>"hashtags" will run the analysis on X users that used a hashtag and aggregate the results | "hashtags", "user", "labeledData" |                   |     |
| --hashtag                   | This is the hashtag you want to analyse                                                                                                                                                                                                                                                                                                                                                                                                              | "#MyHashtag"                      | -c: "hashtags"    |     |
| --user                      | User you want to analyse                                                                                                                                                                                                                                                                                                                                                                                                                             | "lorenzopicoli"                   | -c: "users"       |     |
| --max                       | Max users you want to analyse (can't be higher than 100 per Twitter limitations)                                                                                                                                                                                                                                                                                                                                                                     | 20                                | -c: "hashtags"    |     |
| --report                    | If a report of the user analysis should be displayed                                                                                                                                                                                                                                                                                                                                                                                                 |                                   | All commands      |     |
| --detailed                  | -c "users": If the report should contain detailed information (every word we found, every hashtag used, etc...)<br><br>-c "hashtag", "labeledData": Display the report of each user analysed                                                                                                                                                                                                                                                         |                                   | All commands      |     |
| --rankings                  | Display the user top 10 rankings (most used hashtags, words, interacted users, etc)                                                                                                                                                                                                                                                                                                                                                                  |                                   | All commands      |     |
| --hashtagPerTweet           | Analyse the "hashtagPerTweet" parameter for all the labeled data available                                                                                                                                                                                                                                                                                                                                                                           |                                   | -c: "labeledData" |     |
| --hashtagTotalCount         | Analyse the "hashtagTotalCount" parameter for all the labeled data available                                                                                                                                                                                                                                                                                                                                                                         |                                   | -c: "labeledData" |     |
| --hashtagUniqueCount        | Analyse the "hashtagUniqueCount" parameter for all the labeled data available                                                                                                                                                                                                                                                                                                                                                                        |                                   | -c: "labeledData" |     |
| --wordsNonRelevant          | Analyse the "wordsNonRelevant" parameter for all the labeled data available                                                                                                                                                                                                                                                                                                                                                                          |                                   | -c: "labeledData" |     |
| --wordsUniqueCount          | Analyse the "wordsUniqueCount" parameter for all the labeled data available                                                                                                                                                                                                                                                                                                                                                                          |                                   | -c: "labeledData" |     |
| --mentionedUsersTotalCount  | Analyse the "mentionedUsersTotalCount" parameter for all the labeled data available                                                                                                                                                                                                                                                                                                                                                                  |                                   | -c: "labeledData" |     |
| --mentionedUsersUniqueCount | Analyse the "mentionedUsersUniqueCount" parameter for all the labeled data available                                                                                                                                                                                                                                                                                                                                                                 |                                   | -c: "labeledData" |     |
| --sessionAverageTweetTime   | Analyse the "sessionAverageTweetTime" parameter for all the labeled data available                                                                                                                                                                                                                                                                                                                                                                   |                                   | -c: "labeledData" |     |
| --score                     | Analyse the final score for all the labeled data available                                                                                                                                                                                                                                                                                                                                                                                           |                                   | -c: "labeledData" |     |

---

---

---

## 1- Objetivo

O objetivo desse projeto é dar uma pontuação (score) para uma conta no Twitter baseado na sua atividade e ajudar a entender se a conta se comporta como uma conta normal.

É claro que o Twitter tem um grande problema com bots. Todo "assunto do momento" (trending topic) é cheio de contas suspeitas que amplificam uma opinião e ajudam a polarizar a discussão. Humanos são muito bons em distinguir uma conta legítima e uma conta que não vale a pena discutir, mas é simplesmente impossivel ir por todas elas e analisar. O objetivo desse projeto é dar uma pontuação a cada conta pra você poder rapidamente saber se é uma conta que vale a pena interagir ou não.

## 2- Dicionário

- **Score**: Pontuação
- **Bot**: Conta que não é controlada por um ser humano. Essas contas apresentam comportamento que um humano não apresentaria como, por exemplo, ficar tuitando só hashtag por um período longo sem nunca escrever nada que preste
- **Troll**: Conta que é provavelmente usada por um humano, mas ele não expressa a opinião do ser humano e nunca se compromete a discutir o seu ponto de vista. Essas contas podem até responder outros usuários, mas elas nunca realmente respondem argumentos e apresentam argumentos. Elas simplesmente repetem a mesma coisa o tempo todo porque o objetivo não é discutir... é apenas fazer barulho. Alguns bots sofisticados vão inevitavelmente cair nessa categoria, mas isso não é um problema porque o objetivo do projeto é deixar claro se o tweet de uma conta é ou não relevante. Trolls não são relevantes para a discussão. É importante ressaltar que o conteúdo não é relevante. Uma pessoa negativa NÃO deve ser categorizada como um troll nesse projeto.
- **Legit user**: Usuário legítimo
- **Labeled data**: Contas que um ser humano checou MANUALMENTE e marcou elas como troll, bot ou legit

## 3- Primeiros passos

Para rodar esse projeto você precisa primeiro clonar esse repositório:

```
git clone <url>
```

Instalar as dependências:

```
npm ci
```

Depois disso você precisa buildar o projeto:

```
npm run build
```

Criar um arquivo chamado `.env` e botar o seu token do Twitter nele:

```
TWITTER_TOKEN=Bearer xxxxxxxxxx
```

E por último rodar:

```
npm run start <comandos>
```

Na seção comandos você pode encontrar uma lista completa dos comandos disponíveis

## 4- Comandos

| Flag                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                  | Examples                          | Available when    |     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------- | --- |
| -c                          | Comando que você que rodar. <br><br>"user" vai rodar a análise em um único usuário<br><br>"labeledData" vai rodar uma análise nos dados marcados (labeledData) que mostra a pontuação dos usuários conhecidos em um parâmetro específico. Bem útil para ajustar o score e testar se a implementação atual é precisa ou não.<br><br>"hashtags" vai rodar a análise em X usuários que usaram a hashtag e agregar os resultados | "hashtags", "user", "labeledData" |                   |     |
| --hashtag                   | A hashtag a ser analisada                                                                                                                                                                                                                                                                                                                                                                                                    | "#MyHashtag"                      | -c: "hashtags"    |     |
| --user                      | Usuário a ser analisado                                                                                                                                                                                                                                                                                                                                                                                                      | "lorenzopicoli"                   | -c: "users"       |     |
| --max                       | Máximo de usuários que vão ser analisados (não pode ser maior do que 100 por restriões do Twitter)                                                                                                                                                                                                                                                                                                                           | 20                                | -c: "hashtags"    |     |
| --report                    | Se o relatório do usuário deve ser apresentado                                                                                                                                                                                                                                                                                                                                                                               |                                   | All commands      |     |
| --detailed                  | -c "users": Se o relatório deve contar informações detalhadas sobre o usuário ou não (todas as plavras usadas, todas as hashtags usadas, etc...)<br><br>-c "hashtag", "labeledData": Mostra o relatório de todos os usuários analisados                                                                                                                                                                                      |                                   | All commands      |     |
| --rankings                  | Mostra o Top 10 dos usuários (hashtags mais usadas, palavras mais usadas, etc)                                                                                                                                                                                                                                                                                                                                               |                                   | All commands      |     |
| --hashtagPerTweet           | Analisa o parâmetro "hashtagPerTweet" para todos os usuários conhecidos (labeledData) available                                                                                                                                                                                                                                                                                                                              |                                   | -c: "labeledData" |     |
| --hashtagTotalCount         | Analisa o parâmetro "hashtagTotalCount" para todos os usuários conhecidos (labeledData) available                                                                                                                                                                                                                                                                                                                            |                                   | -c: "labeledData" |     |
| --hashtagUniqueCount        | Analisa o parâmetro "hashtagUniqueCount" para todos os usuários conhecidos (labeledData) available                                                                                                                                                                                                                                                                                                                           |                                   | -c: "labeledData" |     |
| --wordsNonRelevant          | Analisa o parâmetro "wordsNonRelevant" para todos os usuários conhecidos (labeledData) available                                                                                                                                                                                                                                                                                                                             |                                   | -c: "labeledData" |     |
| --wordsUniqueCount          | Analisa o parâmetro "wordsUniqueCount" para todos os usuários conhecidos (labeledData) available                                                                                                                                                                                                                                                                                                                             |                                   | -c: "labeledData" |     |
| --mentionedUsersTotalCount  | Analisa o parâmetro "mentionedUsersTotalCount" para todos os usuários conhecidos (labeledData) available                                                                                                                                                                                                                                                                                                                     |                                   | -c: "labeledData" |     |
| --mentionedUsersUniqueCount | Analisa o parâmetro "mentionedUsersUniqueCount" para todos os usuários conhecidos (labeledData) available                                                                                                                                                                                                                                                                                                                    |                                   | -c: "labeledData" |     |
| --sessionAverageTweetTime   | Analisa o parâmetro "sessionAverageTweetTime" para todos os usuários conhecidos (labeledData) available                                                                                                                                                                                                                                                                                                                      |                                   | -c: "labeledData" |     |
| --score                     | Analisa o score final de todos os usuários conhecidos (labeledData)                                                                                                                                                                                                                                                                                                                                                          |                                   | -c: "labeledData" |     |
