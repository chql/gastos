<?php require_once 'vendor/autoload.php';

$app = new \Slim\App();
$container = $app->getContainer();

$container['db'] = function($c) {
    return (new \MongoDB\Client())->gastos;
};

// rotas
$app->get('/hello', function($request, $response) {
    $response->getBody()->write('Hello World');
    return $response;
});

$app->run();
