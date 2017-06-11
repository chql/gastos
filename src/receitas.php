<?php

$app->post('/receitas', function($request, $response) {
    $dados = $request->getParsedBody();
    $form  = new \Validacao\ValidaReceita;

    $form->fill($dados);

    if($form->filter() === false) {
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    $dados['u'] = $_SESSION['login'];

    $result = $this->db->receitas->insertOne($dados);

    return $response->withJson([
        'erro' => false,
        'insertedId' => (string)$result->getInsertedId()
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

$app->get('/receitas', function($request, $response) {
    $receitas = [];

    $cursor = $this->db->receitas->find(['u' => $_SESSION['login']]);
    foreach($cursor as $r) {
        $r['_id'] = (string)$r['_id'];
        $receitas[] = $r;
    }

    return $response->withJson([
        'erro' => false,
        'receitas' => $receitas
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

$app->get('/receitas/{id}', function($request, $response, $args) {
    $id = new \MongoDB\BSON\ObjectID($args['id']);
    $r = $this->db->receitas->findOne(['_id' => $id]);
    $r['_id'] = (string)$r['_id'];
    return $response->withJson([
        'erro' => false,
        'receita' => $r
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

$app->put('/receitas/{id}', function($request, $response, $args) {
    $dados = $request->getParsedBody();
    $form  = new \Validacao\ValidaReceita;

    $form->fill($dados);

    if($form->filter() === false) {
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    $dados['u'] = $_SESSION['login'];

    $id = new \MongoDB\BSON\ObjectID($args['id']);
    $result = $this->db->receitas->updateOne(['_id' => $id], [
        '$set' => $dados
    ]);

    return $response->withJson([
        'erro' => false,
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

$app->delete('/receitas/{id}', function($request, $response, $args) {
    $id = new \MongoDB\BSON\ObjectID($args['id']);
    $this->db->receitas->deleteOne(['_id' => $id]);
    return $response->withJson([
        'erro' => false
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

