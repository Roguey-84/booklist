class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  // Add book
  addBookToList(book) {
    const list = document.getElementById('book-list');

    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
  }

  // Show Alert
  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    // Get parent
    const container = document.querySelector('.container');
    // Get form
    const form = document.getElementById('book-form');

    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  // Delete book
  deleteBook(target) {
    if (target.classList.contains('delete')) {
      target.closest('tr').remove();
    }
  }

  // Clear fields
  clearFields() {
    document
      .querySelectorAll('#book-form input[type="text"]')
      .forEach((item) => {
        item.value = '';
      });
  }
}

// Local Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    const ui = new UI();
    books.forEach((book) => {
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static deleteBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, idx) => {
      if (isbn === book.isbn) {
        books.splice(idx, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event Listener on DOM load
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for adding a book
document.getElementById('book-form').addEventListener('submit', function (e) {
  // Get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  // Instantiate book
  const book = new Book(title, author, isbn);

  // Instatiate UI
  const ui = new UI();

  // Validate
  if (title === '' || author === '' || isbn === '') {
    // Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);

    // Add to LS
    Store.addBook(book);

    // Show successful alert
    ui.showAlert('Book Added!', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();
  ui.deleteBook(e.target);

  // Remove from LS
  Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Alert
  ui.showAlert('Book Deleted!', 'success');

  e.preventDefault();
});
