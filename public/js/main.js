const SERVER = "http://localhost:8080/";

var app = angular.module('cuga', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../views/main.html",
            controller: 'corpo'
        })
        .when("/nova",{
            templateUrl: "../views/nova_transacao.html",
            controller: 'novaTransacao'
        })
        .when("/transacoes",{
            templateUrl: "../views/transacoes.html",
            controller: 'verTransacoes'
        })
        .when("/transacao/:id", {
            templateUrl: "../views/transacao.html",
            controller: 'modTransacao'
        });
});

app.controller('corpo', function($scope, $route, $routeParams, $location) {
    $scope.newTrans = function (){
        $location.path("/nova");
    };
    $scope.home = function (){
        $location.path("/");
    };
    $scope.showTrans = function () {
        $location.path("/transacoes")
    }
});

app.controller('novaTransacao', function($scope, $route, $routeParams, $location, $http) {
    $scope.$watch('adesao', function() {
        $scope.ch_adesao = $scope.adesao === 'fixa';
    });
    $scope.valida = function () {
        var form = {
            "descricao": $scope.descricao,
            "tipo": $scope.tipo,
            "categoria": $scope.categoria,
            "preco": parseFloat($scope.valor),
            "local": $scope.local,
            "adesao": $scope.adesao
        };
        //console.log(form);
        $http.put(SERVER + 'gastos', form).then(
            function (result) {
                if(result.data['erro']){
                    alert("Não foi possivel registrar a transação");
                    var erros = result.data['erros'];
                    for(var key in erros){
                        alert("ERRO: " + key + ": " + erros[key]);
                    }
                }
                else{
                    alert("Transação registrada com sucesso");
                    $route.reload();
                }
                //console.log(result.data);
            },
            function (result) {
                alert("Houve uma falha durante o processamento");
                //console.log(result.data);
            }
        );
    }
});

app.controller('verTransacoes', function ($scope, $route, $http, $location) {
    $http.get(SERVER + 'gastos').then(
        function (result) {
            if(!result.data['erro']){
                $scope.existeTran = true;
                $scope.transacoes = result.data['gastos'];
            }
        },
        function (result) {
            $scope.existeTran = true;
            $scope.transacoes = [
                {
                    "id": "1",
                    "descricao": "asd",
                    "tipo": "asd",
                    "categoria": "asd",
                    "preco": 2.58,
                    "local": "asdasd",
                    "adesao": "fixa"
                },
                {
                    "id": "2",
                    "descricao": "asd",
                    "tipo": "asd",
                    "categoria": "asd",
                    "preco": 2.84,
                    "local": "asdasd",
                    "adesao": "fixa"
                },
                {
                    "id": "3",
                    "descricao": "asd",
                    "tipo": "asd",
                    "categoria": "asd",
                    "preco": 885,
                    "local": "asdasd",
                    "adesao": "mensal"
                },
                {
                    "id": "4",
                    "descricao": "asd",
                    "tipo": "asd",
                    "categoria": "asd",
                    "preco": 88512,
                    "local": "asdasd",
                    "adesao": "fixa"
                }
            ]
        }
    );
    $scope.modTrans = function (id) {
        $location.path("transacao/" + id);
    };
    $scope.remTrans = function (id) {
        $http.delete(SERVER + 'gastos', id).then(
            function (result) {
                if(result.data['erro'])
                    alert("Não foi possível remover a transação");
                else
                    alert("Transação removida com sucesso!");
            }
        );
    }
});

app.controller('modTransacao', function ($scope, $http, $route, $routeParams, $location) {
    var id = $routeParams.id;
    $http.get(SERVER + 'gastos', id).then(
        function (result) {
            if(!result.data['erro']){
                $scope.ch_adesao = false;
                $scope.existeTran = true;
                $scope.transacao = result.data['gasto'];
            }
        },
        function (result) {
            $scope.existeTran = true;
            $scope.ch_adesao = false;
            $scope.id = "1";
            $scope.descricao = "asd";
            $scope.tipo = "receita";
            $scope.categoria = "asd";
            $scope.valor = 2.58;
            $scope.local = "asdasd";
            $scope.adesao = "variavel";
        }
    );
    $scope.$watch('adesao', function() {
        $scope.ch_adesao = $scope.adesao === 'fixa';
    });
    $scope.valida = function () {
        var form = {
            "id": $scope.id,
            "descricao": $scope.descricao,
            "tipo": $scope.tipo,
            "categoria": $scope.categoria,
            "preco": parseFloat($scope.valor),
            "local": $scope.local,
            "adesao": $scope.adesao
        };
        //console.log(form);
        $http.put(SERVER + 'gastos', form).then(
            function (result) {
                if(result.data['erro']){
                    alert("Não foi possivel registrar a transação");
                    var erros = result.data['erros'];
                    for(var key in erros){
                        alert("ERRO: " + key + ": " + erros[key]);
                    }
                }
                else{
                    alert("Transação registrada com sucesso");
                    $route.reload();
                }
                //console.log(result.data);
            },
            function (result) {
                alert("Houve uma falha durante o processamento");
                //console.log(result.data);
            }
        );
    }
});

var decimal = function () {
    var v = document.getElementById('valor');
    v.value = parseFloat(v.value).toFixed(2);
};