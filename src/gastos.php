<?php

$app->put('/gastos', function($request, $response) {
    $dados = $request->getParsedBody();
    $form  = new \Validacao\ValidaGasto;

    $form->fill($dados);

    if($form->filter() === false) {
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    $user = $this->db->usuarios->findOne(['login' => $_SESSION['user']]);
    $dados['owner'] = $user->_id;

    $this->db->gastos->insertOne($dados);

    return $response->withJson([
        'erro' => false
    ]);
});

