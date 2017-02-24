/*
	Main JS
	Author: Julien Chomarat @ Crossknowledge
	Project: https://github.com/CrossKnowledgeIntegration/mobileSmartConnect

	This software is provided "AS IS" - Licence MIT (https://opensource.org/licenses/MIT)
*/

// Show / Hide block UI popup while async tasks are running
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

// Init VueMaterial (https://vuematerial.github.io) (Responsive framework used)
function initVue() {
    Vue.use(VueMaterial);
    var App = new Vue({
        el: '#app'
    });
}

// Parse URL to retrieve query string parameters
function getUrlParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// JS wrapper to local web services ckBowsRestHandler.php
var hubWrapper = function () {
    var self = this; 

    // Get a learner for given search parameters
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

    // Get a learner token for a given learner GUID
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