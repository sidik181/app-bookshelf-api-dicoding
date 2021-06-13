/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

// handler menambahkan buku yang diinput user
const addBookHandler = (request, h) => {
  const id = nanoid(16);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // memeriksa inputan user: jika nama kosong, akan merespon gagal
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // memeriksa inputan user: jika menginput halaman baca melebihi halaman buku, respon gagal
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  // cek apakah buku berhasil ditambahkan berdasarkan id buku
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// handler menampilkan semua buku yang sudah ditambahkan
const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  let bookFilter = books;
  if (name !== undefined) {
    bookFilter = bookFilter.filter((book) => book.name.toLowerCase(). includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    bookFilter = bookFilter.filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    bookFilter = bookFilter.filter((book) => book.finished === (finished === '1'));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookFilter.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  return response;
};

// const getAllBooksHandler = () => ({
//   status: 'success',
//   data: {
//     books: books.map((book) => ({
//       id: book.id,
//       name: book.name,
//       publisher: book.publisher,
//     })),
//   },
// });

// handler menampilkan detail buku yang dipilih
const getBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const book = books.filter((n) => n.id === id)[0];

  // cek pastikan objek buku tidak bernilai undefined
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler mengedit buku
const editBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // memeriksa inputan user: jika nama kosong, akan merespon gagal
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // memeriksa inputan user: jika menginput halaman baca melebihi halaman buku, respon gagal

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler delete buku
const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
