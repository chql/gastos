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
    $dados['owner'] = $user->login;

	if(isset($dados['id'])) {
		$id = $dados['id'];
		unset($dados['id']);
		$this->db->gastos->updateOne(['_id' => new \MongoDB\BSON\ObjectID($id)],[
			'$set' => $dados
		]);
	}
	else {
		$this->db->gastos->insertOne($dados);
	}

    return $response->withJson([
        'erro' => false
    ]);
});

$app->get('/gastos', function($request, $response) {
	$gastos = [];
    $cursor = $this->db->gastos->find(['owner' => $_SESSION['user']]);
    foreach($cursor as $gasto) {
        $gasto['id'] = (string)$gasto['_id'];
        unset($gasto['_id']);
        $gastos[] = $gasto;
    }
	return $response->withJson([
		'erro' => false,
		'gasto' => $gastos
	]);
});

$app->get('/gastos/{id}', function($request, $response, $args) {
    $id = new \MongoDB\BSON\ObjectID($args['id']);
    $gasto = $this->db->gastos->findOne(['_id' => $id]);
    $gasto['id'] = (string)$gasto['_id'];
    unset($gasto['_id']);
	return $response->withJson([
		'erro' => false,
		'gasto' => $gasto
	]);
});

$app->delete('/gastos/{id}', function($request, $response, $args) {
	$id = new \MongoDB\BSON\ObjectID($args['id']);
	$gasto = $this->db->gastos->deleteOne(['_id' => $id]);
    return $response->withJson([
        'erro' => false
    ]);
});

