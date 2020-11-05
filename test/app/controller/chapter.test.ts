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
      chapter.content = Buffer.from(`content_${i}`);
      chapter.title = `title_${i}`;
      chapter.index = i;
      chapter = Chapter.gzipChapterContent(chapter);
      await connection.getRepository(Chapter).insert(chapter);
    }
  });

  it("GET /api/chapter?book_id", async function () {
    const res = await app.httpRequest().get("/api/chapter?book_id=1");
    assert(res.status === 200);
    assert(res.body.length === 5);

    await app.httpRequest().get("/api/chapter?book_id=21").expect(204);

    await app
      .httpRequest()
      .get("/api/chapter?book_id=-1")
      .expect(400)
      .expect("Content-Type", /json/);
  });

  it("GET /api/chapter/:chapter_index?book_id=xxx", async function () {
    const res = await app.httpRequest().get("/api/chapter/1?book_id=1");
    assert(res.status === 200);
    assert(res.body.content === "content_1");

    await app.httpRequest().get("/api/chapter/1?book_id=41").expect(204);

    await app
      .httpRequest()
      .get("/api/chapter/51?book_id=1")
      .expect(204)
    await app
      .httpRequest()
      .get("/api/chapter/51?book_id=-1")
      .expect(400)
  });

  after(async function () {
    await connection.dropDatabase();
  });
});
