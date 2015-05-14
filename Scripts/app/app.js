/// <reference path="_references.ts" />
var cartwizard;
(function (cartwizard) {
    'use strict';
    var Config = (function () {
        function Config($stateProvider, $urlRouterProvider) {
            $stateProvider.state('product', {
                url: '/',
                templateUrl: 'partials/home.html',
                controller: 'ProductController'
            }).state('cart', {
                url: '/',
                templateUrl: 'partials/cart.html',
                controller: 'CartController'
            }).state('login', {
                url: '/',
                templateUrl: 'partials/login.html',
                controller: 'LoginController'
            }).state('card', {
                url: '/',
                templateUrl: 'partials/card.html',
                controller: 'CardController'
            });
            $urlRouterProvider.otherwise('/');
        }
        Config.$inject = ['$stateProvider', '$urlRouterProvider'];
        return Config;
    })();
    cartwizard.Config = Config;
    var Storage = (function () {
        function Storage() {
            this.Order = new cartwizard.Order();
        }
        Storage.prototype.SetProduct = function (product) {
            this.Order.Product = product;
        };
        Storage.prototype.SetUser = function (user) {
            this.Order.User = user;
        };
        Storage.prototype.SetCard = function (card) {
            this.Order.Card = card;
        };
        Storage.prototype.GetOrder = function () {
            return this.Order;
        };
        Storage.StorageFactory = function () {
            return new Storage();
        };
        return Storage;
    })();
    cartwizard.Storage = Storage;
    var DataController = (function () {
        function DataController($scope, storage) {
            this.$scope = $scope;
            this.storage = storage;
            this.$scope.vm = this;
        }
        DataController.prototype.GetOrder = function () {
            return this.storage.GetOrder();
        };
        DataController.$inject = ['$scope', 'Storage'];
        return DataController;
    })();
    cartwizard.DataController = DataController;
    var ProductController = (function () {
        function ProductController($scope, $http, $state, Storage) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$state = $state;
            this.Storage = Storage;
            this.$scope.vm = this;
            this.Products = new Array();
            this.ProductItems = new Array();
            this.$http.get('data/products.json').success(function (data, status) {
                for (var i = 0; i < data.Products.length; i++) {
                    data.Products[i].ProductQuantity = 1;
                }
                _this.CompanyName = data.CompanyName;
                _this.Products = data.Products;
                var firstProduct = _this.Products[0];
                for (var i = 0; i < firstProduct.ProductItems.length; i++) {
                    var pi = { ProductItemName: firstProduct.ProductItems[i].ProductItemName, Amount: 0 };
                    _this.ProductItems.push(pi);
                }
            });
        }
        ProductController.prototype.GetCompanyName = function () {
            return this.CompanyName;
        };
        ProductController.prototype.GetProducts = function () {
            return this.Products;
        };
        ProductController.prototype.GetProductItems = function () {
            return this.ProductItems;
        };
        ProductController.prototype.Select = function (product) {
            this.Storage.SetProduct(product);
            this.$state.go('cart');
        };
        ProductController.$inject = ['$scope', '$http', '$state', 'Storage'];
        return ProductController;
    })();
    cartwizard.ProductController = ProductController;
    var CartController = (function () {
        function CartController($scope, $state, Storage) {
            this.$scope = $scope;
            this.$state = $state;
            this.Storage = Storage;
            this.Product = Storage.GetOrder().Product;
            this.$scope.vm = this;
        }
        CartController.prototype.GetSelectedProduct = function () {
            return this.Product;
        };
        CartController.$inject = ['$scope', '$state', 'Storage'];
        return CartController;
    })();
    cartwizard.CartController = CartController;
    var LoginController = (function () {
        function LoginController($scope, $state, Storage) {
            this.$scope = $scope;
            this.$state = $state;
            this.Storage = Storage;
            this.User = { Email: '', Password: '' };
            this.$scope.vm = this;
        }
        LoginController.prototype.Login = function (IsValid) {
            if (IsValid) {
                this.Storage.SetUser(this.$scope.vm.User);
                this.$state.go('card');
            }
        };
        LoginController.$inject = ['$scope', '$state', 'Storage'];
        return LoginController;
    })();
    cartwizard.LoginController = LoginController;
    var CardController = (function () {
        function CardController($scope, $state, Storage, $modal, $timeout) {
            this.$scope = $scope;
            this.$state = $state;
            this.Storage = Storage;
            this.$modal = $modal;
            this.$timeout = $timeout;
            this.IsPaying = false;
            this.$scope.vm = this;
        }
        CardController.prototype.Pay = function (card) {
            this.IsPaying = true;
            this.Storage.SetCard(card);
            var self = this;
            this.$timeout(function () {
                //'this' will not be pointing to controller inside here
                self.IsPaying = false;
                self.$modal.open({
                    template: '<div class="modal-body"><h4>Congratulations! You just bought a car!</h4></div><div class="modal-footer"><button class="btn btn-primary" ng-click="$parent.$close()">OK</button></div>'
                });
            }, 2000);
        };
        CardController.$inject = ['$scope', '$state', 'Storage', '$modal', '$timeout'];
        return CardController;
    })();
    cartwizard.CardController = CardController;
    var app = angular.module('cart-wizard', ['ui.router', 'ui.bootstrap', 'ngAnimate']);
    app.config(Config);
    app.factory('Storage', Storage.StorageFactory);
    app.controller('DataController', DataController);
    app.controller('ProductController', ProductController);
    app.controller('CartController', CartController);
    app.controller('LoginController', LoginController);
    app.controller('CardController', CardController);
})(cartwizard || (cartwizard = {}));
//# sourceMappingURL=app.js.map