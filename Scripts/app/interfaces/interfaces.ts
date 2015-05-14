/// <reference path="../_references.ts" />

module cartwizard {
    
    export interface IAppViewModelScope<T> extends ng.IScope {
        vm: T;
    }

    export interface IStorage {
        SetProduct(Product): Product;
        SetUser(User): User;
        SetCard(Card): Card;
        GetOrder(): Order;
    }

}