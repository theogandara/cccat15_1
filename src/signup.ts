import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from "./AccountDAO";

export default class Signup {
  constructor(readonly accountDAO: AccountDAO) {}

  async execute(input: any) {
    input.accountId = crypto.randomUUID();
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount) throw new Error("Email already in use");
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/))
      throw new Error("Name is invalid");
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Email is invalid");
    if (!validateCpf(input.cpf)) throw new Error("CPF is invalid");
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error("Car plate is invalid");
    await this.accountDAO.save(input);
    return {
      accountId: input.accountId,
    };
  }
}
