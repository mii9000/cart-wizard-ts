/// <reference path="_references.ts" />


module cartwizard {
        
    'use strict';

    export class Config {

        static $inject = ['$stateProvider', '$urlRouterProvider'];

        constructor($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
            $stateProvider
                .state('product', {
                url: '/',
                templateUrl: 'partials/home.html',
                controller: 'ProductController'
            })
                .state('cart', {
                url: '/',
                templateUrl: 'partials/cart.html',
                controller: 'CartController'
            })
                .state('login', {
                url: '/',
                templateUrl: 'partials/login.html',
                controller: 'LoginController'
            })
                .state('card', {
                url: '/',
                templateUrl: 'partials/card.html',
                controller: 'CardController'
            });

            $urlRouterProvider.otherwise('/');
        }
    }

    export class Storage {

        private Order: Order;

        constructor() {
            this.Order = new Order();
        }

        SetProduct(product: Product): void {
            this.Order.Product = product;
        }

        SetUser(user: User): void {
            this.Order.User = user;
        }

        SetCard(card: Card): void {
            this.Order.Card = card;
        }

        GetOrder(): Order {
            return this.Order;
        }

        public static StorageFactory() {
            return new Storage();
        }

    }

    export class DataController {

        private $scope: IAppViewModelScope<DataController>;
        private storage: IStorage;
        static $inject = ['$scope', 'Storage'];

        constructor($scope: IAppViewModelScope<DataController>, storage: IStorage) {
            this.$scope = $scope;
            this.storage = storage;
            this.$scope.vm = this;
        }

        GetOrder(): Order {
            return this.storage.GetOrder();
        }

    }

    export class ProductController {

        private $scope: IAppViewModelScope<ProductController>;
        private $http: ng.IHttpService;
        private $state: ng.ui.IStateService;
        private Storage: IStorage;
        static $inject = ['$scope', '$http', '$state', 'Storage'];

        private CompanyName: string;
        private Products: Array<Product>;
        private ProductItems: Array<ProductItem>;

        constructor($scope: IAppViewModelScope<ProductController>, $http: ng.IHttpService, $state: ng.ui.IStateService, Storage: IStorage) {
            this.$scope = $scope;
            this.$http = $http;
            this.$state = $state;
            this.Storage = Storage;
            this.$scope.vm = this;

            this.Products = new Array<Product>();
            this.ProductItems = new Array<ProductItem>();

            this.$http.get('data/products.json').success((data: CartData, status) => {
                
                for (var i = 0; i < data.Products.length; i++) {
                    data.Products[i].ProductQuantity = 1;
                }

                this.CompanyName = data.CompanyName;
                this.Products = data.Products;

                var firstProduct = this.Products[0];
                for (var i = 0; i < firstProduct.ProductItems.length; i++) {
                    var pi: ProductItem = { ProductItemName: firstProduct.ProductItems[i].ProductItemName, Amount : 0 };
                    this.ProductItems.push(pi);
                }
            });
        }
        
        GetCompanyName(): string {
            return this.CompanyName;
        }

        GetProducts(): Array<Product> {
            return this.Products;
        }

        GetProductItems(): Array<ProductItem> {
            return this.ProductItems;
        }

        Select(product: Product): void {
            this.Storage.SetProduct(product);
            this.$state.go('cart');
        }
    }

    export class CartController {

        private $scope: IAppViewModelScope<CartController>;
        private $state: ng.ui.IStateService;
        private Storage: IStorage;
        private Product: Product;
        static $inject = ['$scope', '$state', 'Storage'];
        

        constructor($scope: IAppViewModelScope<CartController>, $state: ng.ui.IStateService, Storage: IStorage) {
            this.$scope = $scope;
            this.$state = $state;
            this.Storage = Storage;
            this.Product = Storage.GetOrder().Product;
            this.$scope.vm = this;
        }

        GetSelectedProduct(): Product {
            return this.Product;
        }
    }

    export class LoginController {

        private $scope: IAppViewModelScope<LoginController>;
        private $state: ng.ui.IStateService;
        private Storage: IStorage;

        public User: User;
        static $inject = ['$scope', '$state', 'Storage'];

        constructor($scope: IAppViewModelScope<LoginController>, $state: ng.ui.IStateService, Storage: IStorage) {
            this.$scope = $scope;
            this.$state = $state;
            this.Storage = Storage;
            this.User = { Email : '', Password: '' };
            this.$scope.vm = this;
        }

        Login(IsValid: boolean): void {
            if (IsValid) {
                this.Storage.SetUser(this.$scope.vm.User);
                this.$state.go('card');
            }
        }

    }
    
    export class CardController {

        private $scope: IAppViewModelScope<CardController>;
        private $state: ng.ui.IStateService;
        private Storage: IStorage;
        private $modal: ng.ui.bootstrap.IModalService;
        private $timeout: ng.ITimeoutService;

        public IsPaying: boolean;
        static $inject = ['$scope', '$state', 'Storage', '$modal', '$timeout'];

        constructor($scope: IAppViewModelScope<CardController>, $state: ng.ui.IStateService, Storage: IStorage, $modal: ng.ui.bootstrap.IModalService, $timeout: ng.ITimeoutService) {
            this.$scope = $scope;
            this.$state = $state;
            this.Storage = Storage;
            this.$modal = $modal;
            this.$timeout = $timeout;
            this.IsPaying = false;
            this.$scope.vm = this;
        }

        Pay(card: Card): void {
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
        }

    }

    var app = angular.module('cart-wizard', ['ui.router', 'ui.bootstrap', 'ngAnimate']);
    app.config(Config);
    app.factory('Storage', Storage.StorageFactory);
    app.controller('DataController', DataController);
    app.controller('ProductController', ProductController);
    app.controller('CartController', CartController);
    app.controller('LoginController', LoginController);
    app.controller('CardController', CardController);
}