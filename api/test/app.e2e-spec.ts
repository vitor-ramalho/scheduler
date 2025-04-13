import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { bootstrap } from "../src/main";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await bootstrap();
  });

  it("should initialize the application", async () => {
    expect(app).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
