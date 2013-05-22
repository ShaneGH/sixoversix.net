var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Constants = {
    facebook: "http://www.facebook.com/sixoversixmusic"
};
ko.bindingHandlers["trigger"] = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var values = valueAccessor();
        values["bind"].call(bindingContext.$data, element, ko.utils.unwrapObservable(values["value"]));
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var values = valueAccessor();
        values["action"].call(bindingContext.$data, element, ko.utils.unwrapObservable(values["value"]));
    }
};
var SixOverSix;
(function (SixOverSix) {
    var Event = (function () {
        function Event(Owner) {
            this.Owner = Owner;
            this._Subscribers = new Array();
            if(!Owner) {
                throw "Argument null exception";
            }
        }
        Event.prototype.Register = function (callback) {
            var _this = this;
            this._Subscribers.push(callback);
            return {
                dispose: function () {
                    _this.UnRegister(callback);
                }
            };
        };
        Event.prototype.UnRegister = function (callback) {
            for(var i = 0; i < this._Subscribers.length; i++) {
                if(this._Subscribers[i] === callback) {
                    this._Subscribers.splice(i, 1);
                    return;
                }
            }
        };
        Event.prototype.Fire = function (eventArgs) {
            for(var i = 0; i < this._Subscribers.length; i++) {
                this._Subscribers[i](this.Owner, eventArgs != null ? eventArgs : {
                });
            }
        };
        return Event;
    })();
    SixOverSix.Event = Event;    
    var Spacer = (function () {
        function Spacer($parent, height, width) {
            var _this = this;
            this.Height = ko.observable("1px");
            this.Width = ko.observable("1px");
            var recalculate = function () {
                if(height) {
                    _this.Height(height($parent) + "px");
                }
                if(width) {
                    _this.Width(width($parent) + "px");
                }
            };
            $(window).on("resize", recalculate);
            recalculate();
        }
        return Spacer;
    })();
    SixOverSix.Spacer = Spacer;    
    var App = (function () {
        function App() {
            this.Menu = new TopMenu();
            this.Content = new ContentPane($("#content"));
        }
        return App;
    })();
    SixOverSix.App = App;    
    var TopMenu = (function () {
        function TopMenu() {
            this.Items = ko.observableArray();
            this.Spacer = new Spacer($("#content"), function ($parent) {
                var result = ($parent.width() / 19) - 50;
                return result > 0 ? result : 1;
            });
        }
        TopMenu.prototype.DeselectAll = function () {
            var items = this.Items();
            for(var i = 0, ii = items.length; i < ii; i++) {
                items[i].Selected(false);
            }
        };
        TopMenu.prototype.Home = function () {
            this.DeselectAll();
            document.getElementById("logo1").style.display = null;
            $("#logo1").animate({
                opacity: 1
            }, 500);
            $("#logo2").animate({
                opacity: 0
            }, 500, null, function () {
                this.style.display = "none";
            });
        };
        return TopMenu;
    })();
    SixOverSix.TopMenu = TopMenu;    
    var MenuItem = (function () {
        function MenuItem(Name, Parent) {
            this.Name = Name;
            this.Parent = Parent;
            this.Template = "MenuItem";
            this.Selected = ko.observable(false);
        }
        MenuItem.prototype.OnClick = function () {
            if(!this.Selected()) {
                this.Parent.DeselectAll();
                this.Selected(true);
            }
        };
        return MenuItem;
    })();
    SixOverSix.MenuItem = MenuItem;    
    var LinkMenuItem = (function (_super) {
        __extends(LinkMenuItem, _super);
        function LinkMenuItem(name, parent, Href) {
                _super.call(this, name, parent);
            this.Href = Href;
            this.Template = "LinkMenuItem";
        }
        LinkMenuItem.prototype.OnClick = function () {
            _super.prototype.OnClick.call(this);
            window.location.href = Constants.facebook;
        };
        return LinkMenuItem;
    })(MenuItem);
    SixOverSix.LinkMenuItem = LinkMenuItem;    
    var ContentMenuItem = (function (_super) {
        __extends(ContentMenuItem, _super);
        function ContentMenuItem(name, parent, Content) {
            var _this = this;
                _super.call(this, name, parent);
            this.Content = Content;
            this.Selected.subscribe(function (a) {
                _this.Content.Selected(a);
            });
        }
        ContentMenuItem.prototype.OnClick = function () {
            _super.prototype.OnClick.call(this);
            document.getElementById("logo2").style.display = null;
            $("#logo1").animate({
                opacity: 0
            }, 500, null, function () {
                this.style.display = "none";
            });
            $("#logo2").animate({
                opacity: 1
            });
        };
        return ContentMenuItem;
    })(MenuItem);
    SixOverSix.ContentMenuItem = ContentMenuItem;    
    var ContentItem = (function () {
        function ContentItem(Title, Content) {
            this.Title = Title;
            this.Content = Content;
            this.Selected = ko.observable(false);
            this.Toggle = false;
        }
        ContentItem.prototype.Trigger = function (element, visible) {
            if(this.Toggle !== this.Selected()) {
                $(element).slideToggle();
                this.Toggle = this.Selected();
            }
        };
        ContentItem.prototype.Bind = function (element, visible) {
            $(element).hide();
        };
        return ContentItem;
    })();
    SixOverSix.ContentItem = ContentItem;    
    var SignupContentItem = (function () {
        function SignupContentItem(Template) {
            this.Template = Template;
            var _this = this;
            this.Email = ko.observable("");
            this.Name = ko.observable("");
            this.Sending = ko.observable(false);
            this.Blinking = ko.observable(true);
            this.ShowSuccess = ko.observable(false);
            var begin = function () {
                if(!_this.Sending()) {
                    return;
                }
                _this.Blinking(!_this.Blinking());
                setTimeout(begin, 500);
            };
            this.Sending.subscribe(function () {
                if(_this.Sending()) {
                    begin();
                }
            });
        }
        SignupContentItem.prototype.SubmitEmail = function () {
            var _this = this;
            this.Sending(true);
            $.ajax({
                dataType: "json",
                data: {
                    email: this.Email(),
                    name: this.Name()
                },
                error: function () {
                    _this.Sending(false);
                    _this.OnSubmitError("There has been an error sending your request");
                },
                success: function (result) {
                    _this.Sending(false);
                    if(result.message.toLowerCase() !== "success") {
                        _this.OnSubmitError(result.message);
                    } else {
                        _this.Name("");
                        _this.Email("");
                        _this.ShowSuccess(true);
                        setTimeout(function () {
                            _this.ShowSuccess(false);
                        }, 4000);
                    }
                },
                type: "POST",
                url: "signup.php"
            });
        };
        SignupContentItem.prototype.OnSubmitError = function (error) {
            alert(error);
        };
        return SignupContentItem;
    })();
    SixOverSix.SignupContentItem = SignupContentItem;    
    var ContentPane = (function (_super) {
        __extends(ContentPane, _super);
        function ContentPane($parent) {
                _super.call(this, $parent, function (a) {
        var taken = $parent.width() * 0.25;
        var remaining = $(window).height() - taken;
        return remaining > 0 ? remaining : 1;
    });
            this.Items = [];
        }
        return ContentPane;
    })(Spacer);
    SixOverSix.ContentPane = ContentPane;    
})(SixOverSix || (SixOverSix = {}));
$(document).ready(function () {
    var app = new SixOverSix.App();
    app.Menu.Items.push(new SixOverSix.LinkMenuItem("news", app.Menu, Constants.facebook));
    var i1 = new SixOverSix.ContentItem("Music", {
        Template: "MusicContent"
    });
    app.Content.Items.push(i1);
    app.Menu.Items.push(new SixOverSix.ContentMenuItem("music", app.Menu, i1));
    var i2 = new SixOverSix.ContentItem("Photos", {
        Template: "ComingSoon"
    });
    app.Content.Items.push(i2);
    app.Menu.Items.push(new SixOverSix.ContentMenuItem("photos", app.Menu, i2));
    var i3 = new SixOverSix.ContentItem("Sign Up", new SixOverSix.SignupContentItem("SignUp"));
    app.Content.Items.push(i3);
    app.Menu.Items.push(new SixOverSix.ContentMenuItem("sign-up", app.Menu, i3));
    var i4 = new SixOverSix.ContentItem("Contact", {
        Template: "Contact"
    });
    app.Content.Items.push(i4);
    app.Menu.Items.push(new SixOverSix.ContentMenuItem("contact", app.Menu, i4));
    ko.applyBindings(app);
    window.Application = app;
});
//@ sourceMappingURL=app.js.map
