import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product, ProductCategory } from '../../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3000/products';
    private productsSubject = new BehaviorSubject<Product[]>([]);
    public products$ = this.productsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadProducts();
    }

    loadProducts(): void {
        this.http.get<Product[]>(this.apiUrl).subscribe(
            products => this.productsSubject.next(products)
        );
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    getProductsByCategory(category: ProductCategory): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`);
    }

    createProduct(product: Partial<Product>): Observable<Product> {
        const newProduct: Product = {
            id: this.generateId(),
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            category: product.category || ProductCategory.OTHER,
            imageUrl: product.imageUrl || '',
            available: product.available !== false,
            promotion: product.promotion,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return this.http.post<Product>(this.apiUrl, newProduct).pipe(
            tap(() => this.loadProducts())
        );
    }

    updateProduct(id: string, product: Partial<Product>): Observable<Product> {
        const updatedProduct = { ...product, updatedAt: new Date() };
        return this.http.patch<Product>(`${this.apiUrl}/${id}`, updatedProduct).pipe(
            tap(() => this.loadProducts())
        );
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.loadProducts())
        );
    }

    private generateId(): string {
        return 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}
