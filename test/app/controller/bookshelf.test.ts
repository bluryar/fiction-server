import assert = require("power-assert");
import { app } from "midway-mock/bootstrap";
import { Connection, getConnection } from "typeorm";
import { Book, Chapter } from "../../../src/app/entity";

let connection: Connection;

describe("test/app/controller/book.test.ts", function () {
  before("", async function () {
    connection = getConnection();
    await connection.synchronize();
  });
  beforeEach(async function () {
    let books: Book[] = [];
    for (let i = 0; i < 20; i++) {
      let book = Book.bookFactory({
        title: "title_" + i,
        author: "author_" + i,
        coverImgLink: "coverImgLink_" + i,
        summary: "summary_" + i,
      });
      books.push(book);
      await connection.getRepository(Book).insert(book);
    }
    for (let i = 0; i < 20; i++) {
      let chapter = new Chapter();
      chapter.book = books[0];
      chapter.content = Buffer.from(`content_${i})`);
      chapter.title = `title_${i}`;
      chapter.index = i;
      await connection.getRepository(Chapter).insert(chapter);
    }
  });
  it("GET /api/bookshelf/books", async function () {
    const res3 = await app
      .httpRequest()
      .get("/api/bookshelf/books")
      .send({ ids: [1, 2, 3] })
      .expect(200);
    assert(res3.body[0].id === 1);

    await app.httpRequest().get("/api/bookshelf/books").expect(400);
  });

  after(async function () {
    await connection.dropDatabase();
  });
});
