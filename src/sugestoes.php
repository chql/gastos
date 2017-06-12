<?php

$app->get('/sugestoes/locais', function($request, $response) {
    $locais = [];

    $cursor = $this->db->despesas->find(
        [ 'u' => $_SESSION['login'] ],
        [ 
            'projection' => [
                'origem' => 1
            ]
        ]
    );

    foreach($cursor as $document) {
        $locais[] = $document['origem'];
    }

    return $response->withJson([
        'erro' => false,
        'locais' => $locais
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

$app->get('/sugestoes/cidades', function($request, $response) {
    $cidades = [];

    $cursor = $this->db->despesas->find(
        [ 'u' => $_SESSION['login'] ],
        [ 
            'projection' => [
                'local' => 1
            ]
        ]
    );

    foreach($cursor as $document) {
        $cidades[] = $document['local'];
    }

    return $response->withJson([
        'erro' => false,
        'locais' => $cidades
    ]);
})->add( \Core\AutenticacaoMiddleware::getInstance() );

