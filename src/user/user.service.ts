import fs from "fs";

export const addUser = (password: string, username: string) => {
  if (!password || !username) throw Error("Password or username is missing");

  let DB_data: Record<string, string> = {};

  if (fs.existsSync("DB.json")) {
    DB_data = JSON.parse(fs.readFileSync("DB.json", { encoding: "utf-8" }));
  }

  DB_data[username] = password;

  fs.writeFileSync("DB.json", JSON.stringify(DB_data));

  return { user: username };
};

export const checkUser = (password: string, username: string) => {
  if (!password || !username) throw Error("Password or username is missing");
  if (!fs.existsSync("DB.json")) throw Error("DB does not exist, register someone first");

  let DB_data: Record<string, string> = JSON.parse(
    fs.readFileSync("DB.json", { encoding: "utf-8" })
  );

  const isUser = password === DB_data[username];

  return { credentials: isUser };
};

export const getUsers = () => {
  if (!fs.existsSync("DB.json")) throw Error("DB does not exist, register someone first");
  return fs.readFileSync("DB.json", { encoding: "utf-8" });
};
