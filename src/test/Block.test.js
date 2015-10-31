var proto = require('proto')
var Future = require("async-future")

var syn = require("fsyn")
var testUtils = require('testUtils')
var blocks = require("../blocks.browser")
var Block = blocks.Block

var Text = blocks.Text
var Button = blocks.Button



module.exports = function(t) {

    // basic test block
    var TestThinger = proto(Block,function(superclass) {
        this.name = 'TestThinger'
    })




    //*

	this.test('testEvent',function(t) {
        this.count(2);

		var obj = new Button("some text");
		obj.on("flick",function(data) {
			t.ok(true);
			t.ok(data.obj === "blah");
		});

		obj.emit("flick",{obj:"blah"});
	});

    this.test('add, addAt, addBefore', function() {
		this.count(5);
        var C = proto(Block, function(superclass) {
            this.name = 'addTest'
            this.init = function() {
                superclass.init.call(this) // set style with constructor
            }
        })

        this.test('add', function() {
            var x = C()

            x.add(Text('a'))
            this.eq(x.domNode.children.length, 1)
            this.eq(x.children.length, 1)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode.textContent , 'a')

            x.add(Text('x', 'b'))
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'b')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            x.add([Text('c'), Text('x', 'd')])
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'b')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            this.eq(x.domNode.children[2].textContent , 'c')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'd')
            this.eq(x.children[3].domNode , x.domNode.children[3])

        })

        this.test('addAt', function() {
            var x = C()

            x.addAt(0, Text('a'))
            this.eq(x.domNode.children.length, 1)
            this.eq(x.children.length, 1)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode.textContent , 'a')

            x.addAt(0, Text('x', 'b'))
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'a')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            x.addAt(1, [Text('c'), Text('x', 'd')])
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'c')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'd')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'a')
            this.eq(x.children[3].domNode , x.domNode.children[3])

            this.test('errors', function() {
                this.count(1)

                var x = C()
                x.addAt(0, Text("moose"))

                try {
                    x.addAt(0, x.children[0])
                } catch(e) {
                    this.eq(e.message, 'Node at index 0 already has a parent. Remove the node from its parent before adding it somewhere else.')
                }
            })
        })

        this.test('addBefore', function() {
            var x = C()

            var one = Text('a')
            x.addBefore(undefined, one)
            this.eq(x.domNode.children.length, 1)
            this.eq(x.children.length, 1)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode.textContent , 'a')

            var two = Text('x', 'b')
            x.addBefore(one, two)
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'a')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            x.addBefore(one, [Text('c'), Text('x', 'd')])
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'c')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'd')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'a')
            this.eq(x.children[3].domNode , x.domNode.children[3])

            x.addBefore(undefined, Text('e'))
            this.eq(x.domNode.children.length, 5)
            this.eq(x.children.length, 5)
            this.eq(x.domNode.children[4].textContent , 'e')
            this.eq(x.children[4].domNode , x.domNode.children[4])
        })

        this.test('remove', function() {
            var C = proto(Block, function(superclass) {
                this.name = 'removeTest'

                this.init = function() {
                    superclass.init.call(this) // set style with constructor
                }
            })

            var x = C()

            var zero = Text('a')
            var one = Text('b')
            var two = Text('c')
            var three = Text('d')
            var four = Text('e')
            x.add(zero,one,two,three,four)

            this.eq(zero.parent, x)
            this.eq(one.parent, x)
            this.eq(two.parent, x)
            this.eq(three.parent, x)
            this.eq(four.parent, x)

            x.remove(2)
            this.eq(two.parent, undefined)
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'b')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'd')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'e')
            this.eq(x.children[3].domNode , x.domNode.children[3])

            x.remove(one)
            this.eq(one.parent, undefined)
            this.eq(x.domNode.children.length, 3)
            this.eq(x.children.length, 3)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'd')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'e')
            this.eq(x.children[2].domNode , x.domNode.children[2])

            x.remove(zero)
            this.eq(zero.parent, undefined)
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'd')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'e')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            // what's left is three and four
            x.remove([0, four])
            this.eq(three.parent, undefined)
            this.eq(four.parent, undefined)
            this.eq(x.domNode.children.length, 0)
            this.eq(x.children.length, 0)
        })

		this.test('setting parent',function() {
			this.count(2);
			var C = proto(Block, function(superclass) {
                this.name = 'parent'

                this.init = function() {
                    superclass.init.call(this)
                }
            })

			var C2 = proto(Block, function(superclass) {
                this.name = 'child'

                this.init = function() {
                    superclass.init.call(this)
                }
            })

			var parent = C();
			var child = C2();
			this.eq(child.parent,undefined);
			parent.add(child);
			this.eq(child.parent,parent);
			
		})
    })

    this.test('attr', function() {
        var thinger = TestThinger()
        thinger.attr("moose", '5')
        this.eq(thinger.domNode.getAttribute("moose"), '5')
        this.eq(thinger.attr('moose'), '5')

        thinger.attr("moose", 'ha ha ha \'\"haaaaaaa <moose></moose>')
        this.eq(thinger.domNode.getAttribute("moose"), 'ha ha ha \'\"haaaaaaa <moose></moose>')
        this.eq(thinger.attr('moose'), 'ha ha ha \'\"haaaaaaa <moose></moose>')

        thinger.attr('moose', undefined)
        this.eq(thinger.domNode.getAttribute("moose"), null)
        this.eq(thinger.attr('moose'), undefined)

        thinger.attr({arg:1, blah:2})
        this.eq(thinger.attr('arg'), '1')
        this.eq(thinger.attr('blah'), '2')
    })

    this.test('label property', function() {
        blocks.dev = false // turn off dev for a second

        var thinger = TestThinger()
        this.eq(thinger.label, undefined)
        this.eq(thinger.attr('label'), undefined)

        thinger.label = "moose"
        this.eq(thinger.label, 'moose')
        //this.eq(thinger.attr('label'), undefined) why not just do it for everything // only set in dev mode

        var thinger2 = TestThinger()
        blocks.dev = true // turn back on
        thinger2.label = "moose2"
        this.eq(thinger2.label, "moose2")
        this.eq(thinger2.attr('label'), "moose2")

        try {
            thinger.label = 'setagainfails'
        } catch(e) {
            this.eq(e.message, "A Block's label can only be set once (was already set to: moose)")
        }
    })

    this.test('visible', function() {
        var container = blocks.Container()
        testUtils.demo("visible test", container)

        var thinger = TestThinger()
        container.add(thinger)
        this.eq(thinger.visible, true)
        this.eq($(thinger.domNode).css('display'), "inline-block")

        thinger.visible = true                       // does nothing if its already showing
        this.eq(thinger.visible, true)
        this.eq($(thinger.domNode).css('display'), "inline-block")

        thinger.visible = false
        this.eq(thinger.visible, false)
//        this.eq(thinger.domNode.style.display, "none")
        this.eq($(thinger.domNode).css('display'), "none")

        thinger.visible = false                      // does nothing if its already hiding
        this.eq(thinger.visible, false)
        this.eq($(thinger.domNode).css('display'), "none")

        thinger.visible = true
        this.eq(thinger.visible, true)
        this.eq($(thinger.domNode).css('display'), "inline-block")

        this.test("with styled css display", function() {
            var thinger = TestThinger()
            container.add(thinger)
            thinger.attached = true // pretend its attached so it'll render the style
            thinger.style = blocks.Style({display: 'inline'})

            this.eq($(thinger.domNode).css('display'), "inline")

            thinger.visible = false
            this.eq($(thinger.domNode).css('display'), "none")
            this.eq(thinger.visible, false)

            thinger.visible = true
            this.eq(thinger.visible, true)
            this.eq($(thinger.domNode).css('display'), "inline")
        })

        this.test("with inline css", function() {
            var thinger = TestThinger()
            container.add(thinger)
            thinger.domNode.style.display = 'block'

            this.eq($(thinger.domNode).css('display'), "block")

            thinger.visible = false
            this.eq($(thinger.domNode).css('display'), "none")
            this.eq(thinger.visible, false)

            thinger.visible = true
            this.eq(thinger.visible, true)
            this.eq($(thinger.domNode).css('display'), "block")
        })
    })

    this.test("focus", function() {
        var input = blocks.TextField()
        testUtils.demo("focus test", input)

        this.ok(input.domNode !== document.activeElement)

        input.focus = true
        this.ok(input.domNode === document.activeElement)

        input.focus = false
        this.ok(input.domNode !== document.activeElement)
    })

    this.test("setSelection and getCaratOffset", function() {
        var container = blocks.Container()
        testUtils.demo("setSelection and getCaratOffset", container)

        this.test('input textfield', function() {
            var input = blocks.TextField()
            container.add(input)
            input.val = "whatever yo"

            this.eq(input.selectionRange, undefined)

            input.selectionRange = [1,1]
            this.eq(input.selectionRange[0], 1)
            this.eq(input.selectionRange[1], 1)

            input.selectionRange = [2,5]
            this.eq(input.selectionRange[0], 2)
            this.eq(input.selectionRange[1], 5)

            this.test("input textfields that are next to eachother", function() {
                var c = blocks.Container()
                container.add(c)
                var input = blocks.TextField(), input2 = blocks.TextField()
                c.add(input, input2)
                input.val = "whatever yo"
                input2.val = 'more whatever'

                this.eq(input.selectionRange, undefined)
                this.eq(input2.selectionRange, undefined)

                input.focus = true

                // when its focused on after being set programatically, it should have the active caret (note that this is different from gaining focus by being tabbed to)
                // seems to start its caret at the end of the input
                this.eq(input.selectionRange[0], input.val.length)
                this.eq(input.selectionRange[1], input.val.length)
                this.eq(input2.selectionRange, undefined)

                input.selectionRange = [2,4]
                this.eq(input.selectionRange[0], 2)
                this.eq(input.selectionRange[1], 4)
                this.eq(input2.selectionRange, undefined)

                input2.selectionRange = [3,5]
                this.eq(input.selectionRange, undefined)
                this.eq(input2.selectionRange[0], 3)
                this.eq(input2.selectionRange[1], 5)

            })
        })

        this.test('textarea', function() {
            var input = blocks.TextArea()
            container.add(input)
            input.val = "whatever yo"

            this.eq(input.selectionRange, undefined)

            input.selectionRange = [1,1]
            this.eq(input.selectionRange[0], 1)
            this.eq(input.selectionRange[1], 1)

            input.selectionRange = [2,5]
            this.eq(input.selectionRange[0], 2)
            this.eq(input.selectionRange[1], 5)
        })

        this.test("regular div", function() {
            var div = blocks.Text("Whatever")
            div.attr("contenteditable", true)
            container.add(div)

            this.eq(div.selectionRange, undefined)

            div.selectionRange = [1,1]
            this.eq(div.selectionRange[0], 1)
            this.eq(div.selectionRange[1], 1)

            div.selectionRange = [2,5]
            this.eq(div.selectionRange[0], 2)
            this.eq(div.selectionRange[1], 5)
        })

        this.test("contenteditable div", function() {
            var input = blocks.Text("Whatever")
            input.attr("contenteditable", true)
            container.add(input)

            this.eq(input.selectionRange, undefined)

            input.selectionRange = [1,1]
            this.eq(input.selectionRange[0], 1)
            this.eq(input.selectionRange[1], 1)

            input.selectionRange = [2,5]
            this.eq(input.selectionRange[0], 2)
            this.eq(input.selectionRange[1], 5)

            input.domNode.innerHTML = "<span>hi</span><span>lo</span><span>mo<br>scrow</span>"
            this.eq(input.selectionRange[0], 0)
            this.eq(input.selectionRange[1], 11)           // is this right?

            input.selectionRange = [4,11]
            this.eq(input.selectionRange[0], 4)
            this.eq(input.selectionRange[1], 11)

        })

        this.test("selectionRange across nodes", function() {
            var one = Text('one'), two = Text("two"), three = Text("three")
            var c = blocks.Container(one, two, three)
            container.add(c)

            c.selectionRange = [2,8]
            this.eq(c.selectionRange[0], 2)
            this.eq(c.selectionRange[1], 8)
            this.eq(one.selectionRange[0], 2)
            this.eq(one.selectionRange[1], 3)
            this.eq(two.selectionRange[0], 0)
            this.eq(two.selectionRange[1], 3)
            this.eq(three.selectionRange[0], 0)
            this.eq(three.selectionRange[1], 2)
        })
    })

    this.test("on, addListener, once, removeListener, removeAllListeners", function(t) {
        this.count(10)

        var EventWhore = proto(Block,function(superclass) {
            this.name = 'EventWhore'
        })

        var e = EventWhore()

        var event = testUtils.seq(
          function(eventName, data) {
            t.eq(eventName, 'a')
            t.eq(data, 1)
        },function(eventName, data) {
            t.eq(eventName, 'a')
            t.eq(data, 2)

        },function(eventName, data) {
            t.eq(eventName, 'b')
            t.eq(data, 3)
        },function(eventName, data) {
            t.eq(eventName, 'b')
            t.eq(data, 4)

        },function(eventName, data) {
            t.eq(eventName, 'c')
            t.eq(data, 5)
        })

        var acb, bcb, ccb;
        e.on('a', acb = function(data) {
            event('a', data)
        })
        e.addListener('b', bcb = function bcb(data) {
            event('b', data)
        })
        e.once('c', cbc = function(data) {
            event('c', data)
        })

        e.emit('a', 1)
        e.emit('a', 2)

        e.emit('b', 3)
        e.emit('b', 4)

        e.emit('c', 5)
        e.emit('c', 6)

        e.removeListener('a', acb)
        e.emit('a', 7)

        e.removeAllListeners('b')
        e.emit('b', 8)

        e.on('d', acb = function(data) {
            event('a', data)
        })
        e.removeAllListeners()
        e.emit('d', 9)
    })


    this.test('listening on standard browser events', function(t) {
        var container = blocks.Container()
        testUtils.demo('listening on standard browser events', container)
        this.test("basic browser events", function (t) {
            this.count(1)

            var EventEmitter = require("events").EventEmitter

            var EventWhore = proto(Block,function(superclass) {
                this.name = 'EventWhore'
            })

            var e = EventWhore()
            container.add(e)

            var testEvent = testUtils.seq(function(eventName) {
                t.eq(eventName, 'click')
            })

            // events shouldn't be emitted unless bound with the EventEmitterB/Block `on` method (the EventEmitter `on` method bypasses the critical dom event handling setup)
            var eventEmitterPrototypeHandler;
            EventEmitter.prototype.on.call(e, "click", eventEmitterPrototypeHandler=function() {
                testEvent('EventEmitter click')
            })

            var handler;
            syn.click(e.domNode).then(function() {
                EventEmitter.prototype.removeListener.call(e, "click", eventEmitterPrototypeHandler) // get rid of the EventEmitter listener, cause otherwise it'll mess out stuff up

                e.on('click', handler = function() {
                    testEvent('click')
                })

                return syn.click(e.domNode)
            }).then(function() {
                e.removeListener('click', handler)

                return syn.click(e.domNode)
            }).then(function() {
                e.on('click', handler = function() {
                    event('click')
                })

                e.removeAllListeners('click')

                return syn.click(e.domNode)
            }).then(function() {
                e.on('click', handler = function() {
                    event('click')
                })

                e.removeAllListeners()

                return syn.click(e.domNode)
            }).done()
        })

        this.test("browser events with exclusion", function(t) {
            this.count(1)

            var EventWhore = proto(Block,function(superclass) {
                this.name = 'EventWhore'

                this.excludeDomEvents = {click: 1}
            })

            var e = EventWhore()
            container.add(e)

            var testEvent = testUtils.seq(function(eventName) {
                t.eq(eventName, 'mousedown')
            })

            e.on('click', function() {
                testEvent('click')
            })
            e.on('mousedown', function() {
                testEvent('mousedown')
            })

            syn.click(e.domNode).done()
        })
    })

    this.test("attach and detach", function() {
        var a = blocks.Text("tach")
        a.attach()
        this.eq(a.domNode.parentNode, document.body)

        var b = blocks.Text("tach2")
        b.attach(a.domNode)
        this.eq(b.domNode.parentNode, a.domNode)


        var c = blocks.Text("tach3")
        blocks.attach(c)
        this.eq(c.domNode.parentNode, document.body)

        var d = blocks.Text("tach4")
        blocks.attach(c.domNode, d)
        this.eq(d.domNode.parentNode, c.domNode)


        var e = blocks.Text("tach5")
        blocks.attach([e])
        this.eq(e.domNode.parentNode, document.body)

        var f = blocks.Text("tach6")
        blocks.attach(e.domNode, [f])
        this.eq(f.domNode.parentNode, e.domNode)


        blocks.detach(f)
        this.eq(f.domNode.parentNode, null)
        blocks.detach([e,d])
        this.eq(e.domNode.parentNode, null)
        this.eq(d.domNode.parentNode, null)
        c.detach()
        b.detach()
        this.eq(c.domNode.parentNode, null)
        this.eq(b.domNode.parentNode, null)
    })

    this.test("former bugs", function() {
        // note, i thought this would have been a bug.. but apparently not? I'm unclear how to manifest the incorrect code i see.. but what the hell, i'll just fix the code without a test
        this.test("dom events handlers not being unbound correctly when more than one type of event is bound", function(t) {
            this.count(1)

            var EventWhore = proto(Block,function(superclass) {
                this.name = 'EventWhore'
            })

            var e = EventWhore()

            var clickHandler
            e.on('click', clickHandler=function() {
                t.ok(false)
            })
            e.on('mousedown', function() {
                t.ok(true)
            })

            e.off('click', clickHandler)

            syn.click(e.domNode)
        })
    })

    //*/
}

