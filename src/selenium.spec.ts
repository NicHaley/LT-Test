import webdriver, { until, By, WebElement } from "selenium-webdriver";
import * as childProcess from "child_process";
import dotenv from "dotenv";

dotenv.config();

// username: Username can be found at automation dashboard
const USERNAME = process.env.LAMBDA_TEST_USER;

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LAMBDA_TEST_KEY;

// gridUrl: gridUrl can be found at automation dashboard
const GRID_HOST = "hub.lambdatest.com/wd/hub";

const gridUrl = `https://${USERNAME}:${KEY}@${GRID_HOST}`;

const commitHash = childProcess.execSync("git rev-parse --short HEAD").toString().trim();

const capabilities = {
  platform: "windows 10",
  browserName: "chrome",
  version: "67.0",
  resolution: "1024x768",
  tunnel: true,
  network: false,
  visual: true,
  console: true,
  video: true,
  name: "Selenium Tests",
  acceptSslCerts: true,
  build: `Chat - ${commitHash}`
};

const DEFAULT_TIMEOUT = 60000;
jest.setTimeout(DEFAULT_TIMEOUT);

const getElementById = async (
  driver: webdriver.ThenableWebDriver, id: string
): Promise<WebElement> => {
  const el = await driver.wait(until.elementLocated(By.id(id)), DEFAULT_TIMEOUT);

  return driver.wait(until.elementIsVisible(el), DEFAULT_TIMEOUT);
};

describe("run a test", () => {
  let driver: webdriver.ThenableWebDriver;

  beforeAll(async () => {
    driver = new webdriver.Builder()
      .usingServer(gridUrl)
      .withCapabilities(capabilities)
      .build();

    await driver.get("http://localhost:8080/");
  }, DEFAULT_TIMEOUT);

  afterAll(async () => {
    await driver.quit();
  }, DEFAULT_TIMEOUT);

  it("SHOULD load and render the UI with standard elements", async () => {
    const messageList = await getElementById(driver, "messages-list");
    const inputBar = await getElementById(driver, "input-bar");

    expect(messageList).not.toBeNull();
    expect(inputBar).not.toBeNull();
  });
});
