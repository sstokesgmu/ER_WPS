class Person {
  constructor(name, age) {
    console.log('Constructor called');
    console.log(`Name: ${name}, Age: ${age}`);
    this.name = name;
    this.age = age;
  }
}

const person1 = new Person('Alice', 25);