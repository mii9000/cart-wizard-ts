/// <reference path="../_references.ts" />

module cartwizard {
    'use strict';

    export class Product {

        public ProductId: number;
        public Name: string;
        public ProductPrice: number;
        public PriceTimePeriod: string;
        public CurrencySymbol: string;
        public ProductBackgroundColor: string;
        public MaxPurchasableAmount: number;
        public Image: string;
        public ProductItems: Array<ProductItem>;
        public ProductQuantity: number;
    }


    export class ProductItem {

        public ProductItemName: string;
        public Amount: number;

    }


    export class User {

        public Email: string;
        public Password: string;

    }


    export class Card {

        public Month: number;
        public Year: number;
        public CardNumber: string;
        public CVC: string;

    }


    export class Order {

        public Product: Product;
        public User: User;
        public Card: Card;

    }


    export class CartData {

        public CompanyName: string;
        public Products: Array<Product>;
    }
}