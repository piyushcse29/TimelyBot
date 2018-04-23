const functions = require('firebase-functions');
var admin = require("firebase-admin");
var nodemailer = require('nodemailer');

admin.initializeApp(functions.config().firebase);

var firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.webhook = functions.https.onRequest((request, response) => {


    console.log("request.body.result.parameters: ", request);
    console.log("request.body.result.parameters: ", request.body.result.parameters);
    console.log("request.body.result.action: ", request.body.result.action);

    let params = request.body.result.parameters;
    switch (request.body.result.action) {

        case 'showSummary':
            console.log("Inside Summary");
            firestore.collection('leaveRequests').where('email', '==', params["email"]).get()
                .then((querySnapshot) => {

                    var leaves = [];
                    querySnapshot.forEach((doc) => {
                        console.log("Summary data " + doc.data());
                        leaves.push(doc.data())
                    });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    // converting array to speech
                    var speech = `you have ${leaves.length} leaves requested. \n Do you want to see full summary?`;

                    return response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })
            break;

        case 'fullSummary':
            console.log("Inside Full Summary");
            firestore.collection('leaveRequests').where('email', '==', params["email"]).get()
                .then((querySnapshot) => {

                    var leaves = [];
                    querySnapshot.forEach((doc) => {
                        console.log("Summary data " + doc.data());
                        leaves.push(doc.data())
                    });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    // converting array to speech
                    var speech = ``;


                    leaves.forEach((leaveRecord, index) => {
                        console.log("record 1 " + leaveRecord["date"]);
                        console.log("record 2 " + leaveRecord["date-period"]);
                        if (leaveRecord["date"] !== undefined)
                            speech += `${index + 1} : ${leaveRecord["Leave-Type"]} leave  on ${leaveRecord["date"]} \n`
                        else if (leaveRecord["date-period"] !== undefined) {
                            speech += `${index + 1} : ${leaveRecord["Leave-Type"]} leave  on ${leaveRecord["date-period"]} \n`
                        }
                    })


                    let result = {
                        "speech": "this text is spoken out loud if the platform supports voice interactions",
                        "displayText": "this text is displayed visually",
                        "messages": {
                            "type": 1,
                            "title": "card title",
                            "subtitle": "card text"
                            // ,
                            // "imageUrl": ""
                        },
                        "data": {
                            "google": {
                                "expectUserResponse": true,
                                "richResponse": {
                                    "items": [{
                                            "simpleResponse": {
                                                "textToSpeech": "Here is your full leave record:"
                                            }
                                        },

                                        {
                                            "basicCard": {
                                                "title": "Leave Records",
                                                "formattedText": speech
                                                //,
                                                // "subtitle": "This is a subtitle"
                                                // ,
                                                // "image": {
                                                //     "url": "",
                                                //     "accessibilityText": "Image alternate text"
                                                // }
                                                // ,
                                                // "buttons": [{
                                                //     "title": "This is a button",
                                                //     "openUrlAction": {
                                                //         "url": ""
                                                //     }
                                                // }]
                                            }
                                        }
                                    ],
                                    "suggestions": [
                                        { "title": "" },
                                        { "title": "" },
                                        { "title": "" },
                                        { "title": "" }
                                    ]

                                }
                            },
                            "facebook": {
                                "text": "Hello, Facebook!"
                            },
                            "slack": {
                                "text": "This is a text response for Slack."
                            }
                        },
                        "contextOut": [{
                            "name": "context name",
                            "lifespan": 5,
                            "parameters": {
                                "param": "param value"
                            }
                        }],
                        "source": "example.com",
                        "followupEvent": {
                            "name": "event name",
                            "parameters": {
                                "param": "param value"
                            }
                        }
                    };

                    return response.send(result);
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })
            break;

        case 'One-day-leave.One-day-leave-custom':
            console.log("Inside One day Leave");

            result = {
                "speech": "this text is spoken out loud if the platform supports voice interactions",
                "displayText": "this text is displayed visually",
                "messages": {
                    "type": 1,
                    "title": "card title",
                    "subtitle": "card text"
                    // ,
                    // "imageUrl": ""
                },
                "data": {
                    "google": {
                        "expectUserResponse": true,
                        "richResponse": {
                            "items": [{
                                    "simpleResponse": {
                                        "textToSpeech": "Here is your full leave record:"
                                    }
                                },

                                {
                                    "basicCard": {
                                        "title": "Leave Records",
                                        "formattedText": "Date: "+request.body.result.parameters.date + "\n Leave-Type: " + request.body.result.parameters.leave_type + "\n Id: " + request.body.result.parameters.email +
                                            "Are you sure to apply for leave?"
                                        //,
                                        // "subtitle": "This is a subtitle"
                                        // ,
                                        // "image": {
                                        //     "url": "",
                                        //     "accessibilityText": "Image alternate text"
                                        // }
                                        // ,
                                        // "buttons": [{
                                        //     "title": "This is a button",
                                        //     "openUrlAction": {
                                        //         "url": ""
                                        //     }
                                        // }]
                                    }
                                }
                            ],
                            "suggestions": [
                                { "title": "Confirm" },
                                { "title": "Nope" }
                            ]

                        }
                    },
                    "facebook": {
                        "text": "Hello, Facebook!"
                    },
                    "slack": {
                        "text": "This is a text response for Slack."
                    }
                },
                "contextOut": [{
                    "name": "context name",
                    "lifespan": 5,
                    "parameters": {
                        "param": "param value"
                    }
                }],
                "source": "example.com",
                "followupEvent": {
                    "name": "event name",
                    "parameters": {
                        "param": "param value"
                    }
                }
            };

            response.send(result);

            break;

            case 'holidays':
            console.log("Inside holidays");

            // result = {
            //     "speech": "this text is spoken out loud if the platform supports voice interactions",
            //     "displayText": "this text is displayed visually",
            //     "messages": {
            //         "type": 1,
            //         "title": "card title",
            //         "subtitle": "card text",
            //          "imageUrl": "https://www.thaizer.com/wp-content/uploads/2017/09/Public_Holidays_Thailand_2018.jpg"
            //     },
            //     "data": {
            //         "google": {
            //             "expectUserResponse": true,
            //             "richResponse": {
            //                 "items": [{
            //                         "simpleResponse": {
            //                             "textToSpeech": "Here is your full leave record:"
            //                         }
            //                     },

            //                     {
            //                         "basicCard": {
            //                             "title": "Leave Records",
            //                             "formattedText": "Date: "+"equest.body.result.parameters.date" + "\n\n Leave-Type: " + "request.body.result.parameters.leave_type" + "\n\n Id: " + "request.body.result.parameters.email" +
            //                                 "Are you sure to apply for leave?"
            //                             //,
            //                             // "subtitle": "This is a subtitle"
            //                             // ,
            //                             // "image": {
            //                             //     "url": "",
            //                             //     "accessibilityText": "Image alternate text"
            //                             // }
            //                             // ,
            //                             // "buttons": [{
            //                             //     "title": "This is a button",
            //                             //     "openUrlAction": {
            //                             //         "url": ""
            //                             //     }
            //                             // }]
            //                         }
            //                     }
            //                 ],
            //                 "suggestions": [
            //                     { "title": "Confirm" },
            //                     { "title": "Nope" }
            //                 ]

            //             }
            //         },
            //         "facebook": {
            //             "text": "Hello, Facebook!"
            //         },
            //         "slack": {
            //             "text": "This is a text response for Slack."
            //         }
            //     },
            //     "contextOut": [{
            //         "name": "context name",
            //         "lifespan": 5,
            //         "parameters": {
            //             "param": "param value"
            //         }
            //     }],
            //     "source": "example.com",
            //     "followupEvent": {
            //         "name": "event name",
            //         "parameters": {
            //             "param": "param value"
            //         }
            //     }
            // };

result = {
    "conversationToken": "",
    "expectUserResponse": true,
    "expectedInputs": [
        {
            "inputPrompt": {
                "richInitialPrompt": {
                    "items": [
                        {
                            "simpleResponse": {
                                "textToSpeech": "Math and prime numbers it is!"
                            }
                        },
                        {
                            "basicCard": {
                                "title": "Math & prime numbers",
                                "formattedText": "42 is an even composite number. It\n    is composed of three distinct prime numbers multiplied together. It\n    has a total of eight divisors. 42 is an abundant number, because the\n    sum of its proper divisors 54 is greater than itself. To count from\n    1 to 42 would take you about twenty-one…",
                                "image": {
                                    "url": "https://example.google.com/42.png",
                                    "accessibilityText": "Image alternate text"
                                },
                                "buttons": [
                                    {
                                        "title": "Read more",
                                        "openUrlAction": {
                                            "url": "https://example.google.com/mathandprimes"
                                        }
                                    }
                                ],
                                "imageDisplayOptions": "CROPPED"
                            }
                        }
                    ],
                    "suggestions": []
                }
            },
            "possibleIntents": [
                {
                    "intent": "actions.intent.TEXT"
                }
            ]
        }
    ]
};
            response.send(result);

            break;

        case 'leaveRequest':
            console.log("Inside Leave Request");
            firestore.collection('leaveRequests').add(params)
                .then(() => {
                    return response.send({
                        speech: `Leaves Applied`
                    });
                })
                .catch((e => {

                    console.log("error: ", e);

                    response.send({
                        speech: "something went wrong when writing on database"
                    });
                }))
            break;

        case 'One-day-leave.One-day-leave-custom.One-day-leave-custom':
            console.log("Inside One-day-leave-child-custom");

            if (request.body.result.parameters.confirm === 'ok') {

                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'mittalerish@gmail.com',
                        pass: 'Krsnaprabhu@29'
                    }
                });

                var mailOptions = {
                    from: 'mittalerish@gmail.com',
                    to: request.body.result.parameters.email,
                    subject: 'OTP For TMB leave',
                    text: 'Your OTP to apply for leaves: 12345'
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log('Email sent error: ' + error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });



                return response.send({

                    speech: `Please enter the OTP sent in your mail`
                });

            } else {
                response.send({

                    speech: 'What else can I do for you?'
                });
            }
            break;

        case 'One-day-leave.One-day-leave-custom.One-day-leave-custom.One-day-leave-child-confirm-otp':
            console.log("Inside One-day-leave-child-otp");

            if (request.body.result.parameters.otp === '12345') {
                firestore.collection('leaveRequests').add(params)
                    .then(() => {
                        return response.send({

                            speech: `Leaves Applied!`
                        });
                    })
                    .catch((e => {

                        console.log("error: ", e);

                        response.send({
                            speech: "Something is wrong with your OTP"
                        });
                    }))
            } else {
                response.send({

                    speech: 'Please enter correct OTP'
                });
            }
            break;
    }

});