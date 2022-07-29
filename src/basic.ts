let id: number | string = 10;
let company: string = "Apple";
let x: any = "Hello";

x = 8;
const arr = ["Mina", 7];
// arr.push(true);

const user = { id: 1, name: "John" };

type User = { id: number; name: string };
type PID = string | number;

function func(id: PID) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  }
}

function printText(str: string, alignment: "left" | "right"): number {
  console.log(str, alignment);
  return 7;
}
printText("Hello", "left");

function compare(a: string, b: string): 1 | 0 | -1 {
  return a === b ? 0 : a > b ? 1 : -1;
}

function multiply(a: number, b?: number): number {
  if (b) {
    return a * b;
  }
  return a;
}

class Person {
  private firstName: string;
  private lastName: string;
  protected id: string;
  constructor(firstName: string, lastName: string, id: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.id = id;
  }
  private getFullName(): string {
    return `${this.firstName} ${this.id}`;
  }
}

class User1 extends Person {
  getFullName1(): string {
    return `${this.firstName} ${this.id}`;
  }
}

const person1 = new Person("Mina", "Ahmadi", "123");
