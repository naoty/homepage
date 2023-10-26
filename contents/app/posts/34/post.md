---
title: プロパティの参照順序について
time: 2011-02-13 22:12
tags: ['javascript']
---

　結論から言うと、プロパティは以下の順番で値を探しに行きます。

1. ローカルプロパティ
2. \_\_proto\_\_内のプロパティ（prototypeからセットされたプロパティ）
3. \_\_proto\_\_.\_\_proto\_\_内のプロパティ
4. \_\_proto\_\_.\_\_proto\_\_.\_\_proto\_\_・・・と続く
5. undefined

　以下の例で言うと、naotoknkオブジェクトのプロパティは以下の順番で値を探しに行きます。

1. naotoknk（WorkerBee内で定義されたプロパティ）
2. naotoknk.\_\_proto\_\_（WorkerBee.prototype内で定義されたプロパティ）
3. naotoknk.\_\_proto\_\_.\_\_proto\_\_（Employee.prototype内で定義されたプロパティ）
4. naotoknk.\_\_proto\_\_.\_\_proto\_\_.\_\_proto\_\_（Object.prototype内で定義されたプロパティ）
5. undefined

```
function Employee() {
    this.name = "";
    this.dept = "general";
}

function WorkerBee() {
    this.projects = [];
}
WorkerBee.prototype = new Employee; // 継承

var naotoknk = new WorkerBee;
```

　この例では、WorkerBee.prototypeにEmployeeのインスタンスを定義しています。Employeeインスタンスにはnameプロパティとdeptプロパティが定義されているので、WorkerBee.prototype内にnameプロパティとdeptプロパティが定義されるのです（すなわち、継承）。  
　このとき、naotoknk.nameを参照すると、naotoknk内にnameプロパティを探しに行きます。しかし、存在しないため、naotoknk.\_\_proto\_\_内に探しに行きます。ここには存在するため、""（空文字列）を返します。

```
naotoknk.name == naotoknk. __proto__.name
```
