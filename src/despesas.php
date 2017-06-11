<?php

$app->post('/despesas', function($request, $response) {
    $dados = $request->getParsedBody();
    $form  = new \Validacao\ValidaDespesa;

    $form->fill($dados);

    if($form->filter() === false) {
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    $dados['u'] = $_SESSION['login'];

    $result = $this->db->despesas->insertOne($dados);

    return $response->withJson([
        'erro' => false,
        'insertedId' => (string)$result->getInsertedId()
    ]);
});

$app->get('/despesas', function($request, $response) {
    $despesas = [];

    $cursor = $this->db->despesas->find(['u' => $_SESSION['login']]);
    foreach($cursor as $d) {
        $d['_id'] = (string)$d['_id'];
        $despesas[] = $d;
    }

    return $response->withJson([
        'erro' => false,
        'despesas' => $despesas
    ]);
});

$app->get('/despesas/{id}', function($request, $response, $args) {
    $id = new \MongoDB\BSON\ObjectID($args['id']);
    $d = $this->db->despesas->findOne(['_id' => $id]);
    $d['_id'] = (string)$d['_id'];
    return $response->withJson([
        'erro' => false,
        'despesa' => $d
    ]);
});

$app->put('/despesas/{id}', function($request, $response, $args) {
    $dados = $request->getParsedBody();
    $form  = new \Validacao\ValidaDespesa;

    $form->fill($dados);

    if($form->filter() === false) {
        return $response->withJson([
            'erro' => true,
            'erros' => $form->getMessages()
        ]);
    }

    $dados['u'] = $_SESSION['login'];

    $id = new \MongoDB\BSON\ObjectID($args['id']);
    $result = $this->db->despesas->updateOne(['_id' => $id], [
        '$set' => $dados
    ]);

    return $response->withJson([
        'erro' => false,
    ]);
});

$app->delete('/despesas/{id}', function($request, $response, $args) {
    $id = new \MongoDB\BSON\ObjectID($args['id']);
    $this->db->despesas->deleteOne(['_id' => $id]);
    return $response->withJson([
        'erro' => false
    ]);
});

