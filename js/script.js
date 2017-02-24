function toggleBlockUI(block) {
    if (block) {
        $.blockUI(
        { 
            css: { 
                border: 'none', 
                padding: '5px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .5, 
                color: '#fff' 
            }
        }); 
    }
    else $.unblockUI();
}

function initVue() {
    Vue.use(VueMaterial);
    var App = new Vue({
        el: '#app'
    });
}

function getUrlParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var hubWrapper = function () {
    var self = this; 

    //args: {login: X, OTHER SEARCH FIELDS FROM UI}
    self.getLearner = function(args) {
        var url = location.href + "/learner/";
        var dfd = jQuery.Deferred();
        
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(args),
            dataTye: "text",
            success: function (data) {
                dfd.resolve(data);
            },
            error: function (data) {
                dfd.reject(data);
            }
        });

        return dfd.promise();
    }

    //args: {learnerId: X}
    self.getLearnerToken = function(args) {
        var url = location.pathname + "/learner/token/";
        var dfd = jQuery.Deferred();

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(
                {
                    learnerId: args.learnerId
                }
            ),
            dataTye: "text",
            success: function (data) {
                dfd.resolve(data);
            },
            error: function (data) {
                dfd.reject(data);
            }
        });

        return dfd.promise();
    }

    return self;
} 