import assert = require("power-assert");
import { app } from "midway-mock/bootstrap";
import { Connection, getConnection } from "typeorm";
import { Book } from "../../../src/app/entity";

let connection: Connection;

describe("test/app/controller/search.test.ts", function () {
  before("", async function () {
    connection = getConnection();
    await connection.synchronize();
  });
  beforeEach("", async function () {
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
  it("GET /api/search?q=title", async function () {
    const res = await app
      .httpRequest()
      .get("/api/search?q=title")
      .expect(200)
      .expect("Content-Type", /json/);
    assert(res.body.title.length === 5);
    assert(res.body.author === null);

    const res2 = await app
      .httpRequest()
      .get("/api/search?q=author&limit=20")
      .expect(200)
      .expect("Content-Type", /json/);
    assert(res2.body.title === null);
    assert(res2.body.author.length === 20);

    const res3 = await app
      .httpRequest()
      .get("/api/search?q=t&limit=20")
      .expect(200)
      .expect("Content-Type", /json/);
    assert(res3.body.title.length === 20);
    assert(res3.body.author.length === 20);

    const res4 = await app
      .httpRequest()
      .get("/api/search?q=t&limit=20&offset=21")
      .expect(200)
      .expect("Content-Type", /json/);
    assert(res4.body.title === null);
    assert(res4.body.author === null);
  });
  it("GET /api/search [Wrong Params]", async function () {
    await app
      .httpRequest()
      .get("/api/search")
      .expect(400)
      .expect("Content-Type", /json/);

    await app
      .httpRequest()
      .get("/api/search?q=author&limit=21")
      .expect(400)
      .expect("Content-Type", /json/);

    await app
      .httpRequest()
      .get("/api/search?q=t&limit=20&offset=-1")
      .expect(400)
      .expect("Content-Type", /json/);
  });

  after(async function () {
    await connection.dropDatabase();
  });
});
