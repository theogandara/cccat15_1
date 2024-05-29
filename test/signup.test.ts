import AccountDAODatabase, { AccountDAOInMemory } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  signup = new Signup(accountDAO);
  getAccount = new GetAccount(accountDAO);
});

test("Create passegners account", async function () {
  const input = {
    name: "Jhon Doe",
    email: `john.doe.${Math.random()}@example.com`,
    cpf: "123.456.789-09",
    isPassenger: true,
  };
  const result = await signup.execute(input);
  expect(result).toBeDefined();
  const outputGetAccount = await getAccount.execute(result.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test("Create driver account", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe.${Math.random()}@example.com`,
    cpf: "123.456.789-09",
    isDriver: true,
    carPlate: "ABC1234",
  };

  const result = await signup.execute(input);
  expect(result).toBeDefined();
  const outputGetAccount = await getAccount.execute(result.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.is_driver).toBe(input.isDriver);
  expect(outputGetAccount.car_plate).toBe(input.carPlate);
});

test("Return error when CPF is invalid", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe.${Math.random()}@example.com`,
    cpf: "09",
    isPassenger: true,
  };

  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("CPF is invalid")
  );
});

test("Return error when email is invalid", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe.${Math.random()}`,
    cpf: "123.456.789-09",
    isPassenger: true,
  };

  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Email is invalid")
  );
});

test("Return error when NAME is invalid", async function () {
  const input = {
    name: "",
    email: `john.doe.${Math.random()}`,
    cpf: "123.456.789-09",
    isPassenger: true,
  };

  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Name is invalid")
  );
});

test("Return error when user already exists", async function () {
  const email = `john.doe.${Math.random()}@example.com`;
  const input = {
    email,
    name: "John Doe",
    cpf: "123.456.789-09",
    isPassenger: true,
  };

  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Email already in use")
  );
});

test("Return error when CAR_PLATE is invalid", async function () {
  const input = {
    email: `john.doe.${Math.random()}@example.com`,
    name: "John Doe",
    cpf: "123.456.789-09",
    isDriver: true,
    carPlate: "1234",
  };

  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Car plate is invalid")
  );
});
