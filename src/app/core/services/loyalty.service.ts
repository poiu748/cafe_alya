import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoyaltyCard, LoyaltyTransaction } from '../../models/loyalty.model';

@Injectable({
    providedIn: 'root'
})
export class LoyaltyService {
    private apiUrl = 'http://localhost:3000/loyaltyCards';
    private transactionsUrl = 'http://localhost:3000/loyaltyTransactions';
    private cardsSubject = new BehaviorSubject<LoyaltyCard[]>([]);
    public cards$ = this.cardsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadCards();
    }

    loadCards(): void {
        this.http.get<LoyaltyCard[]>(this.apiUrl).subscribe(
            cards => this.cardsSubject.next(cards)
        );
    }

    getCards(): Observable<LoyaltyCard[]> {
        return this.http.get<LoyaltyCard[]>(this.apiUrl);
    }

    getCard(id: string): Observable<LoyaltyCard> {
        return this.http.get<LoyaltyCard>(`${this.apiUrl}/${id}`);
    }

    findCardByPhone(phone: string): Observable<LoyaltyCard[]> {
        return this.http.get<LoyaltyCard[]>(`${this.apiUrl}?customerPhone=${phone}`);
    }

    createCard(card: Partial<LoyaltyCard>): Observable<LoyaltyCard> {
        const newCard: LoyaltyCard = {
            id: this.generateId(),
            customerId: this.generateId(),
            customerName: card.customerName || '',
            customerEmail: card.customerEmail || '',
            customerPhone: card.customerPhone || '',
            points: 0,
            totalSpent: 0,
            joinDate: new Date(),
            lastVisit: new Date(),
            tier: 'bronze'
        };
        return this.http.post<LoyaltyCard>(this.apiUrl, newCard).pipe(
            tap(() => this.loadCards())
        );
    }

    addPoints(cardId: string, orderId: string, amount: number): Observable<LoyaltyCard> {
        return this.getCard(cardId).pipe(
            tap(card => {
                const pointsEarned = Math.floor(amount); // 1 point per dollar
                const newPoints = card.points + pointsEarned;
                const newTotalSpent = card.totalSpent + amount;
                const tier = this.calculateTier(newTotalSpent);

                this.http.patch<LoyaltyCard>(`${this.apiUrl}/${cardId}`, {
                    points: newPoints,
                    totalSpent: newTotalSpent,
                    lastVisit: new Date(),
                    tier
                }).subscribe(() => this.loadCards());

                const transaction: LoyaltyTransaction = {
                    id: this.generateId(),
                    cardId,
                    orderId,
                    pointsEarned,
                    amount,
                    date: new Date()
                };
                this.http.post(this.transactionsUrl, transaction).subscribe();
            })
        );
    }

    redeemPoints(cardId: string, points: number): Observable<LoyaltyCard> {
        return this.getCard(cardId).pipe(
            tap(card => {
                const newPoints = Math.max(0, card.points - points);
                this.http.patch<LoyaltyCard>(`${this.apiUrl}/${cardId}`, {
                    points: newPoints
                }).subscribe(() => this.loadCards());
            })
        );
    }

    private calculateTier(totalSpent: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
        if (totalSpent >= 1000) return 'platinum';
        if (totalSpent >= 500) return 'gold';
        if (totalSpent >= 200) return 'silver';
        return 'bronze';
    }

    private generateId(): string {
        return 'loy-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}
