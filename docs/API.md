# Especificação

## Endpoints

### `/usuarios`

| Tipo  | Solicitação | Resposta | Descrição |
| ----- | ----------- | -------- | --------- |
| POST  | [Usuário](#r-usuario) | [erros](#r-erros) | Cadastra um novo usuário. |

### `/usuarios/login`

| Tipo  | Solicitação | Resposta | Descrição |
| ----- | ----------- | -------- | --------- |
| POST  | [Usuário](#r-usuario) | [erros](#r-erros) | Inicia uma nova sessão para o usuário. |

### `/despesas`

| Tipo  | Solicitação | Resposta | Descrição |
| ----- | ----------- | -------- | --------- |
| GET   |             | [despesas](#r-despesa):array | Obtém despesas do usuário. |
| POST  | [despesa](#r-despesa) | [erros](#r-erros) | Cadastra uma nova despesa do usuário. |

### `/despesas/{id}`

| Tipo   | Solicitação | Resposta | Descrição |
| ------ | ----------- | -------- | --------- |
| GET    |             | [despesa](#r-despesa) | Obtém uma despesa. |
| PUT    | [despesa](#r-despesa) | [erros](#r-erros) | Altera uma despesa. |
| DELETE |             |          | Deleta uma depesa. |

### `/receitas`

| Tipo  | Solicitação | Resposta | Descrição |
| ----- | ----------- | -------- | --------- |
| GET   |             | [receitas](#r-receita):array | Obtém receitas do usuário. |
| POST  | [receita](#r-receita) | [erros](#r-erros) | Cadastra uma nova receita do usuário. |

### `/receitas/{id}`

| Tipo   | Solicitação | Resposta | Descrição |
| ------ | ----------- | -------- | --------- |
| GET    |             | [receita](#r-receita) | Obtém uma receita. |
| PUT    | [receita](#r-receita) | [erros](#r-erros) | Altera uma receita. |
| DELETE |             |          | Deleta uma receita. |

## Estruturas

<a name="r-erros"/>

### Erros de validação

    {
        "erro": <true|false>,
        "erros": {
            "<campo>": array
        }
    }

<a name="r-usuario"/>

### Usuário

    {
        "login": <string>,
        "senha": <string>
    }

<a name="r-despesa"/>

### Despesa

    {
        "origem": <string>,
        "local": <string>,
        "repeticao": "<variavel|dia|semana|quinzena|mes|ano>",
        "data": "<YYYY-MM-DD>"
    }

<a name="r-receita">

### Receita

    {
        "origem": <string>,
        "repeticao": "<variavel|dia|semana|quinzena|mes|ano>",
        "data": "<YYYY-MM-DD>"
    }

