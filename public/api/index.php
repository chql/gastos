<?php require_once '../../vendor/autoload.php';

session_start();

$app = new \Slim\App();
$container = $app->getContainer();

$container['db'] = function($c) {
    return (new \MongoDB\Client())->gastos;
};

$app->add(function($request, $response, $next) {
    $response = $next($request, $response);
    return $response->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization');
});

include_once '../../src/usuarios.php';
include_once '../../src/despesas.php';
include_once '../../src/receitas.php';

$app->run();
