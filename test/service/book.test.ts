import { app, assert } from "midway-mock/bootstrap";
import { Connection, getConnection } from "typeorm";
import { Book } from "../../src/app/entity";
import { BookService } from "../../src/service/book";

let connection: Connection;
let bookService: BookService;
describe("test/service/book.test.ts", function () {
  before("", async function () {
    bookService = app.applicationContext.get<BookService>("bookService");
    connection = getConnection();
  });
  beforeEach("", async function () {
    await connection.synchronize();

    for (let i = 0; i < 20; i++) {
      await connection.getRepository(Book).insert(
        Book.bookFactory({
          title: "title_" + i,
          author: "author_" + i,
          coverImgLink: "coverImgLink_" + i,
          summary: "summary_" + i,
        })
      );
    }
  });

  it("should update recommendIndex twice", async function () {
    const res1 = await bookService.updateRecommendIndex();
    const res2 = await bookService.updateRecommendIndex();
    assert(res1 === res2);

    const findRes = await connection.getRepository(Book).findByIds([1]);
    assert(findRes[0].recommendIndex === 19); // 第一次被更新后等于1，第二次被更新后等于(1+17) +1 = 19
  });

  it("should get different recommended books", async function () {
    const res1 = await bookService.getRecommendBooks(5, 5);
    assert(res1[0].id === 6);
    await bookService.updateRecommendIndex();
    const res2 = await bookService.getRecommendBooks(5, 5);
    assert(res2[0].id === 6);
    await bookService.updateRecommendIndex();
    const res3 = await bookService.getRecommendBooks(5, 5);
    assert(res3[0].id === 8);
  });

  afterEach(async function () {
    await connection.dropDatabase();
  });
});
