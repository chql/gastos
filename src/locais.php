<?php

$app->post('/locais', function($request, $response) {
    $dados = $request->getParsedBody();
    $form = new \Validacao\ValidaLocal;

    $form->fill($dados);
    
    if($form->filter() === false) {
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    $dados['u'] = $_SESSION['login'];

    $result = $this->db->locais->insertOne($dados);

    return $response->withJson([
        'erro' => false,
        'insertedId' => (string)$result->getInsertedId()
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

$app->get('/locais', function($request, $response) {
    $locais = [];

    $cursor = $this->db->locais->find(['u' => $_SESSION['login']]);
    foreach($cursor as $d) {
        $d['_id'] = (string)$d['_id'];
        $locais[] = $d;
    }

    return $response->withJson([
        'erro' => false,
        'locais' => $locais
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

$app->delete('/locais/{id}', function($request, $response, $args) {
    $id = new \MongoDB\BSON\ObjectID($args['id']);
    $this->db->locais->deleteOne(['_id' => $id]);
    return $response->withJson([
        'erro' => false
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

