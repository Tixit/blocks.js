var proto = require('proto')

var testUtils = require('testUtils')
var blocks = require("../blocks.browser")
var Block = blocks.Block
var domUtils = require('domUtils')
var syn = require("fsyn")

var Style = blocks.Style
var Text = blocks.Text
var Button = blocks.Button
var CheckBox = blocks.CheckBox
var Container = blocks.Container

var defaultBackgroundColor = 'rgba(0, 0, 0, 0)'; var defaultBgColor = defaultBackgroundColor

module.exports = function(t) {


     // todo:
        // test mix and copy






    //*
    this.test('simple styling',function(t) {
        this.count(2)

        var S = Style({
            color: 'rgb(0, 128, 0)'
        })

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S

                this.domNode.textContent = "hi"
            }
        })

        var node = C()
        testUtils.demo("simple styling", node) // node has to be apart of the page before css class styles are applied to it

        var div = $(node.domNode)
        this.eq(div.css('color'), 'rgb(0, 128, 0)')

        node.style = undefined // unset a style (should return to default)
        setTimeout(function() { // looks like when a css classname is changed, it doesn't take effect immediately (is this really true????)
            t.eq(div.css('color'), 'rgb(0, 0, 0)')
        },0)

    })

    this.test('styling a more complex component with inner components', function() {
        var S = Style({
            backgroundColor: 'rgb(0, 128, 0)',
            Text: {backgroundColor: 'rgb(128, 0, 0)'},
            CheckBox: {backgroundColor: 'rgb(0, 0, 128)'}
        })

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S

                this.add(Text('one'), CheckBox())
            }
        })

        var node = C()
        testUtils.demo('styling a more complex component with inner components', node)

        var color = $(node.domNode).css('backgroundColor')
        this.ok(color === 'rgb(0, 128, 0)', color)

        var children = node.domNode.children

        color = $(children[0]).css('backgroundColor')
        this.ok(color === 'rgb(128, 0, 0)', color)

        color = $(children[1]).css('backgroundColor')
        this.ok(color === 'rgb(0, 0, 128)', color)
    })

    this.test('styling a component via its class-parent', function() {
        var S = Style({
            Text: {backgroundColor: 'rgb(128, 0, 0)'}
        })

        var NextText = proto(Text, function(superclass) {
            this.name = 'NextText'
        })

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S

                this.add(NextText('one'))
            }
        })

        var node = C()
        testUtils.demo('styling a component via its class-parent', node)

        var children = node.domNode.children
        var color = $(children[0]).css('backgroundColor')
        this.ok(color === 'rgb(128, 0, 0)', color)
    })

    this.test("styling inner components with the 'components' initialization", function() {

        var textStyle1 = Style({
            color: 'rgb(0, 128, 0)'
        })
        var S = Style({
            textAlign: 'center',
            Text: textStyle1
        })

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.add(Text('test'))
                this.style = S
            }
        })

        var node = C()
        testUtils.demo("styling inner components with the 'components' initialization", node)

        var textNode = $(node.domNode.children[0])

        this.eq(textNode.css('color'), 'rgb(0, 128, 0)')
        this.eq($(node.domNode).css('textAlign'), 'center')
        this.eq(textNode.css('textAlign'), 'left') // certain inheritable properties shouldn't be inherited by inner components

        node.style = undefined // unset style
        this.eq(textNode.css('color'), 'rgb(0, 0, 0)')
        this.eq(textNode.css('textAlign'), 'left')
        this.eq($(node.domNode).css('textAlign'), 'left')

    })

    this.test('default Block styles',function(t) {
        this.test('simple default styles', function(t) {
            this.count(10)

            var S = Style({
                color: 'rgb(0, 0, 128)'
            })

            var C = proto(Text, function(superclass) {
                this.defaultStyle = Style({
                    color: 'rgb(0, 128, 0)',
                    backgroundColor: 'rgb(0, 100, 100)',
                    borderColor: 'rgb(120, 130, 140)'
                })
            })
            var D = proto(C, function(superclass) {
                this.defaultStyle = Style({
                    backgroundColor: 'rgb(1, 2, 3)'
                })
            })

            var node = C("yeahhh")
            var node2 = D("NOOOOO")
            var container = Container(node, node2)
            testUtils.demo('default Block styles', container) // node has to be apart of the page before css class styles are applied to it

            var div = $(node.domNode)
            this.eq(div.css('color'), 'rgb(0, 128, 0)')
            this.eq(div.css('backgroundColor'), 'rgb(0, 100, 100)')

            var div2 = $(node2.domNode)
            this.eq(div2.css('color'), 'rgb(0, 128, 0)')
            this.eq(div2.css('backgroundColor'), 'rgb(1, 2, 3)')
            this.eq(div2.css('borderColor'), 'rgb(120, 130, 140)')

            node.style = S
            node2.style = S

            setTimeout(function() { // looks like when a css classname is changed, it doesn't take effect immediately (is this really true????)
                t.eq(div.css('color'), 'rgb(0, 0, 128)')
                t.eq(div.css('backgroundColor'), 'rgb(0, 100, 100)')   // the default backgroundColor bleeds through for default stylings (unlike normal stylings)

                t.eq(div2.css('color'), 'rgb(0, 0, 128)')
                t.eq(div2.css('backgroundColor'), 'rgb(1, 2, 3)')
                t.eq(div2.css('borderColor'), 'rgb(120, 130, 140)')
            },0)
        })

        this.test("complex default Block styles", function(t) {
            var C = proto(Text, function(superclass) {
                this.defaultStyle = Style({
                    color: 'rgb(0, 128, 0)',
                    Text: {
                        color: 'rgb(2, 20, 200)',
                        $setup: function(block) {
                            block.yes = true
                        }
                    }
                })
            })

            var c = C()
            c.add(Text("moooose"))
            testUtils.demo("complex default Block styles", c)

            var node = $(c.domNode)
            var child = c.children[0]
            var childNode = $(child.domNode)

            t.eq(node.css('color'), 'rgb(0, 128, 0)')
            t.eq(childNode.css('color'), 'rgb(2, 20, 200)')
            t.eq(child.yes, true)
        })
    })

    this.test("inheritance of component styles", function() {
        //  (e.g. gramparent sets Label style, parent doesn't but has a Label component in it)


        var S = Style({
            Text: Style({
                color: 'rgb(0, 128, 0)'
            })
        })

        var Parent = proto(Block, function(superclass) {
            this.name = 'Parent'

            this.build = function() {
                this.add(Text('inParent'))
            }
        })

        var Grandparent = proto(Block, function(superclass) {
            this.name = 'Grandparent'

            this.build = function() {
                this.style = S    // setting the style before adding components should also work
                this.add(Parent())
                this.add(Text('inGrandparent'))
            }
        })

        var node = Grandparent()
        testUtils.demo("inheritance of component styles", node)

        var grandparentText = $(node.children[1].domNode)
        var parentText = $(node.children[0].children[0].domNode)

        this.eq(grandparentText.css('color'), 'rgb(0, 128, 0)')
        this.eq(parentText.css('color'), 'rgb(0, 128, 0)')

        node.style = undefined // unset style
        this.eq(grandparentText.css('color'), 'rgb(0, 0, 0)')
        this.eq(parentText.css('color'), 'rgb(0, 0, 0)')
    })

    this.test("the 'setup' javascript initialization", function(t) {
        this.count(3)

        var S = Style({
            $setup: function(component) {
                component.mahdiv = domUtils.div()
                    component.mahdiv.textContent = "It is set up"

                component.domNode.appendChild(component.mahdiv)

                return "some value to pass to kill"
            },
            $kill: function(component, state) {
                component.mahdiv.textContent = 'It has been killed'
                t.eq(state, "some value to pass to kill")
            }
        })
        var S2 = Style({}) // empty style

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S
            }
        })

        var node = C()
        testUtils.demo("the 'setup' javascript initialization", node)

        var innerDiv = $($(node.domNode).children('div')[0])
        this.eq(innerDiv.html(), "It is set up")

        node.style = S2
        this.eq(innerDiv.html(), 'It has been killed')
    })

    this.test("changing styles on the fly", function() {

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function(style) {
                this.style = style

                this.add(Text('testLabel'))
            }
        })

        var TextStyle1 = Style({
                color:'rgb(0,128,0)'
            })
        var TextStyle2 = Style({
                color:'rgb(128,0,0)'
            })

        var S1 = Style({
                color: 'rgb(0,0,128)',

                Text: TextStyle1,
                $setup: function(component) {
                    component.mahdiv = domUtils.div()
                    component.mahdiv.textContent = "It is set up"

                    component.domNode.appendChild(component.mahdiv)
                },
                $kill: function(component) {
                    component.domNode.removeChild(component.mahdiv)
                }
            })

        var S2 = Style({
                color: 'rgb(0,128,128)',
                Text: TextStyle2,
                $setup: function(component) {
                    component.mahdiv = domUtils.div()
                    component.mahdiv.textContent = "Me is set up dood"

                    component.domNode.appendChild(component.mahdiv)
                }
            })

        var node = C(S1)
        testUtils.demo("changing styles on the fly", node)
        node.style = S2 // reset style

        var mainComponent = $(node.domNode)
        var labelDiv = $(mainComponent.children('div')[0])
        var textDiv = $(mainComponent.children('div')[1])

        this.eq(mainComponent.css('color'), 'rgb(0, 128, 128)')
        this.eq(labelDiv.css('color'), 'rgb(128, 0, 0)')
        this.eq(textDiv.html(), "Me is set up dood")


        this.test('errors', function() {
            this.count(1)

            try {
                node.style = S1 // if a style that has a 'setup' but no 'kill' is changed, an exception should be thrown
            } catch(e) {
                this.eq(e.message, 'style has been unset but does not have a "kill" function to undo its "setup" function')
            }
        })
    })

    this.test("reinheritance of parent styles", function() {
        //  (e.g. gramparent sets Text style, parent doesn't but has a Text component in it)


        var textStyle1 = Style({
                color: 'rgb(128, 0, 128)'
            })
        var textStyle2 = Style({
                color: 'rgb(128, 128, 0)'
            })
        var textStyle3 = Style({
                color: 'rgb(0, 128, 0)'
            })
        var S = Style({
                Text: textStyle1
            })
        var S2 = Style({
                Text: textStyle2
            })

        var Parent = proto(Block, function(superclass) {
            this.name = 'Parent'

            this.build = function() {
                this.style = S2

                this.text = Text('inParent')
                this.text.style = textStyle3
                this.add(this.text)
            }
        })

        var Grandparent = proto(Block, function(superclass) {
            this.name = 'Grandparent'

            this.build = function() {
                this.style = S

                this.parentComponent = Parent()
                this.add(this.parentComponent)
            }
        })

        var node = Grandparent()
        testUtils.demo("reinheritance of parent styles", node)

        var parentText = $(node.parentComponent.text.domNode)

        this.eq(parentText.css('color'), 'rgb(0, 128, 0)')

        node.parentComponent.text.style = undefined // reinherit from parent
        this.eq(parentText.css('color'), 'rgb(128, 128, 0)')

        node.parentComponent.style = undefined // reinherit from grandparent
        this.eq(parentText.css('color'), 'rgb(128, 0, 128)')
    })

    this.test('component label styling', function() {

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = style
                this.add(
                    Text('one'),
                    Text('inner', 'two'),
                    Container([Text('three')]),
                    Container('inner2', [Text('four')]),
                    Container('inner2', [Text('inner', 'five')])
                )
            }
        })

        var style = Style({
            color: 'rgb(128, 0, 0)',

            Text: {
                color: 'rgb(0, 128, 0)',
                backgroundColor: 'rgb(1, 2, 3)'
            },
            $inner: {
                color: 'rgb(128, 128, 128)'
            },
            $inner2: {
                Text: {
                    color: 'rgb(0, 128, 128)'
                }
            },

            Container: {
                backgroundColor: 'rgb(0, 120, 130)',

                Text: {
                    color: 'rgb(0, 0, 128)'
                }
            }
        })

        var component = C()
        testUtils.demo('component label styling', component)

        var children = $(component.domNode).children()
        this.eq($(children[0]).css('color'), 'rgb(0, 128, 0)')
        this.eq($(children[0]).css('backgroundColor'), 'rgb(1, 2, 3)')

        this.eq($(children[1]).css('color'), 'rgb(128, 128, 128)')
        this.eq($(children[1]).css('backgroundColor'), 'rgba(0, 0, 0, 0)')   // the $inner style doesn't have a backgroundColor set and doesn't inherit from the Block style

        this.eq($(children[2]).css('backgroundColor'), 'rgb(0, 120, 130)')
        this.eq($(children[2].children[0]).css('color'), 'rgb(0, 0, 128)')

        this.eq($(children[3]).css('backgroundColor'), 'rgba(0, 0, 0, 0)')  // uses the label style, not the Block style
        this.eq($(children[3].children[0]).css('color'), 'rgb(0, 128, 128)')

        this.eq($(children[4]).css('backgroundColor'), 'rgba(0, 0, 0, 0)')  // uses the label style, not the Block style
        this.eq($(children[4].children[0]).css('color'), 'rgb(128, 128, 128)')         // comes from the $inner style rather than the component style (this behavior is a little weird, but is how it works for now)
        this.eq($(children[4].children[0]).css('backgroundColor'), 'rgba(0, 0, 0, 0)') // nothing should be inherited from the non-label style

        // just here to make sure there's no error:
        Style({
            Anything: {
                $someLabel: {
                    $someInnerLabel: {} // nested labels used to not be legal - now they mean something different and so are valid
                }
            }
        })
    })

    this.test('pseudoclass styling', function() {

        this.test("Style.addPseudoClass", function(t) {
            var applies = false, changeState;

            this.test("events", function(t) {
                this.count(40)

                var event = testUtils.seq(function(type, element) {
                    t.eq(type, 'setup')
                    t.eq(element, 'x')
                },function(type, element, applies) {
                    t.eq(type, 'check')
                    t.eq(element, 'x')
                    t.eq(applies, false)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'x')
                    t.eq(startArg, false)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'x')
                    t.eq(startArg, true)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'x')
                    t.eq(startArg, true)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'x')
                    t.eq(startArg, false)
                },function(type, element, state) {
                    t.eq(type, 'kill')
                    t.eq(element, 'x')
                    t.eq(state, 'whoHA')

                },function(type, element) {
                    t.eq(type, 'setup')
                    t.eq(element, 'y')
                },function(type, element, applies) {
                    t.eq(type, 'check')
                    t.eq(element, 'y')
                    t.eq(applies, true)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'y')
                    t.eq(startArg, true)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'y')
                    t.eq(startArg, false)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'y')
                    t.eq(startArg, false)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'y')
                    t.eq(startArg, true)
                },function(type, element, state) {
                    t.eq(type, 'kill')
                    t.eq(element, 'y')
                    t.eq(state, 'whoHA')
                })

                Style.addPseudoClass("test-pseudoclass", {
                    check: function(block) {
                        event('check', block.domNode.textContent, applies)
                        return applies
                    },
                    setup: function(block, start, end) {
                        event('setup', block.domNode.textContent)
                        changeState = function(startArg) {
                            event('changeState', block.domNode.textContent, startArg)
                            if(startArg === true) {
                                start()
                            } else {
                                end()
                            }
                        }

                        return "whoHA"
                    },
                    kill: function(block, state) {
                        event('kill', block.domNode.textContent, state)
                        changeState = undefined
                    }
                })
            })

            var style = Style({
                $$testPseudoclass: {
                    color: 'rgb(10, 30, 50)'
                }
            })

            var x = Text('x')
            x.attached = true // pretend its attached so it'll render the style
            x.style = style

            t.eq($(x.domNode).css('rgb(0, 0, 0)')) // starts out not applying
            changeState(false) // no change
            t.eq($(x.domNode).css('rgb(0, 0, 0)'))
            changeState(true)
            t.eq($(x.domNode).css('rgb(10, 30, 50)'))
            changeState(true)  // no change
            t.eq($(x.domNode).css('rgb(10, 30, 50)'))
            changeState(false)
            t.eq($(x.domNode).css('rgb(0, 0, 0)'))

            x.style = undefined

            applies = true
            var y = Text('y')
            y.attached = true // pretend its attached so it'll render the style
            y.style = style // note that changeState should now be a different function that won't affect x

            t.eq($(x.domNode).css('rgb(10, 30, 50)')) // starts out applying thing time
            changeState(true) // no change
            t.eq($(y.domNode).css('rgb(10, 30, 50)'))
            changeState(false)
            t.eq($(y.domNode).css('rgb(0, 0, 0)'))
            changeState(false) // no change
            t.eq($(y.domNode).css('rgb(0, 0, 0)'))
            changeState(true)
            t.eq($(y.domNode).css('rgb(10, 30, 50)'))

            y.style = Style({
                color: 'blue'
            })

        })


        //*
        this.test("native-only psuedoclass styling", function() {
            this.count(30)

            var style = Style({
                color: 'rgb(128, 0, 0)',

                CheckBox: {
                    color: 'rgb(0, 128, 0)',

                    $$disabled: {
                        color: 'rgb(123, 130, 130)',
                        outline: '1px solid rgb(60, 60, 200)'
                    },

                    $$checked: {
                        color: 'rgb(128, 128, 128)',
                        outline: '4px solid rgb(80, 90, 100)',
                        $$required: {
                            color: 'rgb(130, 0, 130)',
                            backgroundColor: 'rgb(1, 2, 3)'
                        }
                    }
                },

                Container: {
                    CheckBox: {
                        color: 'rgb(0, 128, 0)',
                        width: 100 // make sure this doesn't bleed through to the readWrite CheckBox style
                    },
                    $$readWrite: {
                        CheckBox: {
                            color: 'rgb(128, 128, 128)',

                            $$checked: {
                                color: 'rgb(12, 19, 50)'
                            }
                        }
                    }
                }
            })

            var block = Container([
                CheckBox(),
                Container([CheckBox()])
            ])
            block.style = style

            testUtils.demo("native-only psuedoclass styling", block)

            var children = block.children

            var firstCheckBoxComponent = children[0]
            var firstCheckBox = $(firstCheckBoxComponent.domNode)
            this.eq(firstCheckBox.css('color'), 'rgb(0, 128, 0)')

            this.log('just disabled')
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {    // need to use a timeout every time an attribute changes because the MutationObserver that listens for attribute changes is asynchornous and won't fire until the scheduler is reached
            this.eq(firstCheckBox.css('color'), 'rgb(123, 130, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(60, 60, 200)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            firstCheckBoxComponent.attr('disabled', undefined)
            setTimeout(function() {

            this.log("just checked")
            firstCheckBoxComponent.selected = true
            this.eq(firstCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.ok(firstCheckBox.css('outlineColor') !== 'rgb(0, 0, 0)', firstCheckBox.css('outlineColor'))
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBox.css('outlineWidth'), '4px')
            firstCheckBoxComponent.selected = false

            this.log("just required")
            firstCheckBoxComponent.attr('required', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(0, 128, 0)') // the required pseudoclass doesn't apply because its within the checked psudeoclass (and the box isn't checked)
            this.ok(firstCheckBox.css('outlineColor') !== 'rgb(60, 60, 200)', firstCheckBox.css('outlineColor'))
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)

            this.log("required and disabled")
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(123, 130, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(60, 60, 200)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            firstCheckBoxComponent.attr('required', undefined)
            setTimeout(function() {

            this.log("disabled and checked")
            firstCheckBoxComponent.selected = true
            this.eq(firstCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            firstCheckBoxComponent.attr('disabled', undefined)

            this.log("checked and required")
            firstCheckBoxComponent.attr('required', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(130, 0, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), 'rgb(1, 2, 3)')
            this.eq(firstCheckBox.css('outlineWidth'), '4px')

            this.log("all 3: checked, required, and disabled")
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(130, 0, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), 'rgb(1, 2, 3)')

            this.log("just required (again)")
            firstCheckBoxComponent.attr('disabled', false)
            firstCheckBoxComponent.selected = false
            setTimeout(function() {

            var secondCheckBoxComponent = children[1].children[0]
            var secondCheckBox = $(secondCheckBoxComponent.domNode)
            this.eq(secondCheckBox.css('color'), 'rgb(0, 128, 0)')

            this.log("just readWrite (2nd)")
            children[1].attr('contenteditable', true)
            setTimeout(function() {
            this.eq(secondCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(secondCheckBox.css('width'), '13px')   // completely separate styles from outside the pseudoclass style shouldn't bleed through (unless the style explicitly inherits)
            children[1].attr('contenteditable', undefined)
            setTimeout(function() {

            this.log("just checked (2nd)")
            secondCheckBoxComponent.selected = true
            this.eq(secondCheckBox.css('color'), 'rgb(0, 128, 0)')

            this.log("checked and readWrite (2nd)")
            children[1].attr('contenteditable', true)
            setTimeout(function() {
            this.eq(secondCheckBox.css('color'), 'rgb(12, 19, 50)')
            this.eq(secondCheckBox.css('width'), '13px') // i guess 13px is the default for checkboxes? whatever..
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
        })


        this.test("native pseudoclass styling broken by a sibling pseudoclass", function() {
            this.count(12)

            var setupCalled= 0, killCalled=0
            var style = Style({
                CheckBox: {
                    $setup: function() { // this makes CheckBox unable to be rendered with pure css
                       setupCalled++
                    },
                    $kill: function() {
                       killCalled++
                    }
                },
                '$$nthChild(2)': {
                    backgroundColor: 'rgb(1, 9, 56)',
                    CheckBox: {
                        color: 'rgb(128, 129, 230)'
                    }
                }
            })

            var checkbox = CheckBox()
            var inner = Container([checkbox])
            var block = Container([inner])
            inner.style = style

            testUtils.demo("native psuedoclass styling broken by a block's computedStyleMap", block)

            this.log("not second child")
            setTimeout(function() {

            var checkboxNode = $(checkbox.domNode)
            var innerNode = $(inner.domNode)
            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 1)
            this.eq(killCalled, 0)

            this.log("second child")
            block.addAt(0, Text("nope"))
            setTimeout(function() {
            this.eq(checkboxNode.css('color'), 'rgb(128, 129, 230)')
            this.eq(innerNode.css('backgroundColor'), 'rgb(1, 9, 56)')
            this.eq(setupCalled, 1)
            this.eq(killCalled, 1)

            this.log("not second child (again)")
            block.remove(0)
            setTimeout(function() {

            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 2)
            this.eq(killCalled, 1)

            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
        })


        this.test("native pseudoclass styling broken by a block's computedStyleMap", function() {
            this.count(12)

            var setupCalled= 0, killCalled=0
            var style = Style({
                CheckBox: {
                    $setup: function() { // this makes CheckBox unable to be rendered with pure css
                       setupCalled++
                    },
                    $kill: function() {
                       killCalled++
                    }
                },
                '$$nthChild(2)': {
                    Container:{
                        backgroundColor: 'rgb(1, 10, 57)',
                        CheckBox: {
                            color: 'rgb(128, 129, 230)'
                        }
                    },
                }
            })

            var checkbox, inner, evenInner
            var block = Container([
                inner = Container([
                     evenInner = Container([
                         checkbox = CheckBox()
                     ])
                ])
            ])
            inner.style = style

            testUtils.demo("native psuedoclass styling broken by a block's computedStyleMap", block)

            this.log("not second child")
            setTimeout(function() {

            var checkboxNode = $(checkbox.domNode)
            var innerNode = $(evenInner.domNode)
            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 1)
            this.eq(killCalled, 0)

            this.log("second child")
            block.addAt(0, Text("nope"))
            setTimeout(function() {
            this.eq(checkboxNode.css('color'), 'rgb(128, 129, 230)')
            this.eq(innerNode.css('backgroundColor'), 'rgb(1, 10, 57)')
            this.eq(setupCalled, 1)
            this.eq(killCalled, 1)

            this.log("not second child (again)")
            block.remove(0)
            setTimeout(function() {

            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 2)
            this.eq(killCalled, 1)

            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
        })

        this.test("native pseudoclass styling broken by a block's computedStyleMap (2)", function() {
            this.count(12)

            var setupCalled= 0, killCalled=0
            var style = Style({
                CheckBox: {
                    $setup: function() { // this makes CheckBox unable to be rendered with pure css
                       setupCalled++
                    },
                    $kill: function() {
                       killCalled++
                    }
                }
            })

            var checkbox = CheckBox()
            var inner = Container([checkbox])
            var block = Container([inner])
            block.style = style
            inner.style = Style({
                '$$nthChild(2)': {
                    backgroundColor: 'rgb(1, 11, 57)',
                    CheckBox: {
                        color: 'rgb(128, 129, 230)'
                    }
                }
            })

            testUtils.demo("native psuedoclass styling broken by a block's computedStyleMap", block)

            this.log("not second child")
            setTimeout(function() {

            var checkboxNode = $(checkbox.domNode)
            var innerNode = $(inner.domNode)
            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 1)
            this.eq(killCalled, 0)

            this.log("second child")
            block.addAt(0, Text("nope"))
            setTimeout(function() {
            this.eq(checkboxNode.css('color'), 'rgb(128, 129, 230)')
            this.eq(innerNode.css('backgroundColor'), 'rgb(1, 11, 57)')
            this.eq(setupCalled, 1)
            this.eq(killCalled, 1)

            this.log("not second child (again)")
            block.remove(0)
            setTimeout(function() {

            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 2)
            this.eq(killCalled, 1)

            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
        })

        this.test("basic psuedoclass styling (some emulated some not)", function() {
            this.count(40)

            var C = proto(Block, function(superclass) {
                this.name = 'C'

                this.build = function() {
                    this.style = style

                    var container = Container([CheckBox()])

                    this.add(
                        CheckBox(),
                        container
                    )
                }
            })

            var style = Style({
                color: 'rgb(128, 0, 0)',

                CheckBox: {
                    color: 'rgb(0, 128, 0)',

                    $$disabled: {
                        color: 'rgb(123, 130, 130)',
                        outline: '1px solid rgb(60, 60, 200)'
                    },

                    $$checked: {
                        color: 'rgb(128, 128, 128)',
                        outline: '4px solid rgb(80, 90, 100)',
                        $$required: {
                            color: 'rgb(130, 0, 130)',
                            backgroundColor: 'rgb(1, 2, 3)',

                            $setup: function(c) {
                                c.someProperty = 'required'
                            },
                            $kill: function(c) {
                                c.someProperty = 'optional'
                            }
                        }
                    }
                },

                Container: {
                    CheckBox: {color: 'rgb(0, 128, 0)'},
                    $$required: {
                        CheckBox: {
                            color: 'rgb(128, 128, 128)',

                            $$checked: {
                                $setup: function(c) {
                                    c.someProperty = 'required'
                                },
                                $kill: function(c) {
                                    c.someProperty = 'optional'
                                }
                            }
                        }
                    }
                }
            })

            var component = C()
            testUtils.demo("basic psuedo-class styling", component)

            var children = component.children

            var firstCheckBoxComponent = children[0]
            var firstCheckBox = $(firstCheckBoxComponent.domNode)
            this.eq(firstCheckBox.css('color'), 'rgb(0, 128, 0)')

            this.log('just disabled')
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {    // need to use a timeout every time an attribute changes because the MutationObserver that listens for attribute changes is asynchornous and won't fire until the scheduler is reached
            this.eq(firstCheckBox.css('color'), 'rgb(123, 130, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(60, 60, 200)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBoxComponent.someProperty, undefined)
            firstCheckBoxComponent.attr('disabled', undefined)
            setTimeout(function() {

            this.log("just checked")
            firstCheckBoxComponent.selected = true
            this.eq(firstCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(firstCheckBox.css('outlineColor') , 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBox.css('outlineWidth'), '4px')
            this.eq(firstCheckBoxComponent.someProperty, undefined)
            firstCheckBoxComponent.selected = false

            this.log("just required")
            firstCheckBoxComponent.attr('required', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(0, 128, 0)') // the required pseudoclass doesn't apply because its within the checked psudeoclass (and the box isn't checked)
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(0, 128, 0)') // default outline color is whatever the 'color' property is
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBoxComponent.someProperty, undefined)

            this.log("required and disabled")
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(123, 130, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(60, 60, 200)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBoxComponent.someProperty, undefined)
            firstCheckBoxComponent.attr('required', undefined)
            setTimeout(function() {

            this.log("disabled and checked")
            firstCheckBoxComponent.selected = true
            this.eq(firstCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBoxComponent.someProperty, undefined)
            firstCheckBoxComponent.attr('disabled', undefined)

            this.log("checked and required")
            firstCheckBoxComponent.attr('required', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(130, 0, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), 'rgb(1, 2, 3)')
            this.eq(firstCheckBox.css('outlineWidth'), '4px')
            this.eq(firstCheckBoxComponent.someProperty, 'required')

            this.log("all 3: checked, required, and disabled")
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(130, 0, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), 'rgb(1, 2, 3)')
            this.eq(firstCheckBoxComponent.someProperty, 'required')

            this.log("just required (again)")
            firstCheckBoxComponent.attr('disabled', false)
            firstCheckBoxComponent.selected = false
            setTimeout(function() {
            this.eq(firstCheckBoxComponent.someProperty, 'optional')

            var secondCheckBoxComponent = children[1].children[0]
            var secondCheckBox = $(secondCheckBoxComponent.domNode)
            this.eq(secondCheckBox.css('color'), 'rgb(0, 128, 0)')
            this.eq(secondCheckBoxComponent.someProperty, undefined)

            this.log("just required")
            children[1].attr('required', true)
            setTimeout(function() {
            this.eq(secondCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(secondCheckBoxComponent.someProperty, undefined)
            children[1].attr('required', undefined)
            setTimeout(function() {

            this.log("just checked")
            secondCheckBoxComponent.selected = true
            this.eq(secondCheckBox.css('color'), 'rgb(0, 128, 0)')
            this.eq(secondCheckBoxComponent.someProperty, undefined)

            this.log("checked and required")
            children[1].attr('required', true)
            setTimeout(function() {
            this.eq(secondCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(secondCheckBoxComponent.someProperty, 'required')
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
        })

        this.test('combination of side-by-side emulated psuedoclasses', function(t) {
            var red = 'rgb(128, 0, 0)'
            var style = Style({
                '$$nthChild(1)': {
                    textDecoration: 'underline'
                },

                '$$nthChild(2n+1)': {
                    color: red
                }
            })

            var x,y;
            var c = Container([
                x = Text('a'),
                y = Text('b')
            ])
            testUtils.demo('combination of side-by-side emulated psuedoclasses', c)
            x.style = style
            y.style = style

            t.eq($(x.domNode).css('color'), red)
            t.ok($(x.domNode).css('textDecoration').indexOf('underline') !== -1)
            t.ok($(y.domNode).css('color') !== red)
            t.eq($(y.domNode).css('textDecoration').indexOf('underline'), -1)
        })

        this.test('validate manually', function() {
            this.test("pseudo elements (native)", function() {
                var red = 'rgb(128, 0, 0)'
                var style = Style({
                    $$selection: {
                        color: red
                    }
                })

                var c = Text('When you select this, it should turn red')
                testUtils.manualDemo("pseudo elements (native)", c)
                c.style = style
            })
            this.test('visited', function() {
                var C = proto(Block, function(superclass) {
                    this.name = 'C'

                    this.build = function(text, link) {
                        this.domNode = domUtils.node('a')

                        this.attr('href', link)
                        this.attr('style', "display:block;")
                        this.domNode.textContent = text
                        this.on('click', function(e) {
                            e.preventDefault() // prevents you from going to the link location on-click
                        })

                        this.style = style
                    }
                })

                var style = Style({
                    color: 'rgb(150, 0, 0)',
                    $$visited: {
                        color: 'rgb(0, 128, 0)',

                        $$focus: {
                            color: 'rgb(0, 70, 200)'
                        }
                    }
                })

                var component1 = C("This should be green when not in focus, and blue when you click on it (if its not, visit google then try again)", "http://www.google.com/")
                    component1.attr('tabindex', 1) // to make it focusable
                var component3 = C("This should be red (even when clicked on)", "http://www.thisdoesntexistatall.com/notatall")
                    component3.attr('tabindex', 1) // to make it focusable

                // these need to be manually verified because the 'visited' pseudClass styles can't be verified via javascript for "security" reasons (privacy really)
                testUtils.manualDemo('Manually verify these: component :visited pseudo-class styling', Container([component1, component3]))

                component1.focus = true

                this.test('errors', function() {
                    this.count(1)

                    try {
                        Style({
                            Anything: {
                                $$visited: {
                                    CheckBox: {
                                        $setup: function() {
                                        }
                                    }
                                }
                            }
                        })
                    } catch(e) {
                        this.eq(e.message, "Pseudoclass visited isn\'t emulated, but has a style that can\'t be rendered in pure css")
                    }
                })
            })
        })

        this.test('not', function(t) {
            var red = 'rgb(128, 0, 0)'
            var teal = 'rgb(0, 128, 128)'
            var style = Style({
                Text: {
                    '$$not(:nthChild(1))': {
                        color: red
                    }
                },
                Container:{
                    '$$not(:nthChild(3))': {
                        Text: {
                            color: teal
                        }
                    }
                }
            })

            var c = Container([
                Text('a'),
                Text('b'),
                Container([Text('c')]),
                Container([Text('d')])
            ])
            testUtils.demo('not', c)
            c.style = style

            t.eq($(c.children[0].domNode).css('color'), 'rgb(0, 0, 0)')
            t.eq($(c.children[1].domNode).css('color'), red)
            t.eq($(c.children[2].children[0].domNode).css('color'), 'rgb(0, 0, 0)')
            t.eq($(c.children[3].children[0].domNode).css('color'), teal)

        })

        this.test('js-rendered pseudoclasses', function() {

            this.test('last-child', function(t) {
                this.count(7)

                var C = proto(Block, function(superclass) {
                    this.name = 'C'

                    this.build = function() {
                        this.add(Text("a"))
                        this.add(Text("b"))
                        this.add(Text("c"))
                        this.add(Text("d"))

                        this.style = style
                    }
                })

                var style = Style({
                    Text:{
                        $$lastChild: {
                            color: 'rgb(128, 0, 0)',
                            $setup: function() {}, // forces it to render in javascript
                            $kill: function() {}
                        }
                    }
                })

                var component1 = C()
                testUtils.demo('last-child', component1)

                var children = component1.domNode.children
                this.eq($(children[0]).css('color'), 'rgb(0, 0, 0)')
                this.eq($(children[1]).css('color'), 'rgb(0, 0, 0)')
                this.eq($(children[2]).css('color'), 'rgb(0, 0, 0)')
                this.eq($(children[3]).css('color'), 'rgb(128, 0, 0)')
                var classes = children[3].classList
                this.eq(classes.length, 2)  // one is the main default, and the other is the set active styling

                // dynamically adding elements

                component1.add(Text('e'))

                setTimeout(function() {  // the styles won't actually be applied until the thread runs back to the scheduler
                    t.eq($(children[3]).css('color'), 'rgb(0, 0, 0)')
                    t.eq($(children[4]).css('color'), 'rgb(128, 0, 0)')
                },0)
            })

            this.test('nth-child', function() {
                var C = proto(Block, function(superclass) {
                    this.name = 'C'

                    this.build = function() {
                        this.add(Text("a"))
                        this.add(Text("b"))
                        this.add(Text("c"))
                        this.add(Text("d"))

                        this.style = style
                    }
                })

                var style = Style({
                    Text:{
                        '$$nthChild(1)': {
                            color: 'rgb(128, 0, 0)',
                            $setup: function() {}, // forces it to render in javascript
                            $kill: function() {}
                        },
                        '$$nthChild(2n)': {
                            color: 'rgb(0, 128, 128)',
                            $setup: function() {}, // forces it to render in javascript
                            $kill: function() {}
                        }
                    }
                })

                var component1 = C()
                testUtils.demo('nth-child', component1)

                var children = component1.domNode.children
                this.eq($(children[0]).css('color'), 'rgb(128, 0, 0)')
                this.eq($(children[1]).css('color'), 'rgb(0, 128, 128)')
                this.eq($(children[2]).css('color'), 'rgb(0, 0, 0)')
                this.eq($(children[3]).css('color'), 'rgb(0, 128, 128)')

                this.test('more nth-child?', function(t) {
                    this.count(5)

                    var red = 'rgb(128, 0, 0)'
                    var teal = 'rgb(0, 128, 128)'

                    var style = Style({
                        Container:{
                            '$$nthChild(2)': {
                                Text: {
                                    color: red,
                                    $setup: function() {}, // forces it to render in javascript
                                    $kill: function() {}
                                }
                            },
                            '$$nthChild(2n+1)': {
                                Text: {
                                    color: teal,
                                    $setup: function() {}, // forces it to render in javascript
                                    $kill: function() {}
                                }
                            }
                        }
                    })

                    var c = Container([])
                    testUtils.demo('nth-child emulation', c)
                    c.style = style

                    c.add(Container([Text('a')]))
                    c.add(Container([Text('b')]))
                    c.add(Container([Text('c')]))
                    c.add(Container([Text('d')]))
                    c.add(Container([Text('e')]))

                    setTimeout(function() {
                        t.eq($(c.children[0].children[0].domNode).css('color'), teal)
                        t.eq($(c.children[1].children[0].domNode).css('color'), red)
                        t.eq($(c.children[2].children[0].domNode).css('color'), teal)
                        t.eq($(c.children[3].children[0].domNode).css('color'), 'rgb(0, 0, 0)')
                        t.eq($(c.children[4].children[0].domNode).css('color'), teal)
                    },0)
                })

                this.test("nth-child without parent", function(t) {
                    this.count(3)


                    var black = 'rgb(0, 0, 0)'
                    var red = 'rgb(128, 0, 0)'
                    var style = Style({
                        '$$nthChild( 1 + 1 n )': {
                            color: red,
                            $setup: function() {}, // forces it to render in javascript
                            $kill: function() {}
                        }
                    })

                    var box = Container([])
                    var c = Container([])
                    c.style = style

                    c.add(Text("moo"))
                    c.add(Text("moo2"))

                    box.add(c)
                    testUtils.demo("nth-child without parent", box)

                    setTimeout(function() {                              // allow the changes to propagate
                        t.eq($(c.children[0].domNode).css('color'), red)
                        t.eq($(c.children[1].domNode).css('color'), red)

                        var one = c.children[1]
                        c.remove(one)
                        setTimeout(function() {                          // allow the changes to propagate
                            box.add(one)
                            t.eq($(one.domNode).css('color'), black)
                        },0)
                    },0)
                })
            })

//            todo: do this when you can figure out how syn.move works
//            this.test("hover", function(t) {
//                this.count(3)
//
//                var style = Style({
//                    $$hover: {
//                        color: 'rgb(200, 0, 0)'
//                    }
//                })
//
//                var text = Text("a")
//                text.style = style
//
//                testUtils.demo('hover', text)
//
//                this.eq($(text.domNode).css('color'), 'rgb(0, 0, 0)')
//
//                syn.move({pageX: 100, pageY:100}, text.domNode).then(function() {
//                    t.eq($(text.domNode).css('color'), 'rgb(200, 0, 0)')
//
//                    return syn.move(text.domNode, {pageX: 100, pageY:100})
//                }).then(function() {
//                    t.eq($(text.domNode).css('color'), 'rgb(0, 0, 0)')
//                }).done()
//            })
        })

    })

    this.test("test styling objects that inherit from a component", function() {

        var S = Style({
            Text: Style({
                color: 'rgb(128, 0, 0)'
            })
        })

        var inheritsFromText = proto(Text, function() {})

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S
                this.add(inheritsFromText('inParent'))
            }
        })

        var node = C()
        testUtils.demo("test styling objects that inherit from a component", node)

        var text = $($(node.domNode).children('div')[0])

        this.eq(text.css('color'), 'rgb(128, 0, 0)')
    })

    this.test("component state", function(t) {
        var setupCalled = 0
        var S = Style({
            color: 'rgb(0, 100, 0)',
            backgroundColor: 'rgb(23, 45, 99)',
            $state: function(state) {
                if(state.boggled) {
                    var color = 'rgb(100, 0, 0)'
                } else {
                    var color = 'rgb(0, 0, 100)'
                }

                // note: do not create styles like this within the $state function if at all possible
                // a new Style object is created every run, and probably won't get garbage collected, also obviously creating a new style is much slower than just referencing an already-created one
                return Style({
                    color: color,
                    $setup: function() {
                        setupCalled++
                    },
                    $kill: function() {
                        // requisite
                    }
                })
            }
        })

        var c = Text("hi")
        c.style = S

        testUtils.demo("component state", c)

        var text = $(c.domNode)
        this.eq(text.css('color'), 'rgb(0, 0, 100)')
        this.eq(text.css('backgroundColor'), 'rgb(23, 45, 99)')
        this.eq(setupCalled, 1)

        c.state.set('boggled', true)
        this.eq(text.css('color'), 'rgb(100, 0, 0)')
        this.eq(text.css('backgroundColor'), 'rgb(23, 45, 99)')
        this.eq(setupCalled, 2)

        c.style = undefined
        this.eq(text.css('color'), 'rgb(0, 0, 0)')
        this.eq(text.css('backgroundColor'), defaultBackgroundColor)
        this.eq(setupCalled, 2)
    })

    this.test("$inherit", function() {
        this.test("$inherit from component style map", function() {
            var style = Style({
                Container: {
                    backgroundColor: 'rgb(12, 14, 19)',
                    Container: {
                        $inherit: true,
                        color: 'rgb(15, 25, 35)'
                    }
                }
            })

            var inner;
            var thing = Container([Container([inner = Container([Text("hi")])])])
            thing.style = style
            testUtils.demo("$inherit from component style map", thing)

            var innerNode = $(inner.domNode)
            this.eq(innerNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(innerNode.css('backgroundColor'), 'rgb(12, 14, 19)')
        })

        this.test("label style inheriting from from sibling", function() {
            var style = Style({
                Text: {
                    backgroundColor: 'rgb(12, 14, 19)'
                },
                $textLabel: {
                    $inherit: true,
                    color: 'rgb(15, 25, 35)'
                }
            })

            var text;
            var thing = Container([text=Text('textLabel', "hi")])
            thing.style = style
            testUtils.demo("label style inheriting from from sibling", thing)

            var textNode = $(text.domNode)
            this.eq(textNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(textNode.css('backgroundColor'), 'rgb(12, 14, 19)')
        })
        this.test("explicit styling inheriting from component style map", function() {
            var style = Style({
                Text: {
                    backgroundColor: 'rgb(12, 14, 19)'
                }
            })

            var text;
            var thing = Container([text=Text('textLabel', "hi")])
            thing.style = style
            text.style = Style({
                $inherit: true,
                color: 'rgb(15, 25, 35)'
            })
            testUtils.demo("label style inheriting from from sibling", thing)

            var textNode = $(text.domNode)
            this.eq(textNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(textNode.css('backgroundColor'), 'rgb(12, 14, 19)')
        })

        this.test("inheriting from multiple levels of componentStyleMap", function() {
            var style = Style({
                Text: {
                    backgroundColor: 'rgb(12, 14, 19)'
                },
                Container: {
                    Text: {
                        $inherit: true,
                        color: 'rgb(15, 25, 35)'
                    },
                    Container: {
                        Text: {
                            $inherit: true,
                            width: 30
                        }
                    }
                }
            })

            var inner;
            var thing = Container([Container([Container([inner = Text("hi")])])])
            thing.style = style
            testUtils.demo("$inherit from component style map", thing)

            var innerNode = $(inner.domNode)
            this.eq(innerNode.css('backgroundColor'), 'rgb(12, 14, 19)')
            this.eq(innerNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(innerNode.css('width'), '30px')
        })

        this.test("inheriting from multiple names of the same component", function() {
            var Text2 = proto(Text, function(superclass) {
                this.name = 'Text2'
            })
            var Text3 = proto(Text2, function(superclass) {
                this.name = 'Text3'
            })

            var style = Style({
                Text: {
                    backgroundColor: 'rgb(12, 14, 19)'
                },
                Text2: {
                    $inherit: true,
                    color: 'rgb(15, 25, 35)'
                },
                Text3: {
                    $inherit: true,
                    width: 30
                },
                $label: {
                    $inherit: true,
                    height: 30
                }
            })

            var inner;
            var thing = Container([
                inner=Text3('label', "hi")
            ])
            thing.style = style
            testUtils.demo("$inherit from component style map", thing)

            var innerNode = $(inner.domNode)
            this.eq(innerNode.css('backgroundColor'), 'rgb(12, 14, 19)')
            this.eq(innerNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(innerNode.css('width'), '30px')
            this.eq(innerNode.css('height'), '30px')
        })

//        this one is very confusing unless order is preserved between labels and block styles
//        this.test("inheriting from multiple levels of componentStyleMap", function() {
//            var style = Style({
//                Text: {
//                    backgroundColor: 'rgb(12, 14, 19)'
//                },
//                Container: {
//                    $textLabel: {
//                        $inherit: true,
//                        color: 'rgb(15, 25, 35)'
//                    },
//                    Container: {
//                        Text: {
//                            $inherit: true,
//                            width: 30
//                        }
//                    }
//                }
//            })
//
//            var inner;
//            var thing = Container([Container([inner = Container([Text("hi")])])])
//            thing.style = style
//            testUtils.demo("$inherit from component style map", thing)
//
//            var innerNode = $(inner.domNode)
//            this.eq(innerNode.css('color'), 'rgb(15, 25, 35)')
//            this.eq(innerNode.css('backgroundColor'), 'rgb(12, 14, 19)')
//        })
    })

    this.test('former bugs', function() {
        this.test('propogating inner style wasnt working', function() {
            var S = Style({
                    Container: {
                        Button: {
                            color: 'rgb(1,2,3)'
                        }
                    }
                })

            var C = Text('X')
                C.style = S
                var A = Container()
                    var B = Button('b')
                A.add(B)
            C.add(A)

            testUtils.demo('propogating inner style wasnt working', C)

            this.eq($(B.domNode).css('color'), 'rgb(1, 2, 3)')
        })

        this.test('inner styles inside labels werent working right', function() {
            var S = Style({
                $label: {
                    Text: {
                        color: 'rgb(1,2,3)'
                    }
                }
            })

            var c = Container([
                Container('label', [Text('hi')])
            ])
            c.style = S

            testUtils.demo('inner styles inside labels werent working right', c)

            this.eq($(c.children[0].children[0].domNode).css('color'), 'rgb(1, 2, 3)')
        })

        this.test('inner styles inside labels werent working right when there was a style outside the label', function() {
            var S = Style({
                $label: {
                    Text: {
                        color: 'rgb(1,2,3)'
                    }
                },
                Text: {
                    color: 'rgb(20,50,90)'
                }
            })

            var c = Container([
                Container('label', [Text('hi')])
            ])
            c.style = S

            var superContainer = Container([c]) // the component has to be added to a parent for the bug to manifest

            testUtils.demo('inner styles inside labels werent working right when there was a style outside the label', superContainer)

            this.eq($(c.children[0].children[0].domNode).css('color'), 'rgb(1, 2, 3)')
        })

        this.test('removing the last child component failed', function() {
            var c = Container([Text('a')])
            c.remove(0)
        })

        this.test("loading blocks.js twice caused weird behavior - defaulting overriding main styling", function(t) {
            this.count(6)

            var container = Container()
            testUtils.demo("loading blocks.js twice caused weird behavior - defaulting overriding main styling", container)

            var c = Text('a')
            c.defaultStyle =  Style({
                display: 'block'
            })
            c.style = Style({
                position: 'absolute'
            })

            container.add(c)

            t.eq($(c.domNode).css('position'), 'absolute')
            t.eq($(c.domNode).css('display'), 'block')

            // because of webpack's shaddowing (i'm guessing) this will cause window.blocks to get populated instead of being passed back to require.js (thus the "undefinedResult")
            requirejs(["/dist/blocks.umd.js"], function(undefinedResult) {
                t.eq($(c.domNode).css('position'), 'absolute')
                t.eq($(c.domNode).css('display'), 'block')

                var d = window.blocks.Text("d")
                d.defaultStyle =  Style({
                    display: 'block'
                })
                d.style = Style({
                    position: 'absolute'
                })

                container.add(d)
                t.eq($(d.domNode).css('position'), 'absolute')
                t.eq($(d.domNode).css('display'), 'block')
            })
        })

        this.test("exception for Style with undefined value", function() {
            return Style({
                backgroundColor: undefined
            })
        })

        this.test('last-child not working when more children are added asynchronously', function(t) {
            this.count(10)

            var C = proto(Block, function(superclass) {
                this.name = 'C'

                this.build = function() {
                    this.add(Text("a"))
                    this.style = style
                }
            })

            var style = Style({
                Text:{
                    $$lastChild: {
                        color: 'rgb(128, 0, 0)'
                    }
                }
            })

            var component1 = C()
            testUtils.demo('last-child', component1)

            t.eq($(component1.children[0].domNode).css('color'), 'rgb(128, 0, 0)')

            setTimeout(function() {
                component1.add(Text('b'))
                t.eq($(component1.children[0].domNode).css('color'), 'rgb(0, 0, 0)')
                t.eq($(component1.children[1].domNode).css('color'), 'rgb(128, 0, 0)')

                setTimeout(function() {
                    component1.add(Text('c'))
                    t.eq($(component1.children[0].domNode).css('color'), 'rgb(0, 0, 0)')
                    t.eq($(component1.children[1].domNode).css('color'), 'rgb(0, 0, 0)')
                    t.eq($(component1.children[2].domNode).css('color'), 'rgb(128, 0, 0)')

                    setTimeout(function() {
                        component1.add(Text('d'))
                        t.eq($(component1.children[0].domNode).css('color'), 'rgb(0, 0, 0)')
                        t.eq($(component1.children[1].domNode).css('color'), 'rgb(0, 0, 0)')
                        t.eq($(component1.children[2].domNode).css('color'), 'rgb(0, 0, 0)')
                        t.eq($(component1.children[3].domNode).css('color'), 'rgb(128, 0, 0)')
                    },0)
                },0)
            },0)
        })

        this.test('native pseudoclass style overriding block default styles when they must override a StyleMap style with "initial"', function(t) {

            var C = proto(Text, function(superclass) {
                this.name = 'blah'

                this.defaultStyle = Style({
                    color: 'rgb(100, 200, 250)'
                })
            })

            var text = C("a'llo")
            var c = Container([
                Container('a', [text])
            ])
            c.style = Style({
                Text: {
                    color: 'rgb(12, 25, 36)',
                    display: "block"
                },
                $a: {
                    '$$nthChild(1)': {
                        Text: {
                            // color left as default (which should override the 'red' above)
                        }
                    }
                }
            })

            testUtils.demo('native pseudoclass style overriding block default styles when they must override a StyleMap style with "initial"', c)

            t.eq($(text.domNode).css('color'), 'rgb(100, 200, 250)')
            t.eq($(text.domNode).css('display'), 'inline-block') // should be the base default value
        })

        this.test('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', function(t) {

            var C = proto(Container, function(superclass) {
                this.name = 'blah'
            })

            var text = C(Text("a'llo"))
            var c = Container([
                Container('a', [text])
            ])
            c.style = Style({
                Container: {
                    display: "block"
                },
                $a: {
                    '$$nthChild(1)': {
                        Container: {
                            // color left as default (which should override the 'red' above)
                        }
                    }
                }
            })

            testUtils.demo('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', c)

            t.eq($(text.domNode).css('display'), 'inline-block') // should be the base default value
        })

        this.test('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', function(t) {

            var C = proto(Container, function(superclass) {
                this.name = 'TicketView'
            })

            var thing = C(Text("a'llo"))
            var c = Container([
                C([thing])
            ])
            c.style = Style({
                TicketView: {
                    display: 'block',

                    TicketView: {
                        display: 'block',
                        minHeight: 22,

                        borderBottom: "1px solid red",

                        $$lastChild: {
                            borderBottom: 'none'
                        },
                        $componentContainer: {
                            display: 'flex',
                            alignItems: 'center',
                        }
                    }
                }
            })

            testUtils.demo('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', c)

            t.eq($(thing.domNode).css('display'), 'block') // should be the set value
            t.eq($(thing.domNode).css('minHeight'), '22px')
            t.eq($(thing.domNode).css('borderBottom'), '0px none rgb(0, 0, 0)')   // this is what you get back for "none"
        })

        this.test('native pseudoclass style not overriding competing psuedoclass styles', function(t) {

            var C = proto(Container, function(superclass) {
                this.name = 'Whatever'
            })

            var thing = C(Text("a'llo"))
            var c = Container([
                Container([thing])
            ])
            c.style = Style({
                Container: {
                    Whatever: {
                        display: 'table-cell',

                        $$firstChild: {
                            color: 'rgb(45, 46, 49)'
                        }
                    },

                    $$firstChild: {
                        Whatever: {

                        }
                    }
                },
            })

            testUtils.demo('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', c)

            t.eq($(thing.domNode).css('color'), 'rgb(0, 0, 0)')
            t.eq($(thing.domNode).css('display'), 'inline-block')
        })

        this.test("improper caching caused invalid styles to be returned - case 1", function() {

            var text = Text("text")
            var inner = Container([Container('wrapper', [text])])
            inner.style = Style({
                marginRight: 2,

                Text: {
                    minWidth: 22,
                }
            })

            var component = Container(Container([inner]))
            component.style = Style({
                Container: {
                    display: 'block'
                }
            })

            testUtils.demo('improper caching caused invalid styles to be returned - case 1', component)

            this.eq($(text.domNode).css('minWidth'), '22px')
        })

        this.test("improper caching caused invalid styles to be returned - case 2", function() {

            var text = Text()
            var inner = Container([Container('wrapper', [text])])
            inner.style = Style({
                marginRight: 2,

                Text: {
                    minWidth: 22,
                    padding: '0 2px',
                    textAlign: 'center',
                    border: '1px solid black',
                    minHeight: 18,
                    lineHeight: '15px',
                    cursor: 'pointer'
                },

                UserSelection: {
                    $setup: function(){},
                    Container: {}  /// ????? why does removing this make the style *not* work?
                }
            })

            var component = Container(Container([inner]))
            component.style = Style({
                Container: {
                    display: 'block'
                }
            })

            testUtils.demo("improper caching caused invalid styles to be returned - case 2", component)

            this.eq($(text.domNode).css('borderWidth'), '1px')
        })

    })
    //*/
}