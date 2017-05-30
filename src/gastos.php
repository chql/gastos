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

	if(isset($dados['id'])) {
		$id = $dados['id'];
		unset($dados['id']);
		$this->db->gastos->updateOne(['_id' => $id],[
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
	$id = $request->getQueryParam('id');
	$gastos = [];
	if(is_null($id))
		$gastos = $this->db->gastos->find(['owner' => $_SESSION['user']]);
	else
		$gastos[] = $this->db->gastos->findOne(['_id' => $id]);
	return $response->withJson([
		'erro' => false,
		'gastos' => $gastos
	]);
});

$app->delete('/gastos', function($request, $response) {
	$id = $request->getQueryParam('id');
	$gasto = $this->db->gastos->findOne(['_id' => $id]);
});

