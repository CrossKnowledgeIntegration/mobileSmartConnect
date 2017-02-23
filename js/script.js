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
        var url = location.origin + "/learner/"
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
        var url = location.origin + "/learner/token/";
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

// // Load vue-material on all pages
// $(document).ready(function() {
    
//     Vue.use(VueMaterial);
//     var App = new Vue({
//         el: '#app'
//     });

// });
    
//     $("#butLogin").click(function() {       
//         blockUI(true);

//         var url = location.pathname + "learner/"

//         $.ajax({
//             type: "POST",
//             url: url,
//             data: JSON.stringify(
//                 {
//                     login: $("#txtSearchLogin").val()
//                 }
//             ),
//             dataTye: "text",
//             success: function (data) {
//                 if (!data.success) {
//                     switch(data.message) {
//                         case "NO_LEARNER":
//                             $("#message").html("No learner is matching these parameters.");
//                             break;
//                         case "LEARNERCOUNT_GT_1":
//                             $("#message").html("More than one learner matches these parameters.");
//                             break;
//                     }
//                 }
//                 else {
//                     $("#identity").html(data.learner);
//                     $("#panel-login").hide();
//                     $("#panel-confirm").show();

//                     // Attach events
//                     $("#not-me").click(function() {
//                         location.href = location.href;
//                     });

//                     $("#me").click(function() {
//                         blockUI(true);
//                         // Search token
//                         var url = location.pathname + "learner/token/";

//                         $.ajax({
//                             type: "POST",
//                             url: url,
//                             data: JSON.stringify(
//                                 {
//                                     learnerId: data.learnerId
//                                 }
//                             ),
//                             dataTye: "text",
//                             success: function (data) {
//                                 blockUI(false);
//                                 var token = data.token;
//                                 // Redirect to mobileCompanion
//                                 var url = "mobileCompanion://?key=" + token;
//                                 location.href = url;
//                             },
//                             error: function (data) {
//                                 $("#message2").html("An error occured.")
//                                 blockUI(false);
//                             }
//                         });
//                     })
//                 }
//                 blockUI(false);
//             },
//             error: function (data) {
//                 $("#message").html("An error occured.")
//                 blockUI(false);
//             }
//         });
//     });             
// });  