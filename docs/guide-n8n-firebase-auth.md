# Guia: Autenticando o n8n com o Firebase Usando uma Conta de Serviço

Este guia explica como permitir que um serviço externo, como o n8n, acesse seu banco de dados Firestore de forma segura. Isso é feito através de uma **Chave de Conta de Serviço (Service Account Key)**.

## O Que é uma Conta de Serviço?

Pense em uma Conta de Serviço como uma identidade especial, não para uma pessoa, mas para um aplicativo ou servidor (neste caso, sua automação do n8n). Em vez de usar um e-mail e senha, seu aplicativo se autentica usando um arquivo de credenciais (uma chave JSON) que prova sua identidade para os serviços do Google Cloud, incluindo o Firebase.

## Passo a Passo

### Parte 1: Gerar a Chave no Firebase

1.  **Acesse o Firebase Console:**
    *   Vá para o [Firebase Console](https://console.firebase.google.com/) e selecione seu projeto (ex: `finecoding`).

2.  **Abra as Configurações do Projeto:**
    *   No menu à esquerda, clique no ícone de engrenagem ao lado de "Project Overview" (Visão Geral do Projeto).
    *   Selecione **"Project settings"** (Configurações do projeto).

3.  **Navegue até Contas de Serviço:**
    *   Clique na aba **"Service accounts"** (Contas de serviço).

4.  **Gere a Chave Privada:**
    *   No centro da página, procure por um botão azul chamado **"Generate new private key"**.
    *   Clique nele. Um aviso de segurança aparecerá, informando que você deve armazenar esta chave com segurança.
    *   Clique no botão **"Generate key"** para confirmar.

5.  **Salve o Arquivo JSON:**
    *   Seu navegador fará o download de um arquivo com um nome semelhante a `seu-projeto-firebase-adminsdk-....json`.
    *   **TRATE ESTE ARQUIVO COMO UMA SENHA!** Qualquer pessoa com acesso a este arquivo pode ter controle total sobre seu projeto Firebase. Não o compartilhe publicamente nem o envie para o seu repositório Git.

### Parte 2: Configurar as Credenciais no n8n

Agora que você tem o arquivo JSON, vamos ensiná-lo ao n8n.

1.  **Acesse seu Painel n8n:**
    *   Abra a interface do seu n8n.

2.  **Vá para Credenciais:**
    *   No menu de navegação do n8n (geralmente à esquerda), encontre e clique em **"Credentials"**.

3.  **Adicione uma Nova Credencial:**
    *   Clique no botão **"Add credential"**.

4.  **Procure por "Firebase":**
    *   Na tela de seleção, use a barra de busca para encontrar "Firebase" e selecione-o.

5.  **Preencha as Informações da Credencial:**
    *   **Credential Name:** Dê um nome fácil de lembrar, como `Firebase FineCoding Admin`.
    *   **Service Account:** Aqui está o passo crucial.
        *   Abra o arquivo `.json` que você baixou do Firebase em um editor de texto.
        *   Selecione **TODO** o conteúdo do arquivo (de `{` até `}`).
        *   Copie o conteúdo.
        *   Cole todo o JSON no campo "Service Account" do n8n.

6.  **Salve:**
    *   Clique no botão **"Save"** ou **"Create"** para finalizar.

### Parte 3: Use a Credencial no seu Workflow

Agora, dentro do seu workflow do n8n:

1.  Adicione um nó que interaja com o Firebase (por exemplo, o nó "Firestore").
2.  No campo de configuração do nó, haverá uma seção de **"Credential"**.
3.  Clique na lista suspensa e selecione a credencial que você acabou de criar (ex: `Firebase FineCoding Admin`).

É isso! Agora, quando este workflow for executado, o n8n se autenticará no seu projeto Firebase usando a chave que você forneceu, e as regras de segurança do Firestore o reconhecerão como um acesso autenticado e privilegiado.
