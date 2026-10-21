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

  title = '';
  author = '';
  isbn = '';
  copies = 1;
  status = 'Available';

  searchTitle = '';
  searchAuthor = '';
  filterStatus = 'All';
  sortBy = 'author';

  editId: string | null = null;
  selectedBook: any = null;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBooks();
  }

  login() {
    this.http.post('http://localhost:3000/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.loggedIn = true;
        this.loadBooks();
      },
      error: () => alert('Invalid login')
    });
  }

  // READ ALL
  loadBooks() {
    this.http.get<any[]>('http://localhost:3000/books')
      .subscribe({
        next: data => this.books = data,
        error: () => this.error = 'Cannot load books'
      });
  }

  // ADD OR UPDATE
  saveBook() {
    if (!this.title.trim() || !this.author.trim()) {
      this.error = 'Title and author are required';
      return;
    }

    if (!/^\d{13}$/.test(this.isbn)) {
      this.error = 'ISBN must contain exactly 13 digits';
      return;
    }

    if (!Number.isInteger(Number(this.copies)) ||
        this.copies < 1 || this.copies > 100) {
      this.error = 'Copies must be between 1 and 100';
      return;
    }

    const book = {
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      copies: Number(this.copies),
      status: this.status
    };

    const request = this.editId
      ? this.http.put('http://localhost:3000/books/' + this.editId, book)
      : this.http.post('http://localhost:3000/books', book);

    request.subscribe({
      next: () => {
        this.loadBooks();
        this.clearForm();
      },
      error: () => this.error = 'Unable to save book'
    });
  }

  // READ ONE
  readBook(id: string) {
    this.http.get<any>('http://localhost:3000/books/' + id)
      .subscribe({
        next: book => this.selectedBook = book,
        error: () => this.error = 'Cannot read book'
      });
  }

  // EDIT
  editBook(b: any) {
    this.editId = b._id;
    this.title = b.title;
    this.author = b.author;
    this.isbn = b.isbn;
    this.copies = b.copies;
    this.status = b.status;
    this.error = '';
  }

  // DELETE
  deleteBook(id: string) {
    this.http.delete('http://localhost:3000/books/' + id)
      .subscribe({
        next: () => this.loadBooks(),
        error: () => this.error = 'Delete failed'
      });
  }

  // ISSUE OR RETURN
  changeStatus(b: any) {
    const book = {
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      copies: b.copies,
      status: b.status === 'Available' ? 'Issued' : 'Available'
    };

    this.http.put('http://localhost:3000/books/' + b._id, book)
      .subscribe(() => this.loadBooks());
  }

  // SEARCH, FILTER AND SORT
  get filteredBooks() {
    return this.books
      .filter(b =>
        b.title.toLowerCase().includes(this.searchTitle.toLowerCase()) &&
        b.author.toLowerCase().includes(this.searchAuthor.toLowerCase()) &&
        (this.filterStatus === 'All' || b.status === this.filterStatus)
      )
      .sort((a, b) =>
        String(a[this.sortBy]).localeCompare(String(b[this.sortBy]))
      );
  }

  // TOTAL COPIES
  get totalCopies() {
    return this.books.reduce((sum, b) => sum + Number(b.copies), 0);
  }

  // CLEAR FORM
  clearForm() {
    this.editId = null;
    this.title = '';
    this.author = '';
    this.isbn = '';
    this.copies = 1;
    this.status = 'Available';
    this.error = '';
  }
}