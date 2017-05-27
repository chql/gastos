<?php require_once '../../vendor/autoload.php';

session_start();

$app = new \Slim\App();
$container = $app->getContainer();

$container['db'] = function($c) {
    return (new \MongoDB\Client())->gastos;
};

$app->add(function($request, $response, $next) {
    $response = $next($request, $response);
    return $response->withHeader('Access-Control-Allow-Origin', '*');
});

include_once '../../src/usuarios.php';
include_once '../../src/gastos.php';

$app->run();
