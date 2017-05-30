# Especificação de Endpoints

## `/usuarios`

### Solicitação

Cadastra um novo usuário.

    PUT /usuarios
    Content-Type: application/json;charset=utf-8

    {
        "login": "<username>",
        "senha": "<password>"
    }

### Resposta

    200 OK
    Content-Type: application/json;charset=utf-8

    {
        "erro": <true|false>,
        "erros": {
            "<campo>": <array|undefined>
        }
    }

## `/usuarios/login`

Autentica um usuário já existente.

### Solicitação

    POST /usuarios/login
    Content-Type: application/json;charset=utf-8
    Set-Cookie: PHPSESSID=<token>

    {
        "login": "<username>",
        "senha": "<password>"
    }

### Resposta

    200 OK
    Content-Type: application/json;charset=utf-8

    {
        "erro": <true|false>,
        "erros": {
            "<campo>": <array|undefined>
        }
    }

## `/gastos`

Cadastra novos gastos do usuário.

### Solicitação

    PUT /gastos
    Content-Type: application/json;charset=utf-8

    {
        "descricao": <string>,
        "tipo": "<receita|despesa>",
        "categoria": <string>,
        "preco": <double>,
        "local": <string>,
        "adesao": "<variavel|mensal|fixa>"
    }

### Resposta

    200 OK
    Content-Type: application/json;charset=utf-8

    {
        "erro": <true|false>,
        "erros": {
            "<campo>": <array|undefined>
        }
    }

Obtém os gastos

### Solicitação

    GET /gastos
    Content-Type: application/json;charset=utf-8


### Resposta

    200 OK
    Content-Type: application/json;charset=utf-8

    {
        "erro": <true|false>,
        "erros": {
            "<campo>": <array|undefined>
        },
        "gastos": [
            {},{}
        ]
    }
    

Obtém um gasto

### Solicitação

    GET /gastos?id=string
    Content-Type: application/json;charset=utf-8


### Resposta

    200 OK
    Content-Type: application/json;charset=utf-8

    {
        "erro": <true|false>,
        "erros": {
            "<campo>": <array|undefined>
        },
        "gasto": {
            "id": <string>,
            "descricao": <string>,
            "tipo": "<receita|despesa>",
            "categoria": <string>,
            "preco": <double>,
            "local": <string>,
            "adesao": "<variavel|mensal|fixa>"
        }
    }

Atualiza um gasto do usuário

### Solicitação

    POST /gastos
    Content-Type: application/json;charset=utf-8

    {
        "id": <string>,
        "descricao": <string>,
        "tipo": "<receita|despesa>",
        "categoria": <string>,
        "preco": <double>,
        "local": <string>,
        "adesao": "<variavel|mensal|fixa>"
    }

### Resposta

    200 OK
    Content-Type: application/json;charset=utf-8

    {
        "erro": <true|false>,
        "erros": {
            "<campo>": <array|undefined>
        }
    }
    
Remove um gasto do usuário

### Solicitação

    DELETE /gastos
    Content-Type: application/json;charset=utf-8

    {
        "id": <string>
    }

### Resposta

    200 OK
    Content-Type: application/json;charset=utf-8

    {
        "erro": <true|false>,
        "erros": {
            "<campo>": <array|undefined>
        }
    }
