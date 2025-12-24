# Projeto de certificação 2 – Postagem de blog

Este projeto integra a **Trilha 2, Fase 8. Projetos de certificação** do curso **DEVStart**. O objetivo é desenvolver uma aplicação de blog funcional que simula a postagem de conteúdos, conectando o front-end a uma API externa para prática de operações assíncronas.

## 🚀 Sobre o Projeto

A aplicação permite criar postagens com título e conteúdo, simulando a experiência de redes sociais como Facebook ou LinkedIn. O projeto utiliza JavaScript para manipular o DOM e realizar a comunicação com a API **JSONPlaceholder**, garantindo uma experiência dinâmica ao usuário.

### 🛠️ Funcionalidades Implementadas

* **Criação de Posts:** Formulário para entrada de título e corpo do texto.
* **Integração com API:** Envio de dados via método POST para simular a criação de registros no servidor.
* **Scroll Infinito:** Carregamento automático de postagens antigas da API conforme o usuário desce a página.
* **Persistência Local:** Uso de `localStorage` para manter os posts criados salvos no navegador.
* **Interatividade:**
    * Sistema de curtidas (likes).
    * Seção de comentários por postagem.
    * Exclusão e edição de posts existentes.
    * Contador de caracteres em tempo real no campo de texto.
    * Geração aleatória de avatares e cores para cada post.

---

## 📋 Requisitos Técnicos Atendidos

### 1. Estrutura de Dados (HTML/DOM)
* **Entrada:** Implementação de `form` com `input` para título e `textarea` para conteúdo.
* **Saída:** Renderização dinâmica utilizando tags semânticas para títulos e parágrafos.

### 2. Lógica JavaScript
* **Seletores:** Uso de `querySelector` para manipulação de elementos específicos.
* **Eventos:** Aplicação de `addEventListener` para capturar o `submit` e uso de `preventDefault()` para gerenciar o fluxo de dados.
* **Objeto de Dados:** Construção do objeto seguindo o padrão exigido:
    ```javascript
    const data = {
        title: titulo.value,
        body: conteudo.value, 
        userId: 1
    }
    ```

### 3. Comunicação Assíncrona (Fetch API)
Configuração da requisição para o ambiente real:
* **URL:** `https://jsonplaceholder.typicode.com/posts`
* **Método:** `POST`
* **Headers:** `{"Content-type": "application/json; charset=UTF-8"}`

---

## 📂 Estrutura de Arquivos

* **index.html**: Estrutura principal do site.
* **style.css**: Estilos, cores, fontes e layout.
* **script.js**: Lógica de scroll e interações do formulário.

---

## 🚀 Como Executar o Projeto

1. Faça o download ou clone este repositório.
2. Abra o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Firefox, Edge, etc.).
3. **Dica:** Se estiver usando o VS Code, utilize a extensão **Live Server** para visualizar as alterações em tempo real.

---

Desenvolvido como Projeto de certificação 2 para certificação da Trilha 2. HTML, CSS e JavaScript do Curso DEVStart.