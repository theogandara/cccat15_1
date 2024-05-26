import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

export async function signup(input: any): Promise<any> {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const id = crypto.randomUUID();
    const [existingAccount] = await connection.query(
      "select * from cccat15.account where email = $1",
      [input.email]
    );
    if (existingAccount) throw new Error("Email already in use");
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/))
      throw new Error("Name is invalid");
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Email is invalid");
    if (!validateCpf(input.cpf)) throw new Error("CPF is invalid");
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error("Car plate is invalid");
    await connection.query(
      "insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        id,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        !!input.isPassenger,
        !!input.isDriver,
      ]
    );
    return {
      accountId: id,
    };
  } finally {
    await connection.$pool.end();
  }
}
