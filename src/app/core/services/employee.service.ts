import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Employee, EmployeeRole, TimeEntry } from '../../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiUrl = 'http://localhost:3000/employees';
    private timeEntriesUrl = 'http://localhost:3000/timeEntries';
    private employeesSubject = new BehaviorSubject<Employee[]>([]);
    public employees$ = this.employeesSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadEmployees();
    }

    loadEmployees(): void {
        this.http.get<Employee[]>(this.apiUrl).subscribe(
            employees => this.employeesSubject.next(employees)
        );
    }

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiUrl);
    }

    getEmployee(id: string): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${id}`);
    }

    createEmployee(employee: Partial<Employee>): Observable<Employee> {
        const newEmployee: Employee = {
            id: this.generateId(),
            firstName: employee.firstName || '',
            lastName: employee.lastName || '',
            email: employee.email || '',
            phone: employee.phone || '',
            role: employee.role || EmployeeRole.SERVER,
            hireDate: employee.hireDate || new Date(),
            salary: employee.salary || 0,
            schedule: employee.schedule || [],
            active: employee.active !== false
        };
        return this.http.post<Employee>(this.apiUrl, newEmployee).pipe(
            tap(() => this.loadEmployees())
        );
    }

    updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
        return this.http.patch<Employee>(`${this.apiUrl}/${id}`, employee).pipe(
            tap(() => this.loadEmployees())
        );
    }

    deleteEmployee(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.loadEmployees())
        );
    }

    // Time tracking
    clockIn(employeeId: string): Observable<TimeEntry> {
        const timeEntry: TimeEntry = {
            id: this.generateId(),
            employeeId,
            date: new Date(),
            clockIn: new Date()
        };
        return this.http.post<TimeEntry>(this.timeEntriesUrl, timeEntry);
    }

    clockOut(timeEntryId: string): Observable<TimeEntry> {
        const clockOut = new Date();
        return this.http.get<TimeEntry>(`${this.timeEntriesUrl}/${timeEntryId}`).pipe(
            tap(entry => {
                const clockIn = new Date(entry.clockIn);
                const hoursWorked = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
                this.http.patch<TimeEntry>(`${this.timeEntriesUrl}/${timeEntryId}`, {
                    clockOut,
                    hoursWorked: Math.round(hoursWorked * 100) / 100
                }).subscribe();
            })
        );
    }

    getTimeEntries(employeeId: string): Observable<TimeEntry[]> {
        return this.http.get<TimeEntry[]>(`${this.timeEntriesUrl}?employeeId=${employeeId}`);
    }

    private generateId(): string {
        return 'emp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}
