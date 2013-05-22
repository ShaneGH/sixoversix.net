
/// <reference path="../external/imports.d.ts" />

interface Window {
    Application: SixOverSix.App;
}

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

module SixOverSix {

    export interface ITemplated {
        Template: string;
    }

    export interface ICommand {
        (): void;
    }

    export interface EventCallback {
        (sender: any, e: any): void;
    }

    export interface DisposeEvent {
        dispose: () => void;
    }

    export class Event {
        private _Subscribers = new EventCallback[];
        constructor(private Owner: any) {
            if (!Owner) {
                throw "Argument null exception";
            }
        }
        Register(callback: EventCallback): DisposeEvent {

            this._Subscribers.push(callback);

            return { dispose: () => { this.UnRegister(callback); } };
        }
        UnRegister(callback: EventCallback) {
            for (var i = 0; i < this._Subscribers.length; i++) {
                if (this._Subscribers[i] === callback) {
                    this._Subscribers.splice(i, 1);
                    return;
                }
            }
        }
        Fire(eventArgs) {
            for (var i = 0; i < this._Subscribers.length; i++) {
                this._Subscribers[i](this.Owner, eventArgs != null ? eventArgs : {});
            }
        }
    }

    export class Spacer {

        public Height: KnockoutObservableString = ko.observable("1px");
        public Width: KnockoutObservableString = ko.observable("1px");

        constructor($parent: JQuery, height?: (JQuery) => number, width?: (JQuery) => number) {
            var recalculate = () => {
                if (height) {
                    this.Height(height($parent) + "px");
                }

                if (width) {
                    this.Width(width($parent) + "px");
                }
            };

            $(window).on("resize", recalculate);
            recalculate();
        }
    }

    export class App {
        Menu: TopMenu = new TopMenu();
        Content: ContentPane = new ContentPane($("#content"));

        constructor() {

        }
    }

    export class TopMenu {
        Items = ko.observableArray();
        Spacer = new Spacer($("#content"), ($parent) => {
            var result = ($parent.width() / 19) - 50;
            return result > 0 ? result : 1;
        });

        DeselectAll() {
            var items: MenuItem[] = this.Items();
            for (var i = 0, ii = items.length; i < ii; i++) {
                items[i].Selected(false);
            }
        }

        Home() {
            this.DeselectAll();
            document.getElementById("logo1").style.display = null;
            $("#logo1").animate({ opacity: 1 }, 500);
            $("#logo2").animate({ opacity: 0 }, 500, null, function { this.style.display = "none"; });
        }
    }

    export class MenuItem {

        Template = "MenuItem";
        Selected = ko.observable(false);

        constructor(public Name: string, private Parent: TopMenu) { }

        public OnClick() {
            if (!this.Selected()) {
                this.Parent.DeselectAll();

                this.Selected(true);
            }
        }
    }

    export class LinkMenuItem extends MenuItem {

        Template = "LinkMenuItem";

        constructor(name: string, parent: TopMenu, private Href: string) {
            super(name, parent);
        }

        OnClick() {
            super.OnClick();

            window.location.href = Constants.facebook;
        }
    }

    export class ContentMenuItem extends MenuItem {

        constructor(name: string, parent: TopMenu, private Content: ContentItem) {
            super(name, parent);

            this.Selected.subscribe(a => {
                this.Content.Selected(a);
            });
        }

        OnClick() {
            super.OnClick();

            document.getElementById("logo2").style.display = null;
            $("#logo1").animate({ opacity: 0 }, 500, null, function { this.style.display = "none"; });
            $("#logo2").animate({ opacity: 1 });
        }
    }

    export class ContentItem {
        Selected = ko.observable(false);
        private Toggle = false;

        constructor(public Title: string, public Content: ITemplated) { }

        Trigger(element: HTMLElement, visible: bool) {
            if (this.Toggle !== this.Selected()) {
                $(element).slideToggle();
                this.Toggle = this.Selected();
            }
        }

        Bind(element: HTMLElement, visible: bool) {
            $(element).hide();
        }
    }

    export class SignupContentItem implements ITemplated {
        Email = ko.observable("");
        Name = ko.observable("");
        Sending = ko.observable(false);
        Blinking = ko.observable(true);
        ShowSuccess = ko.observable(false);

        constructor(public Template: string) {
            var begin = () => {
                if (!this.Sending())
                    return;

                this.Blinking(!this.Blinking());
                setTimeout(begin, 500);
            }

            this.Sending.subscribe(() => {
                if (this.Sending()) {
                    begin();
                }
            });
        }

        SubmitEmail() {
            this.Sending(true);
            $.ajax({
                dataType: "json",
                data: { email: this.Email(), name: this.Name() },
                error: () => {
                    this.Sending(false);
                    this.OnSubmitError("There has been an error sending your request");
                },
                success: (result) => {
                    this.Sending(false);
                    if (result.message.toLowerCase() !== "success") {
                        this.OnSubmitError(result.message);
                    } else {
                        this.Name("");
                        this.Email("");
                        this.ShowSuccess(true);
                        setTimeout(() => { this.ShowSuccess(false); }, 4000)
                    }
                },
                type: "POST",
                url: "signup.php"
            });
        }

        OnSubmitError(error: string) {
            alert(error);
        }
    }

    export class ContentPane extends Spacer {
        Items: ContentItem[] = [];
        constructor($parent: JQuery) {
            super($parent, a => {
                var taken = $parent.width() * 0.25;
                var remaining = $(window).height() - taken;
                return remaining > 0 ? remaining : 1;
            });
        }
    }
}

$(document).ready(() => {

    var app = new SixOverSix.App();

    // news
    app.Menu.Items.push(new SixOverSix.LinkMenuItem("news", app.Menu, Constants.facebook));

    // music
    var i1 = new SixOverSix.ContentItem("Music", { Template: "MusicContent" });
    app.Content.Items.push(i1);
    app.Menu.Items.push(new SixOverSix.ContentMenuItem("music", app.Menu, i1));

    // photos
    var i2 = new SixOverSix.ContentItem("Photos", { Template: "ComingSoon" });
    app.Content.Items.push(i2);
    app.Menu.Items.push(new SixOverSix.ContentMenuItem("photos", app.Menu, i2));

    // sign up
    var i3 = new SixOverSix.ContentItem("Sign Up", new SixOverSix.SignupContentItem("SignUp"));
    app.Content.Items.push(i3);
    app.Menu.Items.push(new SixOverSix.ContentMenuItem("sign-up", app.Menu, i3));

    // contact
    var i4 = new SixOverSix.ContentItem("Contact", { Template: "Contact" });
    app.Content.Items.push(i4);
    app.Menu.Items.push(new SixOverSix.ContentMenuItem("contact", app.Menu, i4));

    ko.applyBindings(app);
    window.Application = app;
});