const SERVER = "/api/";
var app = angular.module('cuga', ['ngRoute', 'ngCookies']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../views/main.html",
            controller: 'main'
        })
        .when("/usuario",{
            templateUrl: "../views/cadastroUsuario.html",
            controller: 'cadUser'
        })
        .when("/login", {
            templateUrl: "../views/login.html",
            controller: 'login'
        })
        .when("/home", {
            templateUrl: "../views/home.html",
            controller: 'home'
        })
        .when("/verReceitas", {
            templateUrl: "../views/receitas/verReceitas.html",
            controller: 'verReceitas'
        })
        .when("/verDespesas", {
            templateUrl: "../views/despesas/verDespesas.html",
            controller: 'verDespesas'
        });
});

app.controller('home', function ($scope, $route, $location, $cookies) {
    if($cookies.get("CUGALogin") === undefined){
        $location.path('/login');
    }
    $scope.verDespesas = function () {
        $location.path("/verDespesas")
    };
    $scope.verReceitas = function () {
        $location.path("/verReceitas")
    };
    $scope.novaDespesa = function () {
        $location.path("/novaDespesa")
    };
    $scope.novaReceita = function () {
        $location.path("/novaReceita")
    };
});

app.controller('footer', function ($scope, $http, $cookies) {
    var entradas, saidas;
    var getDespesas = function () {
        $http.get(SERVER + "buscas/despesas", {
            params: {
                inicio: data + "01",
                final: data + "31"
            }
        }).then(function (response) {
            if (!response.data['erro']) {
                var desp = response.data['despesas'];
                saidas = 0.0;
                desp.forEach(function (d) {
                    saidas += parseFloat(d.total);
                });
                getReceitas();
            }
        });
    };
    var getReceitas = function () {
        $http.get(SERVER + "buscas/receitas", {
            params: {
                inicio: data + "01",
                final: data + "31"
            }
        }).then(function (response) {
            if(!response.data['erro']){
                var rece = response.data['receitas'];
                entradas = 0.0;
                rece.forEach(function (d) {
                    entradas += parseFloat(d.valor);
                });
                setBal(entradas-saidas);
            }
        });
    };
    var setBal = function (value) {
        $scope.balanco = "Saldo: R$ " + value.toFixed(2);
    };
    if($cookies.get("CUGALogin") !== undefined){
        var data = new Date().toISOString().substring(0,8);
        $scope.referencia = "Referência: " + data.split("-")[1] + "/" + data.split("-")[0];
        getDespesas();
    }
    $scope.$on("updateFooter", function () {
        getDespesas();
    });
});

app.controller('verReceitas', function ($scope, $route, $http, $location, $cookies, $rootScope) {
    if($cookies.get("CUGALogin") === undefined){
        $location.path('/login');
    }
    $http.get(SERVER + "buscas/receitas", {
        params: {
            inicio: new Date().toISOString().substring(0,8)+"01",
            final: new Date().toISOString().substring(0,8)+"31"
        }
    }).then(
        function (response) {
            if(!response.data['erro']){
                var v = 0.0;
                $scope.dados = response.data['receitas'];
                $scope.dados.reverse();
                $scope.dados.forEach(function (dados) {
                    v += parseFloat(dados['valor']);
                    dados['data'] = dados['data'].split("-").reverse().join("/");
                    dados['valor'] = "R$ " + dados['valor'];
                });
                $scope.soma = "R$ " + v.toFixed(2);
                $scope.referencia = new Date().toISOString().substring(0,7).split("-").reverse().join("/");

            }
        }
    );
    $rootScope.$broadcast("updateFooter");
    $scope.remove = function (id) {
        var ans = confirm("Tem certeza que deseja excluir este registro?");
        if(ans){
            $http.delete(SERVER + "receitas/" + id).then(
                function (response) {
                    if(!response.data['erro']) {
                        alert("Registro excluido com sucesso!");
                        $route.reload();
                    }
                    else
                        alert("Não foi possivel excluir o registro");
                },
                function () {
                    alert("Não foi possivel excluir o registro");
                }
            );
        }
    };
    $scope.edit = function (id) {
        $scope.dados.forEach(function (dado) {
            if(dado['_id'] === id){
                $rootScope.$broadcast("updateReceita", dado);
            }
        });
    };
    $scope.clean = function () {
        $rootScope.$broadcast("cleanRecForm");
    };
    $scope.modal = function () {
        $(document).ready(function(){
            $('.modal').modal();
        });
    };
});

app.controller('cadReceitas', function ($scope, $route, $location, $http) {
    $scope.rec_id = false;
    $scope.cadReceita = function () {
        var dados = {
            origem: $scope.origem,
            repeticao: $scope.repeticao,
            valor: $scope.valor,
            data: $scope.data.toISOString().substring(0,10)
        };
        var catchResult = function (response){
            if (!response.data['erro']) {
                alert("Salvo com sucesso!");
                $('#cadReceita').modal('close');
                $route.reload();
            }
            else
                alert("Não foi possível atualizar a receita");
        };
        if($scope.rec_id !== false)
            $http.put(SERVER + "receitas/" + $scope.rec_id, dados).then(catchResult);
        else
            $http.post(SERVER + "receitas", dados).then(catchResult);

    };
    $scope.$on("updateReceita", function (evento, arg) {
        $scope.origem = arg['origem'];
        $scope.repeticao = arg['repeticao'];
        $scope.valor = parseFloat(arg['valor'].split(" ")[1]);
        var d = new Date(arg['data'].split("/").reverse().join("-"));
        d.setMinutes(d.getTimezoneOffset());
        $scope.data = d;
        $scope.rec_id = arg['_id'];
    });
    $scope.$on("cleanRecForm", function () {
        $scope.origem = $scope.repeticao = $scope.valor = undefined;
        $scope.data = new Date();
    })
});

app.controller('verDespesas', function ($scope, $route, $location, $http, $cookies, $rootScope) {
    if($cookies.get("CUGALogin") === undefined){
        $location.path('/login');
    }
    $http.get(SERVER + "buscas/despesas", {
        params: {
            inicio: new Date().toISOString().substring(0,8)+"01",
            final: new Date().toISOString().substring(0,8)+"31"
        }
    }).then(
        function (response) {
            if(!response.data['erro']) {
                var v = 0.0;
                $scope.referencia = new Date().toISOString().substring(0,7).split("-").reverse().join("/");
                $scope.dados = response.data['despesas'];
                $scope.dados.reverse();
                $scope.itens = $scope.dados['itens'];
                $scope.dados.forEach(function (dado) {
                    v += parseFloat(dado['total']);
                    dado['data'] = dado['data'].split("-").reverse().join("/");
                    dado['total'] = "R$ " + dado['total'];
                });
                $scope.soma = "R$ " + v.toFixed(2);
            }
        }
    );
    $rootScope.$broadcast("updateFooter");
    $scope.remove = function (id) {
        var ans = confirm("Tem certeza que deseja excluir este registro?");
        if(ans){
            $http.delete(SERVER + "despesas/" + id).then(
                function (response) {
                    if(!response.data['erro'])
                        alert("Registro excluido com sucesso!");
                    else
                        alert("Não foi possivel excluir o registro");
                },
                function () {
                    alert("Não foi possivel excluir o registro");
                }
            );
            $route.reload();
        }
    };
    $scope.edit = function (id) {
        $scope.dados.forEach(function (dado) {
            if(dado['_id'] === id){
                $rootScope.$broadcast("updateDespesa", dado);
            }
        });
    };
    $scope.modal = function () {
        $(document).ready(function(){
            $('.modal').modal();
        });
    };
    $scope.clean = function () {
        $rootScope.$broadcast("cleanDesForm");
    }
});

app.controller('cadDespesas', function ($scope, $route, $location, $http) {
    var locais = {};
    var cidades = {};
    var ids = gen();
    $scope.itens = [{id: ids.next().value.toString(), descricao: "", quantidade: 1, valor: 0, valort: ""}];
    $scope.total = 0.0;
    $scope.data = new Date();
    $scope.desp_id = false;
    $http.get(SERVER + "sugestoes/locais").then(
        function (response) {
            if(!response.data['erro']){
                response.data['locais'].forEach(function (local) {
                    locais[local] = null;
                });
            }
        }
    );
    $http.get(SERVER + "sugestoes/cidades").then(
        function (response) {
            if(!response.data['erro']){
                $scope.last_local = $scope.local = response.data['cidades'].length === 0 ? "" :
                    response.data['cidades'][response.data['cidades'].length-1];
                response.data['cidades'].forEach(function (cidade) {
                    cidades[cidade] = null;
                });
            }
        }
    );
    var result = function (result) {
        if (result.data['erro']) {
            alert("Não foi possível realizar a operacão");
        }
        else{
            alert("Despesa armazenada com sucesso");
            $('#cadDespesa').modal('close');
            $route.reload();
        }
    };

    $scope.newItem = function () {
        $scope.itens.push({id: ids.next().value.toString(), descricao: "", quantidade: 1, valor: 0, valort: ""});
    };
    $scope.remItem = function (id) {
	console.log(id);
        if($scope.itens.length > 1)
            $scope.itens.splice(id, 1);
        else
            alert("Deve haver pelo menos um item");
    };
    $scope.$on("cleanDesForm", function () {
        $scope.origem = $scope.repeticao = $scope.total = undefined;
        $scope.itens = [{id: ids.next().value.toString(), descricao: "", quantidade: 1, valor: 0, valort: ""}];
        $scope.data = new Date();
        $scope.local = $scope.last_local;
    });
    $scope.cadDespesa = function () {
        var form = {
            origem: $scope.origem,
            local: $scope.local,
            repeticao: $scope.repeticao,
            data: $scope.data.toISOString().substring(0,10),
            itens: $scope.itens,
            total: $scope.total.split(" ")[1]
        };
        console.log(form);
        if($scope.desp_id === false)
            $http.post(SERVER + "despesas", form).then(result);
        else
            $http.put(SERVER + "despesas/" + $scope.desp_id, form).then(result);
    };
    $scope.sum = function () {
        var t = 0;
        $scope.itens.forEach(function (item) {
            t += parseFloat(item['valort'].split(" ")[1]);
        });
        $scope.total = "R$ " + t.toFixed(2);
    };
    $scope.setOrigem = function (origem) {
        if(origem !== undefined)
            $scope.origem = origem;
    };
    $scope.load = function () {
        setTimeout(function () {
            $('#origem').autocomplete({
                data: locais,
                limit: 5,
                onAutocomplete: function (val) {
                    if(val !== undefined)
                        $scope.origem = clone(val);
                },
                minLength: 0
            });
            $('#local').autocomplete({
                data: cidades,
                limit: 5,
                onAutocomplete: function (val) {
                    if (val !== undefined)
                        $scope.local = clone(val);
                },
                minLength: 0
            });
        }, 1000);
    };
    $scope.$on("updateDespesa", function (event, arg){
        var d = new Date(arg['data'].split("/").reverse().join("-"));
        d.setMinutes(d.getTimezoneOffset());
        $scope.data = d;
        $scope.origem = arg['origem'];
        $scope.local = arg['local'];
        $scope.repeticao = arg['repeticao'];
        $scope.desp_id = arg['_id'];
        $scope.itens = arg['itens'];
        $scope.total = parseFloat(arg['total'].split(" ")[1]);
    });
});

app.controller('main', function ($scope, $route, $location, $cookies) {
    $scope.logado = $cookies.get("CUGALogin") !== undefined;
    $scope.home = function (){
        if($scope.logado)
            $location.path("/home");
        else
            $location.path("/");
    };
    $scope.login = function (){
        $location.path("/login");
    };

    $scope.logout = function () {
        $cookies.remove("CUGALogin");
        $scope.logado = false;
        location.reload();
    };
    $scope.verDespesas = function () {
        $location.path("/verDespesas")
    };
    $scope.verReceitas = function () {
        $location.path("/verReceitas")
    };
    $(document).ready(function(){
        $('.slider').slider();
        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrainWidth: false, // Does not change width of dropdown to that of the activator
                hover: true, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
                alignment: 'left', // Displays dropdown with edge aligned to the left of button
                stopPropagation: false // Stops event propagation
            }
        );
    });
});

app.controller('cadUser', function ($http, $scope, $route, $location, $cookies) {
    if ($cookies.get("CUGALogin") === undefined) {
        if ($location.path() !== "/usuario")
            $location.path('/login');
    }
    else {
        $location.path('/verDespesas');
    }
    $scope.cadUser = function () {
        var user = {
            "nome": $scope.nome,
            "login": $scope.user,
            "senha": $scope.senha
        };
        $http.post(SERVER + "usuarios", user).then(
            function (result) {
                //console.log(result);
                if (result.data['erro']) {
                    alert("Não foi possível cadastrar o usuário");
                    $route.reload();
                }
                else {
                    alert("Usuário cadastrado com sucesso");
                    $location.path('/login');
                }
            },
            function () {
                alert("Não foi possível cadastrar o usuário");
                $route.reload();
            }
        )

    };
});

app.controller('login', function ($http, $scope, $route, $location, $cookies) {
    if($cookies.get("CUGALogin") === undefined){
        if($location.path() !== "/usuario")
            $location.path('/login');
    }
    else{
        $location.path('/verDespesas');
    }
    $scope.login = function () {
        user = {
            "login": $scope.user,
            "senha": $scope.senha
        };
        $http.post(SERVER + "usuarios/login", user).then(
            function (result) {
                if (result.data['erro']){
                    alert("Não foi possível fazer o login");
                }
                else{
                    $cookies.put("CUGALogin", "");
                    location.reload();
                }
            },
            function () {
                alert("Não foi possível fazer o login!");
            }
        )
    };
    $scope.cadastro = function (){
        $location.path("/usuario");
    };
});

var decimal = function () {
    var v = document.getElementById('valor');
    var x = parseFloat(v.value);
    if(isNaN(x))
        v.value = "";
    else
        v.value = x.toFixed(2);
};

var gen = function* () {
    var index = 0;
    while(true)
        { //noinspection JSAnnotator
            yield index++;
        }
};

function clone(obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
