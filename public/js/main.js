const SERVER = "http://localhost:8080/";

var app = angular.module('cuga', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../main.html",
            controller: 'corpo'
        })
        .when("/nova",{
            templateUrl: "../nova_transacao.html",
            controller: 'novaTransacao'
        });
});

app.controller('corpo', function($scope, $route, $routeParams, $location) {
    $scope.newTrans = function (){
        $location.path("/nova");
    };
    $scope.home = function (){
        $location.path("/");
    };
});

app.controller('novaTransacao', function($scope, $route, $routeParams, $location, $http) {
    $scope.$watch('adesao', function() {
        $scope.ch_adesao = $scope.adesao == 'fixa' ? true : false;
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

var decimal = function () {
    var v = document.getElementById('valor');
    v.value = parseFloat(v.value).toFixed(2);
};