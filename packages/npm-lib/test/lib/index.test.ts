import { loadEnvxFromString } from "../../src/core";

describe("envx", () => {
  it("should parse valid envx content", () => {
    const content = `
      DEV_MODE=false

API_URL=\${DEV_MODE} ? "http://localhost:3000" : "https://api.example.com"
API_TOKEN=\${DEV_MODE} ? "dev-token" : "prod-token"
FULL_API_URL="\${API_URL}?token=\${API_TOKEN}&env=\${NODE_ENV}"

PORT=8080
DATABASE_NAME="db"
MULTILINE_EXAMPLE="""
HELLOOOOOOOO
I am .ENVX the best .env alternative, now you understand me!
"""

WEBSITE_URL="https://movixar.com"
 
# schema herzaman en alta yazılır
[DEV_MODE]
type="boolean"

[PORT]  
type="number"
required=true
description="PORT number"

# hata vericek çünkü required ve yok ayrıca deprecated oldugu için uyarı mesajı bulunmakta :)
[WEBSITE_URL]
type="url"
required = true
deprecated=true

[NODE_ENV]
type="enum"
values=["production", "development", "test"]
default="development"
required=true
# deprecated=true

# required olmasına ve envx dosyası içinde argumanı olmamasına ragmen hata vermiyecek çunku default value belirlenmiş :)
[ANY_ARG2]
type="string"
default="any value"
required=true
    `;

    const { result, schema } = loadEnvxFromString(content);

    expect(result["PORT"]).toEqual(8080);
    expect(result["ANY_ARG2"]).toEqual("any value");

    expect(schema?.["ANY_ARG2"].type).toEqual("string");
    expect(schema?.["WEBSITE_URL"].type).toEqual("url");

    expect(schema?.["NODE_ENV"].default).toEqual("development");
    expect(schema?.["NODE_ENV"].values).toEqual([
      "production",
      "development",
      "test",
    ]);
    expect(schema?.["NODE_ENV"].values).toContain("production");
    expect(schema?.["NODE_ENV"].values).toContain("test");
  });
});
