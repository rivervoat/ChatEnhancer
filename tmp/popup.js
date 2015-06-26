document.addEventListener('DOMContentLoaded', function() {
    var createEl=function(x) {
        
        document.createElement.call(window, x);
    };
    var Event = function(event, callback) {
        this.event = event;
        this.callback = callback;
    };
    var Input = function(type, name, events) {
        this.type=type;
        this.name=name;
        this.events=events;
        this.el=null;
        
    };
    Input.prototype.render = function() {
        this.el = createEl('input');
        var el=this.el;
        el.attributes['type']=this.type;
        el.attributes['name']=this.name;
        this.events.map(function(x) {
            el.addEventListener(x.event, x.callback);
        });
        return el;
    };
    var Section = function(id, inputs, description, display) {
        this.inputs = inputs;
        this.description=description;
        if (display == undefined) {
            this.display = null;
        } else { this.display=display;}
        this.el=null;
        this.descriptEl=null;
        this.id=id;
    };
    Section.prototype.render = function() {
        this.el=createEl('div');
        this.el.id=this.id;
        var el = this.el;
        this.inputs.map(function(input) {
            el.appendChild(input.render());
        });
        this.descriptEl = createEl('div');
        this.descriptEl.classes = 'descript';
        el.appendChild(this.description.render());
        if (this.display) {
            el.appendChild(this.description.render());
        }
    };
    
    var e_click='click', e_change='change';
    var t_checkbox='checkbox', t_number='number';
    var t_text='text', t_button='button';
    var t_radio='radio';
    var sections= [
        new Section(
            'show-images',
            [new Input(t_checkbox,
                       'toggle',
                       [new Event(e_click,
                                  function() {
                                      console.log('toggle show imagse');
                                  })])],
            'Show images',
            null
        ),
        new Section(
            'show-videos',
            [new Input(t_checkbox,
                       'toggle',
                       [new Event(e_click,
                                  function() {
                                      console.log('toggle show videos');
                                  })])],
            'Show images',
            null
        ),            
        new Section(
            'media-size',
            [new Input(t_number,
                       'spin',
                       [new Event(e_change,
                                  function() {
                                      console.log('change media size');
                                  })])],
            'max image/video height',
            null
        ),
        new Section(
            'ignore',
            [new Input(t_text,
                       'field',
                       [new Event(e_change,
                                  function() {
                                      console.log('ignore field');
                                  })]),
             new Input(t_button,
                       'toggle',
                       [new Event(e_click,
                                  function() {
                                      console.log('ignore toggle');
                                  })]),
            ],
            'max image/video height',
            null
        ),
        new Section(
            'highlight',
            [new Input(t_text,
                       'field',
                       [new Event(e_change,
                                  function() {
                                      console.log('highlight field');
                                  })]),
             new Input(t_button,
                       'toggle',
                       [new Event(e_click,
                                  function() {
                                      console.log('highlight toggle');
                                  })]),
            ],
            'Highlight/stop highlighting messages with a particular TEXT or REGEX',
            null
        ),
        new Section(
            'show-list',
            [new Input(t_radio,
                       'select-list',
                       [new Event(e_click,
                                  function() {
                                      console.log('select ignore list');
                                  })]),
             new Input(t_radio,
                       'select-list',
                       [new Event(e_click,
                                  function() {
                                      console.log('select highlight list');
                                  })]),
             ],
            'Highlight/stop highlighting messages with a particular TEXT or REGEX',
            null
        ),

            

    ];
    el_form = document.getElementById(
        'ChatEnhancerForm');
    sections.map(function(s){
        el_form.appendChild(s.render());
    });
});
