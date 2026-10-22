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

  books: any[] = [];

  username = '';
  password = '';
  loggedIn = false;

  name = '';
  detail = '';
  category = '';
  value: number | null = null;
  status = 'Available';

  editId = '';
  selectedBook: any = null;

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
      },
      error: () => this.error = 'Invalid username or password'
    });
  }

  // CREATE AND UPDATE
  save() {
    const book = {
      name: this.name,
      detail: this.detail,
      category: this.category,
      value: this.value,
      status: this.status
    };

    const request = this.editId
      ? this.http.put('http://localhost:3000/books/' + this.editId, book)
      : this.http.post('http://localhost:3000/books', book);

    request.subscribe({
      next: () => {
        this.read();
        this.clear();
      },
      error: () => this.error = 'Unable to save book'
    });
  }

  // READ ALL
  read() {
    this.http.get<any[]>('http://localhost:3000/books')
      .subscribe({
        next: data => this.books = data,
        error: () => this.error = 'Unable to load books'
      });
  }

  // READ ONE
  readOne(id: string) {
    this.http.get<any>('http://localhost:3000/books/' + id)
      .subscribe(data => this.selectedBook = data);
  }

  // EDIT
  edit(book: any) {
    this.editId = book._id;
    this.name = book.name;
    this.detail = book.detail;
    this.category = book.category;
    this.value = book.value;
    this.status = book.status;
  }

  // DELETE
  delete(id: string) {
    this.http.delete('http://localhost:3000/books/' + id)
      .subscribe(() => this.read());
  }

  // CHANGE STATUS
  changeStatus(book: any) {
    const updatedBook = {
      name: book.name,
      detail: book.detail,
      category: book.category,
      value: book.value,
      status: book.status === 'Available' ? 'Issued' : 'Available'
    };

    this.http.put('http://localhost:3000/books/' + book._id, updatedBook)
      .subscribe(() => this.read());
  }

  // SEARCH, FILTER AND SORT
  get filteredBooks() {
    return this.books
      .filter(b =>
        b.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
        b.detail.toLowerCase().includes(this.searchDetail.toLowerCase()) &&
        (this.filterStatus === 'All' || b.status === this.filterStatus)
      )
      .sort((a, b) =>
        String(a[this.sortBy]).localeCompare(String(b[this.sortBy]))
      );
  }

  // TOTAL BOOK VALUE
  get totalValue() {
    return this.books.reduce((sum, b) => sum + Number(b.value || 0), 0);
  }

  // CLEAR FORM
  clear() {
    this.editId = '';
    this.name = '';
    this.detail = '';
    this.category = '';
    this.value = null;
    this.status = 'Available';
    this.error = '';
  }
}