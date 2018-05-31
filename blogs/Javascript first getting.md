---
title: Javascript基础认知
date: 2018-05-18
categories:
- Javascript学习
tags:
- Javascript
- 特性
- 基础

---
**此篇博客是我为同事讲解JavaScript基础的PPT。只有内容框架，详细的需要大家自行百度。**
### 1. Javascript概要认识

从Android转向Alios，Alios上层用JavaScript实现，学习JavaScript两个月，起初认为JavaScript是函数式语言，后来发现JavaScript也是面向对象的，另外JavaScript也无可厚非的是解释型语言，当然，它也是原型语言。but，作为函数式语言，它却不全是函数，真正的纯函数式语言“一切皆为函数”，包括字符，数字常量；而说到面向对象，JavaScript真的有点勉强，都是为了实现面向对象而面向对象；作为解释型语言，它又极力去做预编译优化。so，JavaScript到底是怎样一个存在。我们来一一探讨。

- 解释型语言
- 函数式语言
- 面向对象
- 原型对象及原型链

### 2. Javascript——解释型语言
我们首先明确下编译型语言和解释型语言的概念。

- 编译型语言是代码在运行前编译器将人类可以理解的语言（编程语言）转换成机器可以理解的语言；
- 解释型语言也是人类可以理解的语言（编程语言），也需要转换成机器可以理解的语言才能执行，但是是在运行时转换的。所以执行前需要解释器安装在环境中
- 解释器启动和执行的更快。你不需要等待整个编译过程完成就可以运行你的代码。从第一行开始翻译，就可以依次继续执行了。
- 可是当你运行同样的代码一次以上的时候，解释器的弊处就显现出来了。比如你执行一个循环，那解释器就不得不一次又一次的进行翻译，这是一种效率低下的表现
- 编译器可以用更多的时间对代码进行优化，以使的代码执行的更快。而解释器是在 runtime 时进行这一步骤的，这就决定了它不可能在翻译的时候用很多时间进行优化

#### JIT（Just In Time）即时编译代码优化
解释型语言的特点导致其先天性运行缓慢，为了解决其效率问题后来的浏览器引入了编译器，和解释器配合来优化运行速度。  

- **基线编译器：** JavaScript引擎中增加一个监视器（也叫分析器），起初监听器监视所有通过解释器的代码，如果一行代码运行了几次，则被标记为“warm”，如果运行了多次，则被标记为“hot”。如果一段代码变成了 “warm”，那么 JIT 就把它送到编译器去编译，并且把编译结果存储起来；如果一个代码段变得 “very hot”，监视器会把它发送到优化编译器中，生成一个更快速和高效的代码版本出来，并且存储之。
- **优化编译器：** JS是一门动态类型的语言，但要让JS运行时变快，就要尽量在运行时作为静态类型的语言来处理。因此优化编译器必须做一些假设，在这条线索执行过程中，相关的字节码实际上可以理解为已经替换为类型化的字节码，当所有的实例都有相同的属性名，并且都以同样的顺序初始化，那么就可以针对这一模式进行优化，所以编译代码需要在运行之前检查其假设是不是合理的。如果合理，那么优化的编译代码会运行，如果不合理，那么 JIT 会认为做了一个错误的假设，并且把优化代码丢掉。

```
function arraySum(arr) {
    var sum = 0; 
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    } 
}
```

上面代码中arr数组的内容的类型不确定，故sum的类型是不确定的，假设arr第50个元素是String类型，其它元素都是int类型，假设当此循环执行10次后，被标记为very hot，优化编译器首先假设i是int，arr.length是int，sum是int，那后面11到49都满足次假设，会用优化编译器去做优化，即后续执行不需要解释器去解释此段代码，而是直接加载编译好的二进制码，故而提高效率；但到第50次时，因为arr[49]是String，前面的假设是错误的，故丢弃次优化。第51次运行时再次解释器，基线编译器，直到其符合优化编译器要求才会再次被编译优化。  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;JIT要解决的问题是减少代码的重复解释来提高效率，但即时编译本身也是会影响运行效率的，因此准确的定位高频代码并适量的去编译方可以达到最佳优化状态。

### V8优化
V8是Google的除了引入JIT，还做了其他优化  
##### 内联代码第一个优化是提前尽可能多地内联代码。内联是将被调用函数的主体替换为调用站点（调用函数的代码行）的过程。这个简单的步骤使得下面的优化更有意义，如下图，将一段代码分为多个函数调用，可以尽可能的加大内联优化的可能性。  
![](http://p9jmdxlv0.bkt.clouddn.com/1527686584744.jpg)

##### 隐藏类
- V8在内部为对象创建隐藏类(类似于Java的类，不同的是在运行时创建，且可动态改变)
- 具有相同隐藏类的对象可以使用相同的优化代码
- 每当一个新的属性被添加到一个对象时，旧的隐藏类将被更新为到新的隐藏类的转换路径
- 隐藏类转换取决于将属性添加到对象的顺序。看看下面的代码片段

```
function Point(x,y) {
    this.x = x;
    this.y = y;
}
var p1 = new Point(1, 2);//此时v8引擎为p1创建了一个隐藏类，假设为X
p1.a = 5;//因为p1插入了新属性，故p1的隐藏类改变为Y
p1.b = 6;//因为p1插入了新属性，故p1的隐藏类改变为Z
var p2 = new Point(3, 4);//因p2的属性和属性顺序和p1创建时一样，故此时p2的隐藏类改变为X
p2.b = 7;//因为p2插入了新属性，故p1的隐藏类改变为M，M不同于Y
p2.a = 8;//因为p1插入了新属性，故p1的隐藏类改变为N，N不同于Z
```

##### 内联缓存
- V8 利用另一种被称为内联缓存的技术来优化动态类型语言。内联缓存依赖于发生在相同类型的对象上的相同方法的重复调用的观察上。
- V8 维护一个在最近的方法调用中作为参数传递的对象类型的缓存，并使用这些信息来预测将来作为参数传递的对象的类型。如果V8能够很好地假定传递给方法的对象类型，那么它可以绕过如何访问对象的属性的过程，而是将之前查找到的信息用于对象的隐藏类。
- V8 引擎都必须执行对该对象的隐藏类的查找，以确定访问特定属性的偏移量。在同一个隐藏类的两次成功的调用之后，V8 省略了隐藏类的查找，并简单地将该属性的偏移量添加到对象指针本身。（通过隐藏对象确定对象访址偏移）
- 内联缓存也是为什么相同类型的对象可以共享隐藏类非常重要的原因。如果你创建了两个相同类型的对象和不同的隐藏类，V8 将不能使用内联缓存，因为即使两个对象是相同的类型，它们相应的隐藏类为其属性分配不同的偏移量。

### 3. JavaScript——函数式编程
#### 函数式编程vs命令式编程
- 函数式编程关心类型（代数结构）之间的关系，命令式编程关心解决问题的步骤
- 函数式编程的准则：函数式编程强调程序的执行结果，函数不受外部变量影响，不依赖于外部变量，也不改变外部变量的值  

```
// 命令式
var a = 1 + 2;
var b = a * 3;
var c = b - 4;

// 函数式
var result = subtract(multiply(add(1,2), 3), 4);
```

#### 函数式编程特征
- 数据不可变性(immutable data)  变量只可以赋值一次，变量不可变，如果想改变变量就创建一个新的变量。
- 函数是第一公民(first class method)  函数可以像普通变量一样去使用。函数可以像变量一样被创建，修改，并当成变量一样传递，返回或是在函数中嵌套函数
- 引用透明(referential transparency)  指的是函数的运行不依赖于外部变量或“状态”，只依赖于输入的参数，任何时候只要参数相同，调用函数所得到的返回值总是相同的。天然适应并发编程，因为调用函数的结果具有一致性，所以根本不需要加锁，也就不存在死锁的问题
- 尾递归化（tail call optimization）  
因为函数调用要压栈保存现场，递归层次过深的话，压栈过多会产生性能问题。所以引入尾递归优化，每次递归时都会重用栈，提升性能

#### JavaScript与函数式语言关系

- Javascript的词法包括了传递函数为参数的能力，具有类型推断系统，支持匿名函数、高阶函数、闭包等等。 这些特点对构成函数式编程的结构和行为至关重要

- Javascript是一个解释型语言，因此Javascript的确也不是一个纯函数式语言。它缺乏惰性求值和内建的不可变数据。 这是由于大多数解释器是按名调用，而不是按需调用

### 4. 原型对象及原型链
#### JavaScript类型
- 原始值  
存储在栈（stack）中的简单数据段，也就是说，它们的值直接存储在变量访问的位置。Undefined、Null、Boolean、Number和String
- 引用值  
存储在堆（heap）中的对象，也就是说，存储在变量处的值是一个指针（point），指向存储对象的内存处。
- 对象类型又分为  
本地对象(Object，Function， Array，String，Boolean，Error...)  
内置对象(Global 和 Math)  
宿主对象(DOM, process)  

#### 函数和对象关系
- JavaScript一切皆对象（除原始类型外）
- 函数也是对象，一个函数是一个Funciton对象
- 所有对象都直接或者间接”继承”于Object
- 对象都是通过函数创建的(包括对象字面量)
- Object是一种函数

```
function fn(){}
var obj = {}
console.log(fn instanceof Function)//true
console.log(obj instanceof Object)//true
console.log(fn instanceof Object)//true
console.log(obj instanceof Function)//false
console.log(Function instanceof Object); // true
console.log(Object instanceof Function); // true
```

#### 函数原型对象
定义：在JavaScript中，我们创建一个函数A(就是声明一个函数), 那么浏览器就会在内存中创建一个对象B，而且每个函数都默认会有一个属性 prototype 指向了这个对象( 即：prototype的属性的值是这个对象 )。这个对象B就是函数A的原型对象，简称函数的原型。这个原型对象B 默认会有一个属性 constructor 指向了这个函数A ( 意思就是说：constructor属性的值是函数A )。

```
function Person(){

}
```

![](http://p9jmdxlv0.bkt.clouddn.com/2.jpg)

#### 原型链

![](http://p9jmdxlv0.bkt.clouddn.com/4.jpg)

### 5. JavaScript 面向对象
一种面向对象语言需要向开发者提供四种基本能力：  
抽象 - 提取接口能力  
封装 - 把相关的信息（无论数据或方法）存储在对象中的能力  
继承 - 由另一个类（或多个类）得来类的属性和方法的能力  
多态 - 编写能以多种方法运行的函数或方法的能力  
ECMAScript 号称是面向对象的，我们来看看它是怎么一步步实现面向对象的。

#### 封装
类 {属性 + 方法}，几乎所有语言都可以做到这一点

```
function Person(name, sex) {
       this.name = name;
       this.sex = sex;
	       this.say = function() {
             alert(“我的名字是”+this.name);
       };
}
```
####继承
下面介绍JavaScript几种继承实现方式  

- 对象冒充  
通过在本函数作用域调用另一个函数的构造方法达到将该函数的属性和方法引入到本函数，实现如下：

```
function ClassA(sColor) {
    this.color = sColor;
    this.sayColor = function () {
        alert(this.color);
    };
}

//ClassB继承ClassA
function ClassB(sColor, sName) {
    this.newMethod = ClassA;
    this.newMethod(sColor);
    delete this.newMethod;

    this.name = sName;
    this.sayName = function () {
        alert(this.name);
    };
}

//多继承 ClassZ继承ClassA和ClassB
function ClassZ() {
    this.newMethod = ClassX;
    this.newMethod();
    delete this.newMethod;

    this.newMethod = ClassY;
    this.newMethod();
    delete this.newMethod;
}
```

- 原型链实现继承

每个类的构造函数都指向一个原型对象（ prototype ），prototype 对象是个模板，要实例化的对象都以这个模板为基础， prototype 对象的任何属性和方法都被传递给那个类的所有实例。原型链利用这种功能来实现继承机制。

```
function ClassA() {
}
ClassA.prototype.color = "blue";
ClassA.prototype.sayColor = function () {
    alert(this.color);
};
function ClassB() {
}
ClassB.prototype = new ClassA(); // ClassB继承ClassA
```

- 混合方式实现继承  
对象冒充的主要问题是必须使用构造函数方式，这不是最好的选择。不过如果使用原型链，就无法使用带参数的构造函数了。开发者如何选择呢？答案很简单，两者都用。  
创建类的最好方式是用构造函数定义属性，用原型定义方法。这种方式同样适用于继承机制，用对象冒充继承构造函数的属性，用原型链继承 prototype 对象的方法。

```
function ClassA(sColor) {
    this.color = sColor;
}
ClassA.prototype.sayColor = function () {
    alert(this.color);
};
function ClassB(sColor, sName) {
    ClassA.call(this, sColor);
    this.name = sName;
}

ClassB.prototype = new ClassA();

ClassB.prototype.sayName = function () {
    alert(this.name);
};
```

- 使用extends关键字  
为了使JavaScript更加面向对象，ES6强行加入了class，extends的关键字，class关键字是语法糖，本质还是函数。

```
class Polygon {
   constructor(height, width) {
       this.name = 'Polygon';
       this.height = height;
       this.width = width;
   }
}
 class Square extends Polygon {
  constructor(length) {
      super(length, length);
      this.name = 'Square';
  }
}
```

#### class原理
下面我们来了解Es6 class的原理，先看如下代码

```
class People{
  constructor(name,age){
     this.name = name;
     this.age = age}
  static see(){alert("how are you")}  }
  say(){console.log("hello");}
}
```
如上代码本质上：  
People是一个类，也是一个函数；  
constructor是一个对象指向的是People函数，该函数还挂了name和age属性；  
将see函数挂载到People的原型上；  
将say函数挂载到People函数上。 
 
故如上代码等价于如下代码

```
let People = function(){ //第①步，创建People函数
 
 function People(name,age){//第②步，理解constructor就是指向People，People挂载着name和age两个属性
    this.name = name;
    this.age = age;}
   
 //将静态和动态的方法分别挂载在People的原型和People上。   
 creatClass(People,[{key:"say",value:function(){
     console.log(123)}}],[{key:"see",value:function(){
     alert("how are you")}}])  
     
 return People;}
 
//这里的Constructor就是指的People  
let creatClass = function({
  return function(Constructor,,protoProps,staticProps){
     //有原型上的方法挂载People.prototype上
     if(protoProps){defineProperties(Constructor.prototype,protoProps)}
      //有People对象上的方法挂载People上
     if(staticProps){defineProperties(Constructor,staticProps)}}
 
//定义对象属性     
let defineProperties =function(target, props) {
     for (var i = 0; i < props.length; i++) {
       var descriptor = props[i];
       Object.defineProperty(target, descriptor.key, descriptor);
     }
   }   
}) 
```

以上是作为初学者的我总结的JavaScript的几个基本面，希望对各位初学者有所帮助。