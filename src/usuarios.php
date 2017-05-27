<?php

$app->put('/usuarios', function($request, $response) {
    $dados = $request->getParsedBody();
    $form  = new \Validacao\ValidaUsuario;

    $form->fill($dados);

    if($form->filter() === false)
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);

    $user = $this->db->usuarios->findOne([
        'login' => $dados['login']
    ]);

    if(is_null($user) === false) {
        $form->getFilter()->addMessages('login','Login já cadastrado');
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    $this->db->usuarios->insertOne([
        'login' => $dados['login'],
        'senha' => hash('sha256', $dados['senha'])
    ]);

    return $response->withJson([
        'erro' => false
    ]);
});

$app->post('/usuarios/login', function($request, $response) {
    $dados = $request->getParsedBody();
    $form = new \Validacao\ValidaUsuario;

    $form->fill($dados);

    if($form->filter() === false)
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);

    $user = $this->db->usuarios->findOne([
        'login' => $dados['login']
    ]);

    if(is_null($user) === true) {
        $form->getFilter()->addMessages('login', 'Login inválido');
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    if(hash('sha256', $dados['senha']) !== $user->senha) {
        $form->getFilter()->addMessages('login','Login inválido');
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    $_SESSION['user'] = $user->login;

    return $response->withJson([
        'erro' => false,
        'login' => $user->login
    ]);
});
