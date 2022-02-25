$(function () {

    function initDatePickers() {
        $('.datepicker').datepicker({
            autoclose: true
        });
        $(document).on("click", ".select-date", function (e) {
            e.preventDefault();
            var fieldId = $(this).attr("data-action-field");
            var picker = $("#" + fieldId).data("datepicker");
            if (picker) {
                picker.show();
            }
        });
    }

    function initCollapsible() {
        $("a[data-toggle='collapse']").click(function (e) {
            e.preventDefault();
            var container = $(this).attr("data-collapse-container");
            if ($(this).data("hideaftershow") == true) $(this).fadeOut();
            $("#" + container).find("div.collapse").each(function () {
                var t = $(this);
                if (t.hasClass("in")) t.collapse('toggle');
            });
        });
    }

    function initNews() {
        var div = $(".company-blog");
        if (!div.hasClass("internal")) {
            var article = div.children(".blog-post");
            if (article.length > 0) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    data: serializeSecToken(true),
                    url: "/ws/latest-news/",
                    success: function (news) {
                        if (news.title) {
                            article.find(".post-date").html(news.pubDate);
                            article.find(".post-header a").attr("href", news.link).html(news.title);
                            article.find(".post-entry").html(news.description);
                            article.find(".post-continue").attr("href", news.link);
                        }
                    }
                });
            }
        }
    }

    function initQuoteForm() {
        var form = $("#quote-form");
        if (form.length > 0) {
            $('.datepicker-appt-date').datepicker({
                autoclose: true,
                startDate: new Date()
            });
            var gkey = getGoogleMapsAPIKey();
            form.find("#btn-quote-submit").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                var buttonhtml = button.html();
                button.html("Submitting...");
                button.attr("disabled", "disabled");

                function submitForm() {
                    var inputaddress = $("#price-quote-address").val().trim();
                    if ($("#g-zip").val("")) {
                        var zipMatch = /[0-9]{5}(-[0-9]{4})?(?!.*[0-9]{5}(-[0-9]{4})?)/g.exec(inputaddress);
                        if (zipMatch !== null && zipMatch.index !== 0) {
                            $("#g-zip").val(zipMatch[0]);
                        }
                    }

                    // dealer contact form
                    var dealerid = getFormVal("input-dealerid");
                    var dealerlocationid = getFormVal("input-dealerlocationid");

                    var postData = form.serialize();
                    $.ajax({
                        type: "POST",
                        cache: false,
                        dataType: "json",
                        url: "/ws/quote/",
                        data: postData +
                            "&convertedpage=" + encodeURIComponent(document.location.href) +
                            "&dealerid=" + dealerid +
                            "&dealerlocationid=" + dealerlocationid
                            + serializeSecToken(),
                        success: function (data) {
                            removeFeedback();
                            if (!data.IsValid) {
                                button.removeAttr("disabled");
                                button.html(buttonhtml);
                                if (data.ErrFields.apptdate) showValidationError("appt-date");
                                if (data.ErrFields.appttime) showValidationError("select-appt-time");
                                if (data.ErrFields.name) showValidationError("quote-name");
                                if (data.ErrFields.email) showValidationError("quote-email");
                                if (data.ErrFields.phone) showValidationError("quote-phone");
                                if (data.ErrFields.details) showValidationError("quote-details");
                                if (data.ErrFields.service) showValidationError("quote-project");
                                if (data.ErrFields.zip) showValidationError("quote-zip");
                                alert(getCombinedAlert(data));
                            } else {
                                if (data.Data && data.Data.redirect) {
                                    window.location = data.Data.redirect;
                                } else {
                                    saveCookie("address", data.Data.address, 1, "/");
									if (data.Data != null) {
                                    	if (data.Data.activityRowKey) $("#activityRowKey").val(data.Data.activityRowKey);
                                    	if (data.Data.contactRowKey) $("#contactRowKey").val(data.Data.contactRowKey);
                                    	if (data.Data.dealerid) {
                                        	var input = form.find("input[name=dealerid]");
                                        	if (input.length > 0) {
                                            	input.val(data.Data.dealerid);
                                        	} else {
                                            	form.append("<input type='hidden' name='dealerid' value='" + data.Data.dealerid + "'/>");
                                        	}
                                        	if (data.Data.dealerlocationid) {
                                            	var input = form.find("input[name=dealerlocationid]");
                                            	if (input.length > 0) {
                                                	input.val(data.Data.dealerid);
                                            	} else {
                                                	form.append("<input type='hidden' name='dealerlocationid' value='" + data.Data.dealerlocationid + "'/>");
                                            	}
                                        	}
                                    	}
                                	}
                                    form.submit();
                                }
                            }
                        }
                    });
                }
                var inputaddress = $("#price-quote-address").val().trim();
                if (inputaddress !== "") {
                    $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(inputaddress) + "&key=" + gkey, function (data) {
                        var matchedaddress = (data.results.length > 0 ? data.results[0] : null);
                        var address = new parseGoogleAddress(matchedaddress);
                        if (address.formatted_address !== "") {
                            $("#g-address1").val(address.address1);
                            $("#g-address2").val(address.address2);
                            $("#g-city").val(address.city);
                            $("#g-state").val(address.state);
                            $("#g-zip").val(address.zip);
                            $("#g-country").val(address.country);
                        }
                    }).done(function () {
                        submitForm();
                    }).error(function () {
                        submitForm();
                    });
                } else {
                    submitForm();
                }
            });

            $(".no-quote-form-on-page").removeClass("no-quote-form-on-page");
            $.getScript("https://maps.googleapis.com/maps/api/js?key=" + gkey + "&libraries=places", function (script) {
                var addressinput = form.find("#price-quote-address");
                var autocomplete = new window.google.maps.places.Autocomplete(addressinput.get(0), { types: ['geocode'] });
                autocomplete.setComponentRestrictions({ country: "us" });
                autocomplete.addListener('place_changed', function () {
                    var place = autocomplete.getPlace();
                    addressinput.val(place.formatted_address);
                });
            });
        }
    }

    function initContactForm() {
        var form = $("#contact-form");
        if (form.length > 0) {
            form.find("#button-submit-form").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                var buttonhtml = button.html();
                button.html("Submitting...");
                button.attr("disabled", "disabled");

                var formtype = $("#formtype").val();
                formtype = formtype == undefined ? "" : formtype;

                // dealer contact form
                var dealerid = getFormVal("input-dealerid");
                var dealerlocationid = getFormVal("input-dealerlocationid");

                var postData = "contact=1" +
                    "&details=" + getFormVal("textarea-info-details") +
                    "&location=" + getFormVal("input-location") +
                    "&dealerid=" + dealerid +
                    "&dealerlocationid=" + dealerlocationid +
                    "&name=" + getFormVal("input-user-name") +
                    "&phone=" + getFormVal("input-user-phone") +
                    "&email=" + getFormVal("input-user-email") +
                    "&spamCheck=" + getFormVal("check") +
					"&formtype=" + formtype;
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/contact/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html(buttonhtml);
                            if (data.ErrFields.details) showValidationError("textarea-info-details");
                            if (data.ErrFields.name) showValidationError("input-user-name");
                            if (data.ErrFields.phone) showValidationError("input-user-phone");
                            if (data.ErrFields.email) showValidationError("input-user-email");
                            alert(getCombinedAlert(data));
                        } else {
                            if ($('.modal-send-message').length > 0) {
                                button.removeAttr("disabled");
                                button.html(buttonhtml);
                            }
                            form.submit();
                        }
                    }
                });
            });
            $('.modal-send-message').on('show.bs.modal', function(evt) {
                var button = $(evt.relatedTarget);
                var location = button.attr("data-location");
                var dealerid = button.attr("data-dealerid");
                var dealerlocationid = button.attr("data-dealerlocationid");
                var modal = $(this);
                modal.find('.modal-title').text('Send a Message to ' + location);
                modal.find('.dealername').text(button.attr("data-dealername"));
                $('#input-location').val(location);
                $('#input-dealerid').val(dealerid);
                $('#input-dealerlocationid').val(dealerlocationid);
            });
        }
    }

    function initNav() {
        var path = trim(window.location.pathname, "/");
        var tiers = path.split("/");
        $(".navbar-nav .aMain").each(function () {
            var t = $(this);
            if (t.attr("href") == '/' + tiers[0] + '/') {
                t.addClass("active");
            }
        });
    }
    function initSideNav() {
        $(".page-nav-btn-group a").each(function () {
            if ($(this).attr("href") == window.location.pathname) {
                $(this).addClass("active");
            }
        });
    }

    function initBlogRecent() {
        $.each($(".list-group-item-img > img"), function (i, v) {
            var post = $(v);
            if (post.attr("src").includes("vimeo")) {
                var srcSplit = post.attr("src").split('/');
                var video_id = srcSplit[srcSplit.length - 1];

                $.ajax({
                    type: 'GET',
                    url: 'https://vimeo.com/api/v2/video/' + video_id + '.json',
                    dataType: 'jsonp',
                    success: function (data) {
                        var thumbnail_src = data[0].thumbnail_small;
                        post.attr("src", thumbnail_src);
                    }
                });
            } else if (post.attr("src").includes("youtube")) {
                var srcSplit = post.attr("src").split('/');
                var video_id = srcSplit[srcSplit.length - 1];

                post.attr("src", "https://img.youtube.com/vi/" + video_id + "/0.jpg");
            }
        });
    }

    function initBlogSubscribe() {
        var form = $("#email-subscribe");
        if (form.length > 0) {
            $("#email-subscribe-btn").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                button.data("text", button.html());
                button.html("Submitting...");
                button.attr("disabled", "disabled");
                var postData = "blogsubscribe=1" +
                    "&spamCheck=" + getFormVal("check") +
                    "&email=" + getFormVal("input-email-subscribe");
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/blogsubscribe/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html(button.data("text"));
                            if (data.ErrFields.email) showValidationError("input-email-subscribe");
                            var msg = "";
                            for (var i in data.ErrFields) {
                                msg += ((msg == "") ? "" : "\n") + data.ErrFields[i];
                            }
                            alert(msg)
                        } else {
                            window.location = "/thank-you/?" + postData;
                        }
                    }
                });
            });
        }
    }

    function initBlogComment() {
        var form = $("#post-comment");
        if (form.length > 0) {
            $("#btn-post-comment").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                button.html("Submitting...");
                button.attr("disabled", "disabled");
                var postData = "name=" + getFormVal("input-commenter-name") +
                    "&email=" + getFormVal("input-commenter-email") +
                    "&comment=" + getSafeHtml("textarea-commenter-comment") +
                    "&postid=" + getFormVal("input-post-id") +
                    "&url=" + getFormVal("input-post-url");
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/blogcomment/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        button.removeAttr("disabled");
                        button.html("Post Comment");
                        if (!data.IsValid) {
                            if (data.ErrFields.name) showValidationError("input-commenter-name");
                            if (data.ErrFields.email) showValidationError("input-commenter-email");
                            if (data.ErrFields.comment) showValidationError("textarea-commenter-comment");
                            var msg = "";
                            for (var i in data.ErrFields) {
                                msg += ((msg == "") ? "" : "\n") + data.ErrFields[i];
                            }
                            alert(msg)
                        } else {
                            alert("Thanks for your comment.\nYour comment has been posted for moderation.");
                            window.location.reload(true);
                        }
                    }
                });
            });
        }
    }

    function initScrollTo() {
        $('.scroll-to').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    }

    function initScrollToCollapse() {
        $('.scroll-to-collapse').on('shown.bs.collapse', function () {
            $('html, body').animate({ scrollTop: $(this).offset().top - $(".header")[0].offsetHeight }, 1000);
        });
    }

    function initCareersForm() {
        var form = $("#apply-form");
        if (form.length > 0) {

            var button = form.find("#apply-submit");
            var buttonhtml = button.html();

            form.find("#apply-submit").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                button.html("Submitting...");
                button.attr("disabled", "disabled");
                form.submit();
            });

            $('#apply-form').ajaxForm({
                url: '/ws/employment/',
                beforeSubmit: function (a, f, o) {
                    o.dataType = 'json';
                },
                data: { __RequestVerificationToken: decodeURIComponent(getSecToken()) },
                error: function () {
                    alert("Error submitting the form. Please try again later.");
                },
                success: function (data) {
                    removeFeedback();
                    if (!data.IsValid) {
                        button.removeAttr("disabled");
                        button.html(buttonhtml);
                        if (data.ErrFields.resume) showValidationError("file-upload");
                        if (data.ErrFields.coverletter) showValidationError("apply-cover-letter");
                        if (data.ErrFields.position) showValidationError("apply-position");
                        if (data.ErrFields.email) showValidationError("apply-email");
                        if (data.ErrFields.name) showValidationError("apply-name");
                        var msg = "";
                        for (var i in data.ErrFields) {
                            msg += ((msg == "") ? "" : "\n") + data.ErrFields[i];
                        }
                        alert(msg)
                    } else {
                        var action = form.attr("action");
                        if (action) {
                            var postData = form.serialize();
                            if (action.indexOf("?") > -1) {
                                postData = "&" + postData;
                            }
                            window.location.href = action + postData;
                        }
                    }
                }
            });
        }
    }

    function initRatings() {
        $(".rating-selector").each(function (idx) {
            var ratingID = $(this).attr("id");
            ratingID = (ratingID) ? ratingID + "-value" : "rating-hidden-" + (idx + 1);
            if ($("#" + ratingID).length <= 0)
                $(this).append("<input id=\"" + ratingID + "\" name=\"" + ratingID + "\" type=\"hidden\" value=\"5\"/>");

            $(this).find("a").each(
                function () {
                    $(this).on("click", function () {
                        $(this).siblings("a").removeClass("yes-value");
                        $(this).nextAll("a").addClass("yes-value");
                        $(this).addClass("yes-value");
                        var rating = (5 - $(this).index());
                        $("#" + ratingID).val(rating);
                    });
                });
            $(this).on("mouseenter", function () {
                $(this).find("a").removeClass("yes-value");
            });
            $(this).on("mouseleave", function () {
                var rating = $("#" + ratingID).val();
                $(this).find("a").each(function (idx, a) {
                    if (idx >= (5 - rating) && rating != 0)
                        $(a).addClass("yes-value");
                });
            });
        });
    }

    function initReviews() {
        var form = $("#form-review-post");
        if (form.length > 0) {
            form.find("#button-post-review").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                buttonhtml = $(this).html();
                button.html(submitText);
                button.attr("disabled", "disabled");
                var postData = form.serialize() +
                    "&rating=" + getFormVal("review-rating-value") +
                    "&referrer=" + document.referrer;
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/postreview/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html(buttonhtml);
                            if (data.ErrFields.comment) showValidationError("input-reviewer-comment");
                            if (data.ErrFields.name) showValidationError("input-reviewer-name");
                            if (data.ErrFields.market) showValidationError("select-review-location");
                            if (data.ErrFields.email) showValidationError("input-reviewer-email");
                            if (data.ErrFields.title) showValidationError("input-reviewer-title");
                            if (data.ErrFields.zip) showValidationError("input-reviewer-zip");
                            alert(getCombinedAlert(data));
                        } else {
                            form.submit();
                        }
                    }
                });
            });
            var hash = window.location.hash;
            hash = (hash) ? hash : "";
            hash = hash.slice(1).replace("#", "");
            if (hash == "write-a-review") {
                $(".btn-write-review").trigger('click');
            }
        }

        if ($("#dealer-reviews-container").length > 0 && $("#form-dealer-review-post").length <= 0) {
            $(document).on("click", ".btn-more-reviews", function (evt) {
                evt.preventDefault();
                var button = $(this);
                var rid = button.attr("data-rid");

                var buttonhtml = button.html();
                button.html(submitText);
                button.attr("disabled", "disabled");

                var postData = "reviewnextid=" + rid +"&companyname=true";
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/getmorereviews/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        button.removeAttr("disabled");
                        button.html(buttonhtml);
                        if (!data.IsValid) {
                            alert(getCombinedAlert(data));
                        } else {
                            $(".reviews-container").append(data.reviews);
                            if (data.nextkey && data.nextkey != null && data.nextkey != "") {
                                $(".btn-more-reviews").attr("data-rid", data.nextkey);
                            } else {
                                $(".btn-more-reviews").remove();
                            }
                        }
                    }
                });
            });
        }
    }

    function initDealerReviews() {
        var form = $("#form-dealer-review-post");
        if (form.length > 0) {
            form.find("#button-post-review").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                buttonhtml = $(this).html();
                button.html(submitText);
                button.attr("disabled", "disabled");
                var postData = form.serialize() +
                    "&rating=" + getFormVal("review-rating-value") +
                    "&referrer=" + document.referrer;
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/postdealerreview/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html(buttonhtml);
                            if (data.ErrFields.comment) showValidationError("input-reviewer-comment");
                            if (data.ErrFields.name) showValidationError("input-reviewer-name");
                            if (data.ErrFields.email) showValidationError("input-reviewer-email");
                            if (data.ErrFields.title) showValidationError("input-reviewer-title");

                            alert(getCombinedAlert(data));
                        } else {
                            form.submit();
                        }
                    }
                });
            });
            var hash = window.location.hash;
            hash = (hash) ? hash : "";
            hash = hash.slice(1).replace("#", "");
            if (hash == "write-a-review") {
                $(".btn-write-review").trigger('click');
            }

            $(document).on("click", ".btn-more-reviews", function (evt) {
                evt.preventDefault();
                var button = $(this);
                var rid = button.attr("data-rid");

                var buttonhtml = button.html();
                button.html(submitText);
                button.attr("disabled", "disabled");

                var postData = "dealerid=" + getFormVal("input-dealerid") +
                    "&reviewnextid=" + rid;
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/getmorereviews/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        button.removeAttr("disabled");
                        button.html(buttonhtml);
                        if (!data.IsValid) {
                            alert(getCombinedAlert(data));
                        } else {
                            $(".reviews-container").append(data.reviews);
                            if (data.nextkey && data.nextkey != null && data.nextkey != "") {
                                $(".btn-more-reviews").attr("data-rid", data.nextkey);
                            } else {
                                $(".btn-more-reviews").remove();
                            }
                        }
                    }
                });
            });
        }
    }

    function initApptSetOptions() {
        $(".btn-group-app-set .btn").on("click", function (evt) {
            if ($(this).hasClass("set-appointment")) {
                $(".app-set-collapse").collapse("show");
            } else {
                $(".app-set-collapse").collapse("hide");
            }
        });
    }

    function initOpenGallery() {
        $(".open-gallery").on("click", function (evt) {
            evt.preventDefault();
            $($("a[data-bsgallery]").get(0)).trigger("click");
        });
    }

    function initGallery() {
        $('#bootstrap-gallery').bsgallery({
            gallerysourceurl: "/ws/gallery/"
        });
    }

    function initDealerGallery() {
        $('#bootstrap-dealer-gallery').bsgallery({
            gallerysourceurl: "/ws/dealer-gallery/"
        });
    }

    function initOfferForm() {
        var form = $("#offer-form");
        if (form.length > 0) {
            form.find("#button-submit-form").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                var buttonhtml = button.html();
                button.html("Submitting...");
                button.attr("disabled", "disabled");
                var postData = form.serialize();
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/offer/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html(buttonhtml);
                            if (data.ErrFields.name) showValidationError("input-user-name");
                            if (data.ErrFields.email) showValidationError("input-user-email");
                            if (data.ErrFields.phone) showValidationError("input-user-phone");
                            if (data.ErrFields.address) showValidationError("input-user-address");
                            if (data.ErrFields.city) showValidationError("input-user-city");
                            if (data.ErrFields.state) showValidationError("input-user-state");
                            if (data.ErrFields.zip) showValidationError("input-user-zip");
                            if (data.ErrFields.agree) showValidationError("input-user-agree");
                            var msg = "";
                            for (var i in data.ErrFields) {
                                msg += ((msg == "") ? "" : "\n") + data.ErrFields[i];
                            }
                            alert(msg);
                        } else {
                            if (data.Data && data.Data.redirect) {
                                window.location = data.Data.redirect;
                            } else {
                                form.submit();
                            }
                        }
                    }
                });
            });
        }
    }

    function initShareModal() {
        $(".modal-share").on("hidden.bs.modal", function (event) {
            $("html").removeClass("modal-share-open");
        }).on("show.bs.modal", function (event) {
            $("html").addClass("modal-share-open");
        });;
    }

    function initSurveyForm() {
        var form = $("#survey-form");
        if (form.length > 0) {

            $(".survey-question-row").each(function(i, e) {
                var question = {};
                question.SurveyQuestionId = $(this).attr("data-id");
                question.AnswerType = $(this).attr("data-answertype");

                $(this).removeAttr("data-id");
                $(this).removeAttr("data-answertype");
                if (question.SurveyQuestionId) {
                    $(this).data("question", question);
                }
            });

            form.find("#button-submit-form").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                var button = $(this);
                var buttonhtml = button.html();
                button.html("Submitting...");
                button.attr("disabled", "disabled");

                var responses = new Array();
                $(".survey-question-row").each(function(i, e) {
                    var row = $(e);
                    var question = row.data("question");
                    if (question) {
                        var response = {};
                        response.SurveyQuestionId = question.SurveyQuestionId;
                        if (question.AnswerType == "SingleChoice") {
                            var answerid = row.find("input[type=radio]:checked").val();
                            if (answerid) {
                                response.SurveyAnswerId = answerid;
                                responses.push(response);
                            }
                        } else if (question.AnswerType == "MultipleChoice") {
                            row.find("input[type=checkbox]:checked").each(function (i, e) {
                                var answerid = $(this).val();
                                if (answerid) {
                                    responses.push({ SurveyQuestionId: question.SurveyQuestionId, SurveyAnswerId: answerid });
                                }
                            });
                        } else if (question.AnswerType == "SingleLine" || question.AnswerType == "MultipleLine") {
                            var answertext = row.find("input[type=text],textarea").val();
                            if (answertext) {
                                response.AnswerText = answertext;
                                responses.push(response);
                            }
                        } else if (question.AnswerType == "YesNo") {
                            var answertext = row.find("input[type=radio]:checked").val();
                            if (answertext) {
                                response.AnswerText = answertext;
                                responses.push(response);
                            }
                        } else if (question.AnswerType == "Rating") {
                            var answervalue = row.find("input[type=radio]:checked").val();
                            if (answervalue) {
                                response.AnswerValue = answervalue;
                                responses.push(response);
                            }
                        }
                    }
                });

                var postData = form.serialize()
                    + "&rating=" + getFormVal("review-rating-value")
                    + "&spamCheck=" + getFormVal("check")
                    + "&referrer=" + document.referrer
                    + '&surveyresponses=' + JSON.stringify(responses);
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/survey/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html(buttonhtml);
                            if (data.ErrFields.name) showValidationError("input-user-name");
                            if (data.ErrFields.email) showValidationError("input-user-email");
                            if (data.ErrFields.rating) $("#review-rating-value").closest(".survey-question-row").addClass("has-error");
                            if (data.ErrFields.market) showValidationError("survey-review-location");
                            if (data.ErrFields.reviewtitle) showValidationError("survey-review-title");
                            if (data.ErrFields.comment) showValidationError("survey-review-comments");

                            if (data.Data.questionerrorfields) {
                                var questionerrorfields = $.parseJSON(data.Data.questionerrorfields);
                                $.each(questionerrorfields, function (i, q) {
                                    if (q.question && q.question != "") {
                                        $(".survey-question-row:nth("+q.question.replace("q","")+")").addClass("has-error");
                                    }
                                });
                            }

                            var msg = "";
                            for (var i in data.ErrFields) {
                                msg += ((msg == "") ? "" : "\n") + data.ErrFields[i];
                            }
                            alert(msg);
                        } else {
                            if (data.Data && data.Data.redirect) {
                                window.location = data.Data.redirect;
                            } else {
                                form.submit();
                            }
                        }
                    }
                });
            });
        }
    }

    function initFixedHeader() {
        // Hide Header on on scroll down
        var didScroll;
        var lastScrollTop = 0;
        var delta = 5;
        var navbarHeight = $('.header').outerHeight();

        $(window).scroll(function (event) {
            didScroll = true;
        });

        setInterval(function () {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 250);

        function hasScrolled() {
            var st = $(this).scrollTop();

            if (Math.abs(lastScrollTop - st) <= delta)
                return;
            if (st > lastScrollTop && st > navbarHeight) {
                // Scroll Down
                $('.header').removeClass('scroll-down').addClass('scroll-up');
            } else if (st == 0) {
                $('.header').removeClass("scroll-down scroll-up");
            } else {
                // Scroll Up
                if (st + $(window).height() < $(document).height()) {
                    $('.header').removeClass('scroll-up').addClass('scroll-down');
                }
            }

            lastScrollTop = st;
        }

        $('.navbar-collapse').on('shown.bs.collapse', function () {
            $("body").addClass("navbar-open");
        }).on('hidden.bs.collapse', function () {
            $("body").removeClass("navbar-open");
        });
    }
    function initFindDealer() {
        var navbarForm = $("#navbar-locator-form");
        var locatorForm = $("#dealer-locator-form");

        if (navbarForm.length > 0) {
            bindEnterKeyEvent("#input-navbar-dealer-zip", "#btn-navbar-find-dealer");
            attachEvent("input-navbar-dealer-zip", "btn-navbar-find-dealer");
        }

        if (locatorForm.length > 0) {
            bindEnterKeyEvent("#input-dealer-zip", "#btn-find-dealer");
            attachEvent("input-dealer-zip", "btn-find-dealer");
            if (queryString("zip") == "") {
                $("#input-dealer-zip").focus();
            }
        }

        function attachEvent(txtbox, btnid) {
            var btn = $("#" + btnid);
            btn.on("click", function(evt) {
                evt.preventDefault();
                var btntext = btn.html();
                btn.html("<i class=\"fas fa-spinner fa-spin\">");
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/find-dealer/",
                    data: "zip=" + getFormVal(txtbox) + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        btn.removeAttr("disabled");
                        btn.html(btntext);
                        if (!data.IsValid) {
                            alert(getCombinedAlert(data));
                        } else {
                            window.location = "/locator/?zip=" + $("#"+txtbox).val();
                        }
                    },
                    error: function () {
                        btn.removeAttr("disabled");
                        btn.html(btntext);
                        alert("Error Occurred Please try again");
                    }
                });
            });
        }
    }

    function initBecomeDealerForm() {
        var form = $("#become-dealer-form");
        if (form.length > 0) {
            $('#dealer-form-zip').focus(function () {
                if ($(this).val().length) {
                    $(this).data("val", $(this).val());
                }
            });
            $('#dealer-form-zip').blur(function () {
                var newvalue = $(this).val();
                var oldvalue = $(this).data("val");
                if ($(this).val().length > 4 && newvalue != oldvalue) {
                    $.ajax({
                        type: "POST",
                        cache: false,
                        dataType: "json",
                        async: false,
                        url: "/ws/getcitystate/",
                        data: "zip=" + getFormVal("dealer-form-zip") +
                              "&country=" + getFormVal("dealer-form-country") +
                                serializeSecToken(),
                        success: function (resp) {
                            handleResponseError(resp);
                            if (resp.IsValid) {
                                $('#dealer-form-city').val(resp.Data.city);
                                $('#dealer-form-state').val(resp.Data.state);
                            }
                        }
                    });
                }
            });

            form.find("#become-dealer-submit-form").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                var buttonhtml = button.html();
                button.html("Submitting...");
                button.attr("disabled", "disabled");
                var postData = form.serialize();
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/become-dealer/",
                    data: postData + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html(buttonhtml);
                            if (data.ErrFields.contactname) showValidationError("dealer-form-dealer-name");
                            if (data.ErrFields.company) showValidationError("dealer-form-company");
                            if (data.ErrFields.phone) showValidationError("dealer-form-phone");
                            if (data.ErrFields.email) showValidationError("dealer-form-email");
                            if (data.ErrFields.phone) showValidationError("dealer-form-phone");
                            if (data.ErrFields.address) showValidationError("dealer-form-address");
                            if (data.ErrFields.zip) showValidationError("dealer-form-zip");
                            if (data.ErrFields.city) showValidationError("dealer-form-city");
                            if (data.ErrFields.state) showValidationError("dealer-form-state");
                            if (data.ErrFields.referral) showValidationError("dealer-form-referral");
                            if (data.ErrFields.businessyears) showValidationError("dealer-form-businessyears");
                            if (data.ErrFields.website) showValidationError("dealer-form-website");

                            alert(getCombinedAlert(data));
                        } else {
                            if (data.Data && data.Data.redirect) {
                                window.location = data.Data.redirect;
                            } else {
                                form.submit();
                            }
                        }
                    }
                });
            });
        }
    }

    window.onload = function () {
        var gaTrackingPhoneNumbers = document.getElementsByClassName("ga-tracking-number");
        for (var i = 0; i < gaTrackingPhoneNumbers.length; i++) {
            var number = gaTrackingPhoneNumbers[i].getAttribute("data-tracking-phone");
            _googWcmGet('ga-tracking-number', number);

            var gaTrackingPhoneNumbersUpdated = document.getElementsByClassName("ga-tracking-number");
            if (gaTrackingPhoneNumbersUpdated.length > 0) {
                var googleNumber = gaTrackingPhoneNumbersUpdated[0].innerText;
                var gaTrackingMobileNumbers = document.getElementsByClassName("ga-tracking-number-mobile");
                for (j = 0; j < gaTrackingMobileNumbers.length; j++) {
                    gaTrackingMobileNumbers[j].setAttribute("href", "tel:" + googleNumber);
                }
            }
        }
    }


    function clearReviewOptions(optionsmenu) {
        for (var i = optionsmenu.length-1; i >= 0; i--) {
            optionsmenu[i] = null;
        }
    }

    function orderOptions(optionsmenu) {
        if (optionsmenu[0].innerText.includes("Select")) {
            optionsmenu.selectedIndex = 0;
            return;
        }
        for (var i = 0; i < optionsmenu.length; i++) {
            var option = optionsmenu[i];
            if (option.innerText.includes("Select")) {
                var temp = optionsmenu[0];
                optionsmenu[0] = option;
                optionsmenu[i] = temp;
            }
        }
        optionsmenu.selectedIndex = 0;
    }

    function reviewTextRequestMenuChanges() {
        var form = $("#send-review-form");
        if (form.length > 0) {
            $("#input-text-review-dealer").on("change", function (evt) {
                var marketmenu = document.getElementById("text-review-market");
                if (marketmenu.className.includes("form-group hidden")) {
                    marketmenu.className = "form-group";
                }
                var sitemenu = document.getElementById("text-review-site-div");
                if (sitemenu.className.includes("form-group")) {
                    sitemenu.className = "form-group hidden";
                }
                //populate market dropdown based on dealer choice
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    async: false,
                    url: "/ws/review-text-request-choose-dealer/",
                    data: "dealer=" + getFormVal("input-text-review-dealer"),
                    success: function (resp) {
                        var i = 0;
                        var optionsmenu = document.getElementById("input-text-review-request-market");
                        clearReviewOptions(optionsmenu);
                        for (var market in resp) {
                            var word = resp[market];
                            var option = new Option(word, market);
                            optionsmenu[optionsmenu.length] = option;
                        }
                        orderOptions(optionsmenu);
                    },
                    error: function () {
                        alert("An error occurred with getting review markets");
                    }
                })
                //populate default text message
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    async: false,
                    url: "/ws/review-text-request-change-message/",
                    data: "dealer=" + getFormVal("input-text-review-dealer"),
                    success: function (resp) {
                        var msgSection = document.getElementById("text-message");
                        msgSection.innerHTML = resp;
                    },
                    error: function () {
                        alert("An error occurred with setting the default message");
                    }
                });;
            });
            $("#input-text-review-request-market").on("change", function (evt) {
                var sitemenu = document.getElementById("text-review-site-div");
                if (sitemenu.className.includes("form-group hidden")) {
                    sitemenu.className = "form-group";
                }
                //populate review site dropdown based on market choice
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    async: false,
                    url: "/ws/review-text-request-market-change-sites/",
                    data: "market=" + getFormVal("input-text-review-request-market")
                           + "&dealer=" + getFormVal("input-text-review-dealer"),
                    success: function (resp) {
                        var optionsmenu = document.getElementById("text-review-select-site");
                        clearReviewOptions(optionsmenu);
                        for (var site in resp) {
                            var word = resp[site];
                            var option = new Option(word, site);
                            optionsmenu[optionsmenu.length] = option;
                        }
                    },
                    error: function () {
                        alert("An error occurred with creating site choices");
                    }
                });
                //create hidden link values for future parsing
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    async: false,
                    url: "/ws/review-text-request-market-change-links/",
                    data: "market=" + getFormVal("input-text-review-request-market")
                           + "&dealer=" + getFormVal("input-text-review-dealer"),
                    success: function (resp) {
                        var linkSection = document.getElementById("text-review-link-div");
                        linkSection.innerHTML = "\n \n ";
                        for (var idx in resp) {
                            var link = '<input type="hidden"' + 'value="' + resp[idx] + '" />';
                            linkSection.innerHTML += link;
                        }
                    },
                    error: function () {
                        alert("An error occurred with creating site links");
                    }
                });


            });
        }
    }

    function initReviewTextRequest() {
        var form = $("#send-review-form");
        if (form.length > 0) {
            form.find("#button-submit-form").click(function (e) {

                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                button.html("Sending...");
                button.attr("disabled", "disabled");

                //get and bitly shorten link
                var reviewSite = document.getElementById("text-review-select-site");
                var links = $('#text-review-link-div').children();
                var externalLink = links[reviewSite.selectedIndex];
                var shortenedLink = "";
                if (typeof (externalLink) != "undefined") {
                    $.ajax({
                        type: "POST",
                        cache: false,
                        dataType: "json",
                        async: false,
                        url: "/ws/shortenlink/",
                        data: "longlink=" + encodeURIComponent(externalLink.value),
                        success: function (response) {
                            shortenedLink = response;
                        },
                        error: function () {
                            alert("An error occurred with link shortening");
                        }
                    });
                }
                //submit relevant form info
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    async: false,
                    url: "/ws/review-text-request/",
                    data: "phone=" + $("#input-user-phone").val()
                        + "&link=" + encodeURIComponent(shortenedLink)
                        + "&message=" + encodeURIComponent($("#text-message").val())
                        + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html("SEND REVIEW REQUEST");
                            if (data.ErrFields.phone) showValidationError("input-user-phone");
                            if (data.ErrFields.link) showValidationError("input-text-review-request-market");
                            if (data.ErrFields.message) showValidationError("text-message");
                            var msg = "";
                            for (var i in data.ErrFields) {
                                msg += ((msg == "") ? "" : "\n") + data.ErrFields[i];
                            }
                            alert(msg)
                        } else {
                            alert("Review Request Sent!");

                            button.removeAttr("disabled");
                            button.html("SEND REVIEW REQUEST");
                        }
                    }
                });
            });
        }
    }
    function initExitIntent() {

        function closeExitIntent() {
            $("body").removeClass("modal-exit-intent-open");
            $("#myModal").removeClass('in');
            $("#myModal .modal-backdrop").hide();
            $("body").removeClass("modal-open");
            $("#myModal").css("display", "");
            $("#myModal").attr("shown", true);
            $("#apexchat_invitation_container_wrapper").removeClass("hide");
            $("#apexchat_invitation_container_minimized_wrapper").removeClass("hide");
        }

        var exitModal = $("#myModal");
        if (exitModal.length) {
            function showIntent() {
                var cookie = getCookie("_hei");
                return cookie == null || cookie === "false";
            }
            function displayExitIntent() {
                if (showIntent()) {
                    $(document).on("mouseleave.exitintent", function (e) {
                        var from = e.relatedTarget || e.toElement;
                        if (!from && e.clientY < 20 && !$("#myModal").is(":visible") && showIntent() && $("#myModal").attr("shown") != "true" && (($("#myModal").attr("intenttype") == "Chat Intent" && window.ApexChat) || ($("#myModal").attr("intenttype") != "Chat Intent"))) {
                            exitModal.on("show.bs.modal", function (evt) {
                                $("#apexchat_invitation_container_wrapper").addClass("hide");
                                $("#apexchat_invitation_container_minimized_wrapper").addClass("hide");
                                trackOutboundLink($("#myModal").attr("intenttype"), "Triggered", "Yes");
                            }).on("hide.bs.modal", function (evt) {
                                closeExitIntent();
                                trackOutboundLink($("#myModal").attr("intenttype"), "Denied", "Yes");
                                saveCookie("_hei", "true", 1, "/");
                            }).modal({
                                keyboard: false,
                                backdrop: "static",
                                show: true
                            });
                        }
                    });

                    exitModal.find(".btn-intent-primary").on("click", function (e) {
                        var outbound = "";
                        if ($("#myModal").attr("intenttype") == "Chat Intent") {
                            $(document).off("mouseleave.exitintent");
                            var apexCompanyId = window.ApexChat.Invitation.options.companyId;
                            var agentId = window.ApexChat.Invitation.options.agentAliasId;
                            window.open('http://www.Spectrumchat.com/pages/chat.aspx?companyId=' + apexCompanyId + '&amp;requestedAgentId=' + agentId + '&originalReferrer=' + document.referrer + '&referrer=' + window.location.href, '', 'width=440,height=680');
                            outbound = "Exit Intent - Chat";
                        } else {
                            outbound = "Exit Intent - Offer";
                        }
                        if ($("#exit-intent-input-name").length == 0) {
                            closeExitIntent();
                            saveCookie("_hei", "true", 1, "/");
                            if ($("#myModal").attr("intenttype") != "Download Intent") {
                                trackOutboundLink(outbound, "Completed", "Yes");
                            }
                        }
                    });
                }
            }
            setTimeout(function () { $(window).bind('load', displayExitIntent()) }, 7000);
        }

        $(".download-intent-download").click(function () {
            var name = $("#exit-intent-input-name").val();
            var email = $("#exit-intent-input-email").val();
            var zip = $("#exit-intent-input-zip").val();
            var file = $("#downloadablefile").val();
            button = $(this);
            button.attr("disabled", "disabled");
            $.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                url: "/ws/download-exit-intent/",
                data: "name=" + name +
                    "&email=" + email +
                    "&zip=" + zip +
                    "&file=" + file,
                success: function (data) {
                    removeFeedback();
                    if (!data.IsValid) {
                        button.removeAttr("disabled");
                        if (data.ErrFields.name) showValidationError("exit-intent-input-name");
                        if (data.ErrFields.email) showValidationError("exit-intent-input-email");
                        if (data.ErrFields.zip) showValidationError("exit-intent-input-zip");
                        var msg = "";
                        for (var i in data.ErrFields) {
                            msg += ((msg == "") ? "" : "\n") + data.ErrFields[i];
                        }
                        alert(msg)
                    } else {
                        trackOutboundLink("Exit Intent - Download", "Completed", "Yes");
                        saveCookie("_hei", "true", 1, "/");
                        window.open(file);
                        closeExitIntent();
                    }
                }
            });
        })
    }

    function initMobileNav() {
        $(".navflyout-toggle, .mobile-nav-toggle").on("click", function () {
            if ($("body").hasClass("nav-open")) {
                $("body").removeClass("nav-open");
            } else {
                $("body").addClass("nav-open");
            }
        });
    }
    function initMobileCta() {
        if ($(".quote-form").length) {
            var quotePos = $(".quote-form").offset().top;
            var quoteBottom = $(".quote-form").height() + quotePos;
            $(window).scroll(function (event) {
                var yPos = $(window).scrollTop();
                var yPosBottom = yPos + $(window).height();
                $(".btn-quote-ft-mobile").addClass("showme");
                if (yPosBottom > quotePos) {
                    $(".btn-quote-ft-mobile").removeClass("showme");
                }
                if (yPos > quoteBottom) {
                    $(".btn-quote-ft-mobile").addClass("showme");
                }
            });
        } else {
            $(".btn-quote-ft-mobile").hide();
        }
    }
    function initTriggerAnimate() {
        if ($(".triggerAnimate").length) {
            $(window).on("scroll", function () {
                var y = $(window).scrollTop();
                var yBottom = y + $(window).height() - 100;
                $(".triggerAnimate").each(function () {
                    if (yBottom > $(this).offset().top) {
                        $(this).addClass("animate");
                    }
                });
            });
        }
    }

    //Customization
    function initStormForm() {
        var form = $("#salesforce-quote");
        if (form.length > 0) {
            form.find("#salesforce-quote-submit").click(function(e) {
                e.preventDefault();
                $(".error").removeClass("error");

                if ($("#bot-captcha").val() !== "") return;

                button = $(this);
                button.html("Submitting...");
                button.attr("disabled", "disabled");
                var postData = form.serialize();
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/salesforce-form/",
                    data: postData + serializeSecToken(),
                    success: function(data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html("Subscribe Now");
                            if (data.ErrFields.name) showValidationError("salesforce-quote-name");
                            if (data.ErrFields.email) showValidationError("salesforce-quote-email");
                            if (data.ErrFields.phone) showValidationError("salesforce-quote-phone");
                            if (data.ErrFields.companyName) showValidationError("salesforce-quote-company-name");
                            var msg = "";
                            for (var i in data.ErrFields) {
                                msg += ((msg == "") ? "" : "\n") + data.ErrFields[i];
                            }
                            alert(msg);
                        } else {
                            if (data.Data && data.Data.redirect) {
                                window.location = data.Data.redirect;
                            } else {
                                form.submit();
                            }
                        }
                    }
                });
            });
        }
    }

    function initExtremeWeatherAppointmentForm() {
        var form = $("#extreme-weather-quote");
        if (form.length > 0) {
            var progress = 0;
            var pInterval;

            var $container = $("#weather-container");
            if ($container.length) {
                var address = getCookie("address");
                $.ajax({
                    type: "POST",
                    url: "/ws/retrieve-weather-results/",
                    data: { address: address },
                    timeout: 120000,
                    success: function (data) {
                        clearInterval(pInterval);
                        completeProgress();

                        $container.html(data);

                        var weatherDescription = $("#weather-desc").length ? $("#weather-desc").val() : "";
                        $("#weatherResults").val(weatherDescription);
                        $(".match-height").matchHeight();
                        deleteCookie("address");
                    },
                    error: function (e) {
                        clearInterval(pInterval);

                        console.log(e);
                    }
                });

                pInterval = setInterval(updateProgress, 1000);
            }

            form.find("#extreme-weather-quote-submit").click(function (e) {
                e.preventDefault();
                $(".error").removeClass("error");
                button = $(this);
                button.html("Submitting...");
                button.attr("disabled", "disabled");
                var postData = form.serialize();
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: "/ws/updatequoteappointment/",
                    data: postData
                        + "&convertedpage=" + encodeURIComponent(document.location.href)
                        + "&variantPage=" + $("#variantPage").val()
                        + serializeSecToken(),
                    success: function (data) {
                        removeFeedback();
                        if (!data.IsValid) {
                            button.removeAttr("disabled");
                            button.html("Request Your Quote");
                            var msg = "";
                            for (var i in data.ErrFields) {
                                msg += ((msg == "") ? "" : "\n") + data.ErrFields[i];
                            }
                            alert(msg);
                        } else {
                            if (data.Data && data.Data.redirect) {
                                window.location = data.Data.redirect;
                            } else {
                                var action = form.attr("action");
                                form.attr("action", action + (action.indexOf("?") > 0 ? "&" : "?") + "convertedpage=" + encodeURIComponent(document.location.pathname));
                                form.submit();
                            }
                        }
                    }
                });

            });

            function updateProgress() {
                var $progressBar = $(".progress-bar");

                progress += 1;

                var percent = Math.floor((progress / 120) * 100);

                $progressBar.attr("aria-valuenow", percent);
                $progressBar.css("width", percent + "%");
                $progressBar.find("span").text(percent + "% Complete");
            }

            function completeProgress() {
                var $progressBar = $(".progress-bar");

                var percent = 100;
                progress = 0;

                $progressBar.attr("aria-valuenow", percent);
                $progressBar.css("width", percent + "%");
                $progressBar.find("span").text(percent + "% Complete");
            }
        }
    }
    function iniDisableNavbarBrand() {
        if ($(".disable-navbar-brand").length) {
            $(".disable-navbar-brand .navbar-brand").on("click", function () {
                return false;
            });
        }
    }


    initDatePickers();
    initCollapsible();
    initNews();
    initApptSetOptions();
    initQuoteForm();
    initContactForm();
    initNav();
    initSideNav();
    initBlogSubscribe();
    initBlogComment();
    initBlogRecent();
    initScrollTo();
    initScrollToCollapse();
    initCareersForm();
    initUpload();
    initRatings();
    initReviews();
    initOpenGallery();
    initGallery();
    initDealerGallery();
    initOfferForm();
    initShareModal();
    initSurveyForm();
    initFixedHeader();
    initFindDealer();
    initBecomeDealerForm();
    initDealerReviews();
    initReviewTextRequest();
    reviewTextRequestMenuChanges();
    initExitIntent();
    initMobileNav();
    initMobileCta();
    initTriggerAnimate();
    initStormForm();
    initExtremeWeatherAppointmentForm();
    iniDisableNavbarBrand();
    $("[rel=clickover]").clickover();
    $(".match-height").matchHeight();
})
