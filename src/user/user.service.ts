import fs from "fs";

// interface UserService {
//   getUsers: () => Record<string, string>;
//   addUser: (password: string, username: string) => Promise<{ user: string; err: string }>;
//   checkUser: (password: string, username: string) => Promise<{ credentials: boolean; err: string }>;
// }

export abstract class UserService /* implements UserService */ {
  // users
  public static async getUsers() {
    if (!fs.existsSync("DB.json"))
      return { data: {}, err: "DB does not exist, register someone first" };

    const jsonDB: Record<string, string> = JSON.parse(
      fs.readFileSync("DB.json", { encoding: "utf-8" })
    );

    return jsonDB;
  }

  // login
  public static async addUser(password: string, username: string) {
    if (!password || !username) return { user: "", err: "Password or username is missing" };

    if (!fs.existsSync("DB.json")) {
      await fs.promises.writeFile("DB.json", JSON.stringify({ [username]: password }));
      return { user: username, err: "" };
    }

    let DB_data: Record<string, string> = await fs.promises
      .readFile("DB.json")
      .then((res) => JSON.parse(res.toString()));
    // .catch(() => ({ user: "", err: "Corrupted data" }));

    DB_data[username] = password;
    console.log(DB_data);

    await fs.promises.writeFile("DB.json", JSON.stringify(DB_data));
    return { user: username, err: "" };
  }

  // register
  public static async checkUser(password: string, username: string) {
    if (!password || !username)
      return { credentials: false, err: "Password or username is missing" };
    if (!fs.existsSync("DB.json"))
      return { credentials: true, err: "DB does not exist, register someone first" };

    // может тут поломаться на парсе
    let DB_data: Record<string, string> = JSON.parse(
      fs.readFileSync("DB.json", { encoding: "utf-8" })
    );

    return { credentials: password === DB_data[username], err: "" };
  }
}
