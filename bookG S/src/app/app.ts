import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  items: any[] = [];

  username = '';
  password = '';
  loggedIn = false;

  name = '';
  detail = '';
  category = '';
  value: number | null = null;
  status = 'Available';

  editId: number | null = null;
  selectedItem: any = null;

  searchName = '';
  searchDetail = '';
  filterStatus = 'All';
  sortBy = 'name';

  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  // LOGIN
  login() {
    this.http.post('http://localhost:3000/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.loggedIn = true;
        this.read();
        this.error = '';
      },
      error: () => this.error = 'Invalid username or password'
    });
  }

  // CREATE AND UPDATE
  save() {
    const item = {
      name: this.name,
      detail: this.detail,
      category: this.category,
      value: this.value,
      status: this.status
    };

    const request = this.editId
      ? this.http.put('http://localhost:3000/items/' + this.editId, item)
      : this.http.post('http://localhost:3000/items', item);

    request.subscribe({
      next: () => {
        this.read();
        this.clear();
      },
      error: () => this.error = 'Unable to save'
    });
  }

  // READ ALL
  read() {
    this.http.get<any[]>('http://localhost:3000/items')
      .subscribe({
        next: data => this.items = data,
        error: () => this.error = 'Unable to load data'
      });
  }

  // READ ONE
  readOne(id: number) {
    this.http.get<any>('http://localhost:3000/items/' + id)
      .subscribe(data => this.selectedItem = data);
  }

  // EDIT
  edit(item: any) {
    this.editId = item.id;
    this.name = item.name;
    this.detail = item.detail;
    this.category = item.category;
    this.value = item.value;
    this.status = item.status;
  }

  // DELETE
  delete(id: number) {
    this.http.delete('http://localhost:3000/items/' + id)
      .subscribe(() => this.read());
  }

  // CHANGE STATUS
  changeStatus(item: any) {
    const updatedItem = {
      name: item.name,
      detail: item.detail,
      category: item.category,
      value: item.value,
      status: item.status === 'Available' ? 'Issued' : 'Available'
    };

    this.http.put('http://localhost:3000/items/' + item.id, updatedItem)
      .subscribe(() => this.read());
  }

  // SEARCH, FILTER AND SORT
  get filteredItems() {
    return this.items
      .filter(item =>
        String(item.name || '').toLowerCase().includes(this.searchName.toLowerCase()) &&
        String(item.detail || '').toLowerCase().includes(this.searchDetail.toLowerCase()) &&
        (this.filterStatus === 'All' || item.status === this.filterStatus)
      )
      .sort((a, b) =>
        String(a[this.sortBy] || '').localeCompare(String(b[this.sortBy] || ''))
      );
  }

  // TOTAL VALUE
  get totalValue() {
    return this.items.reduce((sum, item) => sum + Number(item.value || 0), 0);
  }

  // CLEAR
  clear() {
    this.editId = null;
    this.name = '';
    this.detail = '';
    this.category = '';
    this.value = null;
    this.status = 'Available';
    this.error = '';
  }
}