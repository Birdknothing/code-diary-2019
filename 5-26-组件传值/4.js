class Flower{
  constructor(sender,target,fname){
    this.sender = sender
    this.fname = fname
    this.target = target
    this.whos = []
  }
  push(who){
    this.whos.push(who)
  }
}
class Person {
  constructor(name){
    this.name = name
  }
  receive(flower){
    this.name !== flower.target ? this.sendFlower(new Person(flower.target),flower) : console.log(this.name+' has received '+flower.fname+' from '+flower.sender+' ,and flower has been delivered by '+flower.whos)
  }
  sendFlower(person,flower) {
    flower.push(this.name)
    person.receive(flower)
  }
}
new Person('xiaoming').sendFlower(new Person('xiaojin'),new Flower('xiaoming','xiaohua','rose'))