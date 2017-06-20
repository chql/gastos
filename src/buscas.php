<?php

$app->get('/buscas/despesas', function($request, $response) {
    $inicio = $request->getQueryParam('inicio');
    $final  = $request->getQueryParam('final');

    $cursor = $this->db->despesas->find(
        [
            'u' => $_SESSION['login'],
            'data' => [
                '$gte' => $inicio,
                '$lte' => $final
            ]
        ]
    );

    $despesas = [];
    foreach($cursor as $d) {
        $d['_id'] = (string)$d['_id'];
        $despesas[] = $d;
    }

    return $response->withJson([
        'erro' => false,
        'despesas' => $despesas
    ]);
});

$app->get('/buscas/receitas', function($request, $response) {
    $inicio = $request->getQueryParam('inicio');
    $final  = $request->getQueryParam('final');

    $cursor = $this->db->receitas->find(
        [
            'u' => $_SESSION['login'],
            'data' => [
                '$gte' => $inicio,
                '$lte' => $final
            ]
        ]
    );

    $receitas = [];
    foreach($cursor as $d) {
        $d['_id'] = (string)$d['_id'];
        $receitas[] = $d;
    }

    return $response->withJson([
        'erro' => false,
        'receitas' => $receitas
    ]);
});

