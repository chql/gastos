<?php

$app->post('/cidades', function($request, $response) {
    $dados = $request->getParsedBody();
    $form = new \Validacao\ValidaCidade;

    $form->fill($dados);
    
    if($form->filter() === false) {
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    $dados['u'] = $_SESSION['login'];

    $result = $this->db->cidades->insertOne($dados);

    return $response->withJson([
        'erro' => false,
        'insertedId' => (string)$result->getInsertedId()
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

$app->get('/cidades', function($request, $response) {
    $cidades = [];

    $cursor = $this->db->cidades->find(['u' => $_SESSION['login']]);
    foreach($cursor as $d) {
        $d['_id'] = (string)$d['_id'];
        $cidades[] = $d;
    }

    return $response->withJson([
        'erro' => false,
        'cidades' => $cidades
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

$app->delete('/cidades/{id}', function($request, $response, $args) {
    $id = new \MongoDB\BSON\ObjectID($args['id']);
    $this->db->cidades->deleteOne(['_id' => $id]);
    return $response->withJson([
        'erro' => false
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

