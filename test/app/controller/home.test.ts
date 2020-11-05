import { app, assert } from "midway-mock/bootstrap";
import { Connection, getConnection } from "typeorm";
import { Book } from "../../../src/app/entity";

let connection: Connection;

describe("test/app/controller/home.test.ts", function () {
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
  it("GET /api/index?limit=XX&offset=XX return STATUS_CODE=200 and JSON-array", function () {
    return app
      .httpRequest()
      .get("/api/index?limit=5&offset=1")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        assert(res.body.length === 5);
      });
  });

  it("GET /api/index?limit=4 return STATUS_CODE=400", function () {
    return app.httpRequest().get("/api/index?limit=4").expect(400);
  });

  after(async function () {
    await connection.dropDatabase();
  });
});
