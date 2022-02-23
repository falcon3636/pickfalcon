(function() {
    var a;
    var g = document.head;
    var j;
    var c;
    var k = g.querySelector("link[href='assets/css/app.css']");
    if (!k) {
        k = document.createElement("link");
        k.href = "assets/css/app.css";
        k.rel = "stylesheet";
        g.appendChild(k)
    }
    var i = g.querySelector("link[href='assets/css/api.min.css']");
    if (!i) {
        i = document.createElement("link");
        i.href = "assets/css/api.min.css";
        i.rel = "stylesheet";
        g.appendChild(i)
    }

    function b(r, p) {
        var q = document.createElement("script");
        q.type = "text/javascript";
        if (q.readyState) {
            q.onreadystatechange = function() {
                if (q.readyState == "loaded" || q.readyState == "complete") {
                    q.onreadystatechange = null;
                    p()
                }
            }
        } else {
            q.onload = function() {
                p()
            }
        }
        q.src = r;
        g.appendChild(q)
    }

    function f() {
        return {
            "x-psapp-key": j,
            "x-psapp-company": c
        }
    }
    b("assets/js/vendor/jquery-1.12.4.min.js", function() {
        a = jQuery.noConflict(true);
        m()
    });

    function m() {
        a(document).ready(function(p) {
            var w = new DOMParser();
            var v = w.parseFromString('<div id=a6b045c6-5a25-40fa-9ccb-03bacdf61999 class="psai-app-container right" style=color:#253d56><div class=psai-app-panel><div class=psai-app-dec-box style="padding:30px 30px 0 30px;background-image:url(assets/img/backgroundimage.png);background-repeat:no-repeat;background-color:#ebebeb;background-position:center center;background-size:cover;box-shadow:1px 1px 3px 0 #253d56;border-radius:10px"><form class=psai-app-form data-init-panel=f6cbeec2-5c36-474f-a87f-97d033a071fd data-netlify=true><div class=psai-app-step><div class=psai-app-heading style=font-size:22px;text-align:center;color:#f22738;padding:20px;margin-left:-30px;margin-right:-30px;margin-top:-30px;font-weight:bold>Instantly Find Out The Condition of <br>Any Roof</div><div style=text-align:center><img src=https://d33wubrfki0l68.cloudfront.net/ab794be413405c2d71588dfaaed3f5e7734958e7/156f3/assets/img/logo/logo.png width=225 height=65></div><div class=psai-app-form-group data-required=True data-type=name><label for=name-input style=display:none>Full Name</label> <input id=name-input class=psai-app-form-control type=text name=name placeholder="Full Name"></div><div class=psai-app-form-group data-required=True data-type=email><label for=email-input style=display:none>Email</label><input id=email-input class=psai-app-form-control type=email name=email placeholder=Email></div><div class=psai-app-form-group data-required=True data-type=phone><label for=phone-input style=display:none>Phone</label><input id=phone-input class=psai-app-form-control type=tel name=phone placeholder=Phone></div><div class="psai-app-form-group address-suggest-container" data-required=True data-type=address><label for=address-input style=display:none>Full Address</label> <input id=address-input class="psai-app-form-control address-input" type=text name=address placeholder=Address autocomplete=none> <input type=hidden id=house-number name=housenumber autocomplete=none> <input type=hidden id=form-name name=form-name value=roof-condition-report><input type=hidden id=street name=street autocomplete=none> <input type=hidden id=city name=city autocomplete=none> <input type=hidden id=state name=state autocomplete=none> <input type=hidden id=zipcode name=zipcode autocomplete=none> <input type=hidden id=country name=country autocomplete=none> <input type=hidden id=latitude name=latitude autocomplete=none> <input type=hidden id=longitude name=longitude autocomplete=none></div><input id=check name=spamCheck style=display:none;visibility:hidden> <button type=button class="psai-app-button psai-app-button-block" style=font-size:14px;background-color:#f22738;color:#ffffff;font-weight:bold data-action=partial data-next-panel=2499bd11-ab1d-4403-a1c3-dc87cfc2a391>READ YOUR REPORT INSTANTLY</button></div></form><div class=psai-app-dec-box-bottom style=height:30px></div></div></div><input type=hidden id=app-key value=a6b045c6-5a25-40fa-9ccb-03bacdf61999> <input type=hidden id=company-key value=296></div>', "text/html");
            var r = "a6b045c6-5a25-40fa-9ccb-03bacdf61999";
            var q = "ARAC - Roof It Forward";
            var x = p("script#" + r);
            var s = false;
            var u = false;
            var t = false;
            j = p(v.body.firstChild).find("#app-key").val();
            c = p(v.body.firstChild).find("#company-key").val();
            p(function() {
                h();
                p(document).ready(function() {
                    var A = {
                        address: "",
                        appointment: ""
                    };
                    var N = {
                        contactkey: "",
                        activitykey: "",
                        inquiry: "NewProject",
                        referrerUrl: "",
                        conversionUrl: "",
                        landingUrl: "",
                        panels: []
                    };
                    var G;
                    var H = false;
                    p.ajax({
                        type: "POST",
                        headers: f(),
                        async: false,
                        url: "https://apps.predictivesalesai.com/ws/external/ps-app/validate-status-disable/",
                        success: function(aa) {
                            H = aa
                        },
                        error: function() {
                            H = true
                        }
                    });
                    if (H) {
                        return
                    } else {
                        p(v.body.firstChild).insertBefore(x);
                        G = p("#" + r);
                        E()
                    }
                    if (typeof gtag !== "undefined") {
                        o({
                            category: "Storm Campaign",
                            action: "Weather Form View",
                            label: q,
                            value: -1
                        })
                    }
                    var I = p(G).find(".psai-app-form");
                    var M = null;
                    var S = 50;
                    var U = 50;
                    var T = p(window).scrollTop();
                    var O = p(document).height();
                    p(G).on("click", ".psai-app__launcher-container .psai-app-trigger, .psai-app__launcher-container .psai-app_content", function() {
                        V()
                    });
                    p(G).on("click", ".psai-app__launcher-container .psai-app-close", function() {
                        F()
                    });
                    p(G).on("click", ".psai-dismiss", function() {
                        F();
                        if (p(G).hasClass("psai-dt-screen-takeover")) {
                            P()
                        }
                    });
                    p(G).on("click", ".psai-app__launcher-container .psai-app_close-prompt", function() {
                        K(G);
                        return false
                    });
                    if (p(G).find(".address-suggest-container").length > 0) {
                        var z = p(G).find(".address-suggest-container")[0];
                        p(z).addressAutocomplete()
                    }
                    p(G).on("click", "button.psai-app-button", function() {
                        var ae = p(this);
                        p(ae).attr("disabled", true);
                        var ab = p(ae).text();
                        p(ae).text("Getting data...");
                        var af = Z();
                        var ac = p(I).find("input[name='spamCheck']").val() !== "";
                        if (af) {
                            var aa = p(ae).attr("data-action");
                            var ad = p(ae).attr("data-next-panel");
                            B();
                            if (aa === "submit" && !ac) {
                                Y(function() {
                                    J(ad)
                                })
                            } else {
                                if (aa === "partial" && !ac) {
                                    X(function() {
                                        J(ad)
                                    })
                                } else {
                                    J(ad)
                                }
                            }
                            if (N.panels.length > 0 && !ac) {
                                if (!s) {
                                    s = true;
                                    if (typeof fbq !== "undefined") {
                                        fbq("track", "Lead")
                                    }
                                }
                            }
                            if (typeof gtag !== "undefined" && !ac) {
                                if (N.panels.length > 0) {
                                    if (A.address !== "" && A.appointment === "" && !u) {
                                        u = true;
                                        o({
                                            category: "Storm Campaign",
                                            action: "Weather Lead",
                                            label: q,
                                            value: -1
                                        })
                                    } else {
                                        if (A.address !== "" && A.appointment !== "" && !t) {
                                            t = true;
                                            o({
                                                category: "Storm Campaign",
                                                action: "Weather Appointment",
                                                label: q,
                                                value: -1
                                            })
                                        }
                                    }
                                }
                            }
                        } else {
                            p(ae).removeAttr("disabled");
                            p(ae).text(ab)
                        }
                    });
                    if (p(G).hasClass("psai-dt-screen-takeover")) {
                        p(document).on("mouseleave.exitintent", function(ab) {
                            var aa = e("p_hei");
                            if (aa == null || aa === "false") {
                                if (!p(G).hasClass("show")) {
                                    if (!(ab.relatedTarget || ab.toElement) && ab.clientY < 20) {
                                        V();
                                        y()
                                    }
                                }
                            }
                        });
                        p(document).on("click", ".psai-app-container.show", function(aa) {
                            if ((aa.target == aa.currentTarget) || (aa.target == p(".psai-app-panel")[0])) {
                                F();
                                P()
                            }
                        });
                        if ((("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0))) {
                            if (O > 0) {
                                M = setInterval(C, 1000)
                            }
                        }
                    }

                    function y() {
                        p("html").addClass("psai-screentakeover-on");
                        p("body").append("<div class='psai-backdrop'></div>")
                    }

                    function P() {
                        l("p_hei", "true", 1, "/");
                        p("html").removeClass("psai-screentakeover-on");
                        p(".psai-backdrop").remove()
                    }

                    function C() {
                        var ab = jQuery(window).scrollTop() - T;
                        if (ab < 0) {
                            ab = 0;
                            T = jQuery(window).scrollTop()
                        }
                        var aa = parseFloat(ab) / parseFloat(O);
                        if (aa > parseFloat(S) / 100) {
                            clearInterval(M);
                            M = setInterval(D, 1000)
                        }
                    }

                    function D() {
                        var ab = T - jQuery(window).scrollTop();
                        if (ab < 0) {
                            ab = 0;
                            T = jQuery(window).scrollTop()
                        }
                        var ac = parseFloat(ab) / parseFloat(O);
                        if (ac > parseFloat(U) / 100) {
                            clearInterval(M);
                            M = null;
                            var aa = e("p_hei");
                            if (aa == null || aa === "false") {
                                if (!jQuery(G).hasClass("show")) {
                                    V();
                                    y()
                                }
                            }
                        }
                    }

                    function K(aa) {
                        p(aa).find(".psai-app_prompt").hide()
                    }

                    function Y(aa) {
                        p.ajax({
                            type: "POST",
                            headers: f(),
                            url: "https://apps.predictivesalesai.com/ws/external/ps-app/submit/",
                            contentType: "application/json",
                            data: JSON.stringify(N),
                            success: function(ab) {
                                N.contactkey = ab.contactkey;
                                N.activitykey = ab.activitykey;
                                aa()
                            },
                            error: function(ab) {
                                console.log("submit error")
                            }
                        })
                    }

                    function X(aa) {
                        p.ajax({
                            type: "POST",
                            headers: f(),
                            url: "https://apps.predictivesalesai.com/ws/external/ps-app/partial/",
                            contentType: "application/json",
                            data: JSON.stringify(N),
                            success: function(ab) {
                                N.contactkey = ab.contactkey;
                                N.activitykey = ab.activitykey;
                                N.panels = [];
                                aa()
                            },
                            error: function(ab) {
                                console.log("partial error")
                            }
                        })
                    }

                    function J(aa) {
                        p.ajax({
                            type: "POST",
                            headers: f(),
                            url: "https://apps.predictivesalesai.com/ws/external/ps-app/form/",
                            data: {
                                panelid: aa
                            },
                            success: function(ab) {
                                p(I).html(ab);
                                L()
                            },
                            error: function(ab) {
                                if (ab.responseJSON) {
                                    console.log(ab.responseJSON.data)
                                } else {
                                    console.log("Got a crazy error getting view")
                                }
                            }
                        })
                    }

                    function L() {
                        var ad = p(G).find("#redirect");
                        if (!ad.length) {
                            var ae = p(G).find(".psai-app-forecast");
                            var aa = p(G).find(".address-suggest-container");
                            if (p(aa).length > 0) {
                                p(aa).addressAutocomplete()
                            }
                            if (p(ae).length > 0) {
                                p.ajax({
                                    type: "POST",
                                    url: "https://apps.predictivesalesai.com/ws/external/spectrum-api/weather/",
                                    headers: f(),
                                    data: {
                                        address: A.address,
                                        activityKey: N.activitykey,
                                        contactKey: N.contactkey
                                    },
                                    success: function(af) {
                                        p(ae).removeClass("psai-loading");
                                        p(ae).html(af)
                                    },
                                    error: function(af) {
                                        p(ae).removeClass("psai-loading");
                                        if (af.responseJSON) {
                                            p(ae).html(af.responseJSON.resp)
                                        } else {
                                            p(ae).html("<p>Something weird is going on with the weather data</p>")
                                        }
                                    }
                                })
                            }
                        } else {
                            var ac = p(ad).attr("href");
                            window.open(ac, "_blank");
                            var ab = p(G).find(".psai-app-close");
                            if (ab.length) {
                                p(ab).trigger("click")
                            } else {
                                R()
                            }
                        }
                    }

                    function Z() {
                        Q();
                        var aa = p(I).find(".psai-app-form-group[data-type]");
                        if (p(aa).length) {
                            p.each(aa, function(an, aD) {
                                var al = p(aD);
                                var aC = p(al).attr("data-type");
                                var ay = p(al).attr("data-required").toLowerCase();
                                switch (aC) {
                                    case "address":
                                        var ab = p(al).find("input[name='address']");
                                        if (p(ab).val() === "" && ay === "true") {
                                            W(p(ab).attr("id"), "Slow down turbo! you have to enter an address")
                                        } else {
                                            if (ay === "true") {
                                                var aE = true;
                                                var am = p(al).find("input[name='housenumber']");
                                                if (p(am).val() === "") {
                                                    aE = false
                                                }
                                                var aA = p(al).find("input[name='street']");
                                                if (p(aA).val() === "") {
                                                    aE = false
                                                }
                                                var ad = p(al).find("input[name='city']");
                                                if (p(ad).val() === "") {
                                                    aE = false
                                                }
                                                var az = p(al).find("input[name='state']");
                                                if (p(az).val() === "") {
                                                    aE = false
                                                }
                                                var aG = p(al).find("input[name='zipcode']");
                                                if (p(aG).val() === "") {
                                                    aE = false
                                                }
                                                var ag = p(al).find("input[name='country']");
                                                if (p(ag).val() === "") {
                                                    aE = false
                                                }
                                                var ap = p(al).find("input[name='latitude']");
                                                if (p(ap).val() === "") {
                                                    aE = false
                                                }
                                                var aq = p(al).find("input[name='longitude']");
                                                if (p(aq).val() === "") {
                                                    aE = false
                                                }
                                                if (!aE) {
                                                    p.ajax({
                                                        type: "GET",
                                                        url: "https://apps.predictivesalesai.com/ws/external/here-api/lookup-address/",
                                                        data: "address=" + p(ab).val(),
                                                        async: false,
                                                        success: function(aH) {
                                                            p(am).val(aH.HouseNumber);
                                                            p(aA).val(aH.Street);
                                                            p(ad).val(aH.City);
                                                            p(az).val(aH.State);
                                                            p(aG).val(aH.Postal);
                                                            p(ag).val(aH.Country);
                                                            p(ap).val(aH.Latitude);
                                                            p(aq).val(aH.Longitude);
                                                            aE = true
                                                        },
                                                        error: function(aH) {
                                                            aE = false
                                                        }
                                                    });
                                                    if (!aE) {
                                                        W(p(ab).attr("id"), "My super smart software says that address is not valid!?!?")
                                                    }
                                                }
                                            }
                                        }
                                        break;
                                    case "appointment":
                                        var ac = p(al).find("select");
                                        if (p(ac).val() === "" && ay === "true") {
                                            W(p(ac).attr("id"), "You must select a date")
                                        }
                                        break;
                                    case "checkbox":
                                        var av = p(al).find("input[type='checkbox']:checked");
                                        if (!av.length && ay === "true") {
                                            var ao = p(al).find("input[type='checkbox']").last();
                                            W(p(ao).attr("id"), "You must select at least 1 option")
                                        }
                                        break;
                                    case "comments":
                                        var af = p(al).find("textarea");
                                        if (p(af).val() === "" && ay === "true") {
                                            W(p(af).attr("id"), "You must enter a value")
                                        }
                                        break;
                                    case "dropdown":
                                        var ah = p(al).find("select");
                                        if (p(ah).val() === "" && ay === "true") {
                                            W(p(ah).attr("id"), "You must select a value")
                                        }
                                        break;
                                    case "email":
                                        var aj = p(al).find("input[name='email']");
                                        var ai = p(aj).val();
                                        var ar = ai.match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
                                        if (ai === "" && ay === "true") {
                                            W(p(aj).attr("id"), "You're being silly, you gotta enter a valid email.")
                                        } else {
                                            if (ar === null && ay === "true") {
                                                W(p(aj).attr("id"), "We don't spam silly, so enter a good email already")
                                            } else {
                                                if (ar !== null) {
                                                    p.ajax({
                                                        type: "POST",
                                                        async: false,
                                                        url: "https://apps.predictivesalesai.com/ws/external/spectrum-api/email-validation/",
                                                        headers: f(),
                                                        data: {
                                                            email: ai
                                                        },
                                                        success: function(aH) {
                                                            if (!aH) {
                                                                W(p(aj).attr("id"), "You're killing me here with the invalid emails...try again...")
                                                            }
                                                        },
                                                        error: function(aH) {
                                                            console.log(aH)
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                        break;
                                    case "name":
                                        var au = p(al).find("input[name='name']");
                                        var at = p(au).val();
                                        if (at === "" && ay === "true") {
                                            W(p(au).attr("id"), "You gotta enter your full name for me ok?")
                                        } else {
                                            if (at === "") {
                                                break
                                            }
                                            var ak = at.split(" ");
                                            if (ak.length !== 2) {
                                                W(p(au).attr("id"), "We both know that name is not right")
                                            } else {
                                                var aF = true;
                                                p.each(ak, function(aH, aJ) {
                                                    var aI = aJ.match(/^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$/);
                                                    if (aI === null) {
                                                        aF = false
                                                    }
                                                });
                                                var ar = at.match(/^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$/);
                                                if (!aF) {
                                                    W(p(au).attr("id"), "You messed up your own name ...let's try it again...")
                                                }
                                            }
                                        }
                                        break;
                                    case "phone":
                                        var ax = p(al).find("input[name='phone']");
                                        var aw = p(ax).val();
                                        var ae = ("" + aw).replace(/\D/g, "");
                                        var ar = ae.match(/^(\d{3})(\d{3})(\d{4})$/);
                                        if (aw === "" && ay === "true") {
                                            W(p(ax).attr("id"), "You gotta give those digits...")
                                        } else {
                                            if (aw === "") {
                                                break
                                            }
                                            if (ar === null) {
                                                W(p(ax).attr("id"), "You trying to give me your wrong number? Try it again...")
                                            } else {
                                                p.ajax({
                                                    type: "POST",
                                                    async: false,
                                                    url: "https://apps.predictivesalesai.com/ws/external/spectrum-api/phone-validation/",
                                                    headers: f(),
                                                    data: {
                                                        phone: aw
                                                    },
                                                    success: function(aH) {
                                                        if (!aH) {
                                                            W(p(ax).attr("id"), "Phone number isn't checking out...enter your real one ok?")
                                                        }
                                                    },
                                                    error: function(aH) {
                                                        console.log(aH)
                                                    }
                                                })
                                            }
                                        }
                                        break;
                                    default:
                                        var aB = p(al).find("input[name='text']");
                                        if (p(aB).val() === "" && ay === "true") {
                                            W(p(aB).attr("id"), "You gotta enter something...")
                                        }
                                        break
                                }
                            })
                        }
                        return p(I).find(".invalid-feedback").length === 0
                    }

                    function B() {
                        var aa = p(I).find(".psai-app-form-group[data-type]");
                        if (p(aa).length) {
                            var ab = {
                                fields: []
                            };
                            p.each(aa, function(ao, az) {
                                var am = p(az);
                                var ay = p(am).attr("data-type");
                                switch (ay) {
                                    case "address":
                                        var ac = p(am).find("input[name='address']");
                                        var an = p(am).find("input[name='housenumber']");
                                        var aw = p(am).find("input[name='street']");
                                        var af = p(am).find("input[name='city']");
                                        var av = p(am).find("input[name='state']");
                                        var aB = p(am).find("input[name='zipcode']");
                                        var ah = p(am).find("input[name='country']");
                                        var ap = p(am).find("input[name='latitude']");
                                        var aq = p(am).find("input[name='longitude']");
                                        var ai = {
                                            housenumber: p(an).val(),
                                            street: p(aw).val(),
                                            city: p(af).val(),
                                            state: p(av).val(),
                                            zipcode: p(aB).val(),
                                            country: p(ah).val(),
                                            latitude: p(ap).val(),
                                            longitude: p(aq).val()
                                        };
                                        var al = {
                                            name: p(ac).attr("id"),
                                            type: ay,
                                            value: p(ac).val(),
                                            details: ai
                                        };
                                        ab.fields.push(al);
                                        A.address = n(al);
                                        break;
                                    case "appointment":
                                        var ad = p(am).find("select");
                                        var aA = p(ad).val();
                                        var ae = p(am).parent().find("#available-appointment-times");
                                        if (p(ae).length) {
                                            aA += " " + p(ae).val()
                                        }
                                        var al = {
                                            name: p(ad).attr("id"),
                                            type: ay,
                                            value: aA,
                                            details: null
                                        };
                                        ab.fields.push(al);
                                        A.appointment = al.value;
                                        break;
                                    case "checkbox":
                                        var at = p(am).find("input[type='checkbox']:checked");
                                        var ar = p(am).attr("data-name");
                                        var aA = "";
                                        p.each(at, function(aC, aD) {
                                            aA += p(aD).val() + ","
                                        });
                                        aA = aA.slice(0, -1);
                                        var al = {
                                            name: ar,
                                            type: ay,
                                            value: aA,
                                            details: null
                                        };
                                        ab.fields.push(al);
                                        break;
                                    case "comments":
                                        var ag = p(am).find("textarea");
                                        var al = {
                                            name: p(ag).attr("id"),
                                            type: ay,
                                            value: p(ag).val(),
                                            details: null
                                        };
                                        ab.fields.push(al);
                                        break;
                                    case "dropdown":
                                        var aj = p(am).find("select");
                                        var al = {
                                            name: p(aj).attr("id"),
                                            type: ay,
                                            value: p(aj).val(),
                                            details: null
                                        };
                                        ab.fields.push(al);
                                        break;
                                    case "email":
                                        var ak = p(am).find("input[name='email']");
                                        var al = {
                                            name: p(ak).attr("id"),
                                            type: ay,
                                            value: p(ak).val(),
                                            details: null
                                        };
                                        ab.fields.push(al);
                                        break;
                                    case "name":
                                        var ar = p(am).find("input[name='name']");
                                        var al = {
                                            name: p(ar).attr("id"),
                                            type: ay,
                                            value: p(ar).val(),
                                            details: null
                                        };
                                        ab.fields.push(al);
                                        break;
                                    case "phone":
                                        var au = p(am).find("input[name='phone']");
                                        var al = {
                                            name: p(au).attr("id"),
                                            type: ay,
                                            value: p(au).val(),
                                            details: null
                                        };
                                        ab.fields.push(al);
                                        break;
                                    default:
                                        var ax = p(am).find("input[name='text']");
                                        var al = {
                                            name: p(ax).attr("id"),
                                            type: ay,
                                            value: p(ax).val(),
                                            details: null
                                        };
                                        ab.fields.push(al);
                                        break
                                }
                            });
                            N.panels.push(ab)
                        }
                        if (N.landingUrl == "") {
                            N.landingUrl = E()
                        }
                        if (N.conversionUrl == "") {
                            N.conversionUrl = encodeURIComponent(document.location.href)
                        }
                        if (N.referrerUrl == "") {
                            N.referrerUrl = encodeURIComponent(document.referrer)
                        }
                    }

                    function W(ab, ac) {
                        var aa = p(I).find("#" + ab + "");
                        var ad = aa.parent();
                        p(ad).addClass("has-error");
                        p(ad).append('<div class="invalid-feedback" aria-hidden="true">' + (ac ? ac : "") + "</div>")
                    }

                    function Q() {
                        var aa = p(I).find(".invalid-feedback");
                        p.each(aa, function(ab, ac) {
                            p(ac).parent().removeClass("has-error")
                        });
                        p(aa).remove()
                    }

                    function V() {
                        K(G);
                        p("html").addClass("psai-app-modal-open");
                        p(G).addClass("show")
                    }

                    function F() {
                        p("html").removeClass("psai-app-modal-open");
                        p(G).removeClass("show");
                        R()
                    }

                    function R() {
                        var aa = p(I).attr("data-init-panel");
                        J(aa);
                        A.address = "";
                        N = {
                            contactkey: "",
                            activitykey: "",
                            inquiry: "NewProject",
                            referrerUrl: "",
                            conversionUrl: "",
                            landingUrl: "",
                            panels: []
                        }
                    }

                    function E() {
                        var aa = e("psai-landing");
                        if (aa == null || aa == "") {
                            l("psai-landing", encodeURIComponent(document.location.href), 7, "/");
                            aa = encodeURIComponent(document.location.href)
                        }
                        return aa
                    }
                })
            })
        })
    }

    function h() {
        a(document).ready(function(p) {
            var s, r, q;
            (function(t) {
                t.fn.addressAutocomplete = function() {
                    var x = t(this);
                    q = x.closest(".psai-app-form");
                    var y = document.createElement("div");
                    y.className += "here-address-container";
                    if (x.hasClass("address-input")) {
                        x.after(y)
                    } else {
                        x.append(y)
                    }
                    var z = document.createElement("div");
                    z.className += "inner";
                    y.appendChild(z);
                    z.style.display = "none";
                    x.find(".address-input").on("input", function() {
                        v();
                        y.style.display = "block";
                        var A = x.hasClass("address-input") ? x[0] : x.find(".address-input")[0];
                        if (A.value.length == 0) {
                            return
                        }
                        if (r) {
                            clearTimeout(r)
                        }
                        if (s) {
                            s.abort()
                        }
                        r = setTimeout(function() {
                            s = t.ajax({
                                type: "POST",
                                url: "https://apps.predictivesalesai.com/ws/external/here-api/address/",
                                data: "address=" + A.value,
                                success: function(C) {
                                    t(".here-address").remove();
                                    if (C.length > 0) {
                                        var B = 0;
                                        z.style.display = "block";
                                        for (var E = 0; E < C.length; E++) {
                                            var D = C[E];
                                            if (D.Street && D.State) {
                                                B++;
                                                var F = document.createElement("a");
                                                F.className = "here-address";
                                                F.innerHTML = u(D.FullAddress);
                                                F.setAttribute("data-house-number", u(D.HouseNumber));
                                                F.setAttribute("data-street", u(D.Street));
                                                F.setAttribute("data-state", u(D.State));
                                                F.setAttribute("data-city", u(D.City));
                                                F.setAttribute("data-zip", u(D.Postal));
                                                F.setAttribute("data-country", u(D.Country));
                                                F.setAttribute("data-latitude", u(D.Latitude));
                                                F.setAttribute("data-longitude", u(D.Longitude));
                                                z.appendChild(F)
                                            }
                                        }
                                    }
                                },
                                error: function(B) {}
                            })
                        }, 1)
                    });
                    x.find(".address-input").keydown(function(A) {
                        var E = x.find(".address-input").siblings(".here-address-container");
                        var F = E.find(".here-address");
                        if (A.which == 38 && F.length > 0) {
                            var C = E.find(".here-address.selected:first");
                            if (C.length > 0) {
                                var B = C.prev(".here-address");
                                if (B.length > 0) {
                                    C.removeClass("selected");
                                    B.addClass("selected")
                                }
                            }
                        }
                        if (A.which == 40 && F.length > 0) {
                            var C = E.find(".here-address.selected:first");
                            if (C.length > 0) {
                                var B = C.next(".here-address");
                                if (B.length > 0) {
                                    C.removeClass("selected");
                                    B.addClass("selected")
                                }
                            } else {
                                F.first().addClass("selected")
                            }
                        }
                        if (A.which == 13) {
                            var D = E.find(".here-address.selected:first");
                            if (D.length > 0) {
                                D[0].click()
                            }
                        }
                    });
                    document.onclick = function(A) {
                        y.style.display = "none"
                    };
                    t(q).on("click", "a.here-address", function() {
                        var A = t(q).find("input#address-input");
                        t(A).val(u(this.getAttribute("data-house-number")) + " " + u(this.getAttribute("data-street")) + ", " + u(this.getAttribute("data-city")) + ", " + u(this.getAttribute("data-state")) + " " + u(this.getAttribute("data-zip")));
                        w(this);
                        t(".here-address").remove();
                        return false
                    });
                    return this
                };

                function w(x) {
                    t(q).find("input[name='housenumber']").val(u(x.getAttribute("data-house-number")));
                    t(q).find("input[name='street']").val(u(x.getAttribute("data-street")));
                    t(q).find("input[name='city']").val(u(x.getAttribute("data-city")));
                    t(q).find("input[name='country']").val(u(x.getAttribute("data-country")));
                    t(q).find("input[name='latitude']").val(u(x.getAttribute("data-latitude")));
                    t(q).find("input[name='longitude']").val(u(x.getAttribute("data-longitude")));
                    t(q).find("input[name='zipcode']").val(u(x.getAttribute("data-zip")));
                    t(q).find("input[name='state']").val(u(x.getAttribute("data-state")));
                    t(q).find("input[name='country']").val(u(x.getAttribute("data-country")))
                }

                function v() {
                    t(q).find("input[name='housenumber']").val("");
                    t(q).find("input[name='street']").val("");
                    t(q).find("input[name='city']").val("");
                    t(q).find("input[name='country']").val("");
                    t(q).find("input[name='latitude']").val("");
                    t(q).find("input[name='longitude']").val("");
                    t(q).find("input[name='zipcode']").val("");
                    t(q).find("input[name='state']").val("");
                    t(q).find("input[name='country']").val("")
                }

                function u(x) {
                    return (x && x != "undefined") ? x : ""
                }
            }(a))
        })
    }

    function n(q) {
        var p = "";
        if (q.details !== null) {
            p = q.details.housenumber + " " + q.details.street + ", " + q.details.city + ", " + q.details.state + ", " + q.details.zipcode
        }
        return p
    }

    function l(r, u, p, s) {
        var t = new Date();
        t.setTime(t.getTime());
        if (p) {
            p = p * 1000 * 60 * 60 * 24
        }
        var q = new Date(t.getTime() + (p));
        document.cookie = r + "=" + escape(u) + ((p) ? ";expires=" + q.toUTCString() : "") + ";path=" + s + ";samesite=strict"
    }

    function e(r) {
        var s = document.cookie.indexOf(r + "=");
        var q = s + r.length + 1;
        if ((!s) && (r != document.cookie.substring(0, r.length))) {
            return null
        }
        if (s == -1) {
            return null
        }
        var p = document.cookie.indexOf(";", q);
        if (p == -1) {
            p = document.cookie.length
        }
        return unescape(document.cookie.substring(q, p))
    }

    function d(p) {
        document.cookie = p + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    }

    function o(q) {
        var p = {
            event_category: q.category
        };
        if (q.label != "") {
            p.event_label = q.label
        }
        if (!isNaN(q.value) && q.value > 0) {
            p.value = q.value
        }
        gtag("event", q.action, p)
    }
})();
