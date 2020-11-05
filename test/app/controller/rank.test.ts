import assert = require("power-assert");
import { app } from "midway-mock/bootstrap";
import { Connection, getConnection } from "typeorm";
import { Book } from "../../../src/app/entity";

let connection: Connection;

describe("test/app/controller/rank.test.ts", function () {
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

  it("GET /api/rank/types", async function () {
    const res = await app
      .httpRequest()
      .get("/api/rank/types")
      .expect(200)
      .expect("Content-Type", /json/);
    assert(res.body.length === 14);
    assert(res.body[0]["type_id"] === 0);
    assert(res.body[0]["type_name"] === "全部分类");
    assert(res.body[13]["type_id"] === 13);
    assert(res.body[13]["type_name"] === "灵异");
  });

  it("GET /api/rank/:type_id", async function () {
    const res1 = await app
      .httpRequest()
      .get("/api/rank/0?limit=20")
      .expect(200)
      .expect("Content-Type", /json/);
    assert(res1.body.length === 20);
    assert(res1.body[0]["type"] === "未分类");

    const res2 = await app
      .httpRequest()
      .get("/api/rank/1")
      .expect(200)
      .expect("Content-Type", /json/);
    assert(res2.body.length === 5);
    assert(res2.body[0]["type"] === "未分类");

  });

  it("GET /api/rank [Wrong Params]", async function () {
    await app
      .httpRequest()
      .get("/api/rank")
      .expect(404)
      .expect("Content-Type", /html/);
    await app
      .httpRequest()
      .get("/api/rank/0?limit=1")
      .expect(400)
      .expect("Content-Type", /json/);
  });

  after(async function () {
    await connection.dropDatabase();
  });
});
