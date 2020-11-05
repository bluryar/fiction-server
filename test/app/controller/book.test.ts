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
  it("GET /api/book/1", async function () {
    const res = await app
      .httpRequest()
      .get("/api/book/1")
      .expect(200)
      .expect("Content-Type", /json/);
    assert(res.body.id === 1);
    assert(res.body.chaptersNum === 20);

    const res2 = await app
      .httpRequest()
      .get("/api/book/2")
      .expect(200)
      .expect("Content-Type", /json/);
    assert(res2.body.id === 2);
    assert(res2.body.chaptersNum === 0);

    await app.httpRequest().get("/api/book/21").expect(204);
  });

  after(async function () {
    await connection.dropDatabase();
  });
});
