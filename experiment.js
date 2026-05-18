/* =============================================================
   CIRCA spatial -> social mapping study (ages 4, 5, 6)
   Children see three CIRCA images side by side (CS, AR, EM) and
   point to one in response to each of 15 questions.

   Design notes:
   - Left-center-right order of the three images is randomized
     ONCE per participant and held constant for the whole session.
   - The 15 questions are presented in an individually randomized
     order.
   - Each response is recorded both as a screen position
     (left/center/right) AND coded to the relational model
     (CS/AR/EM) that occupied that position for this participant.
   ============================================================= */

const jsPsych = initJsPsych();

const timeline = [];

// ----- study parameters -----------------------------------------

const maxW = window.innerWidth;
const maxH = window.innerHeight;

/* CIRCA images, hosted in the img/ folder of this repo.
     CS.png = ring of overlapping circles      -> Communal Sharing
     AR.png = pyramid / triangle of circles    -> Authority Ranking
     EM.png = horizontal row of circles        -> Equality Matching
   NOTE: this URL uses the "main" branch. If you publish the repo
   with a "master" default branch instead, change main -> master. */
const img_directory = "https://raw.githubusercontent.com/ashleyjthomas/Circles/main/img/";

const images = {
    CS: img_directory + "CS.png",
    AR: img_directory + "AR.png",
    EM: img_directory + "EM.png"
};

/* Narration audio, hosted in the audio/ folder of this repo. These
   files are produced by generate_audio.py -- re-run that script if
   you reword any question. q01..q15 match the order of the
   questions array below. */
const audio_directory = "https://raw.githubusercontent.com/ashleyjthomas/Circles/main/audio/";

/* Randomize the left/center/right layout once, keep it for the
   whole session. position_order[0] is leftmost, [1] center,
   [2] rightmost. */
const position_order = jsPsych.randomization.shuffle(["CS", "AR", "EM"]);

// store the layout on every row of data so it can be coded later
jsPsych.data.addProperties({
    left_image: position_order[0],
    center_image: position_order[1],
    right_image: position_order[2]
});

/* The 15 questions, each tagged with the relational model it is
   intended to probe. "model" is the EXPECTED answer, not shown to
   the child or used to order anything. */
const questions = [
    { q: "Which ones eat from the same plate?", model: "CS" },
    { q: "Which ones like to dress just like one another?", model: "CS" },
    { q: "Which ones are all the same inside?", model: "CS" },
    { q: "Which ones dance together?", model: "CS" },
    { q: "Which ones hold hands?", model: "CS" },
    { q: "Which ones know who is older and who is younger?", model: "AR" },
    { q: "Which ones have someone who gets to go first?", model: "AR" },
    { q: "Which ones care about who is biggest?", model: "AR" },
    { q: "Which ones have someone who is strongest, and someone who is next strongest?", model: "AR" },
    { q: "Which ones care about who is in front and who is behind?", model: "AR" },
    { q: "Which ones take turns?", model: "EM" },
    { q: "Which ones divide cookies evenly, so each one gets the same number?", model: "EM" },
    { q: "When others give them something, which ones give back the same kind of thing?", model: "EM" },
    { q: "Which ones decide by flipping a coin, playing rock paper scissors, or going 'Eeny, meeny, miny, moe'?", model: "EM" },
    { q: "Which ones clean up equally?", model: "EM" }
];

// ----- boiler plate frames --------------------------------------

const preload = {
    type: jsPsychPreload,
    images: [images.CS, images.AR, images.EM],
    message: "Loading study...",
    show_detailed_errors: true
};

const enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    button_label: "Go full screen"
};

const video_config = {
    type: chsRecord.VideoConfigPlugin
};

/* NOTE: the purpose / procedures text below is study-specific
   placeholder language. Replace it with your IRB-approved consent
   text before running. */
const video_consent = {
    type: chsRecord.VideoConsentPlugin,
    PIName: "Ashley Thomas",
    institution: "Harvard University",
    PIContact: "Ashley Thomas, athomas@g.harvard.edu",
    payment: "You will receive a $5 gift card for completing this study. You will be asked to provide your email for this purpose. Your email will remain strictly confidential and will only be used to issue payment.",
    procedures: "The following is key information about the study: Someone will explain this asynchronous research study to you in the form of a video or summary. Your participation is completely voluntary; you and your child can choose not to take part. You and your child can agree to take part and later change your mind. Because this is an asynchronous online study, we schedule short sessions to ensure there is ample time to make sure that your webcam is set up and working properly. The study session will be conducted remotely and recorded through Lookit, an online platform for developmental research studies. During the study, your child will be observed and recorded for data collection purposes only. During the study, your child will be shown three pictures of circles arranged in different ways. You will read a series of short questions aloud, and your child will point to whichever picture they think is the best answer. There are no right or wrong answers. We will measure which picture your child points to. We don't believe there are any risks for your child from participating in this research. You and your child are free to choose whether to be in this study. You can ask all the questions you want before you decide. If you do choose to participate, it's okay to stop at any point during the session.",
    purpose: "Why is my child being invited to take part in a research study? We invite your child to take part in a research study because this study examines how typically developing children in their age range understand and learn about the world. In particular, we are interested in how children connect simple visual patterns -- such as circles arranged in different ways -- to ideas about how people relate to one another.",
    research_rights_statement: "You are not waiving any legal claims, rights, or remedies because of your participation in this research study. If you have questions, concerns, or complaints, or think the research has hurt your child, talk to the research team. You can contact the PI, Ashley Thomas, athomas@g.harvard.edu. This research has been reviewed and approved by the Harvard University Area Institutional Review Board (“IRB”). You may talk to them at (617) 496-2847 or cuhs@harvard.edu if: <ul><li>Your questions, concerns, or complaints are not being answered by the research team.</li><li>You cannot reach the research team.</li><li>You want to talk to someone besides the research team.</li><li>You have questions about your child's rights as a research subject.</li><li>You want to get information or provide input about this research.</li></ul>"
};

const start_rec = {
    type: chsRecord.StartRecordPlugin
};

const stop_rec = {
    type: chsRecord.StopRecordPlugin
};

const exit_survey = {
    type: chsSurvey.ExitSurveyPlugin
};

const email = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: "Please enter your email below. This information will be kept strictly confidential and will only be used to issue payment."
        }
    ],
    data: { trial_type: "free_response" }
};

const transition = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p style="font-size: 40px; margin-top:5px; line-height: 1.2;">
            Thank you for participating in our study and contributing to our research :) Your child can begin the study whenever they are ready!
            </p>`,
    choices: ['<p style="font-size: 40px; margin-top:5px;">Next</p>']
};

// ----- instructions ---------------------------------------------

const parent_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div style="max-width:1000px; margin:0 auto;">
            <p style="font-size: 34px; line-height: 1.35;">
            <b>For the grown-up:</b> In a moment your child will see three pictures,
            and a voice will read a question aloud each time. Your child should
            point to whichever picture they think is the best answer -- there are
            no right or wrong answers.<br><br>
            Please let your child hear the whole question before they answer, and
            click the picture they point to. After each answer, you can show your
            child that you appreciate their response (for example, "thank you!"),
            but please do <b>not</b> tell them whether an answer is right, wrong,
            or good.
            </p></div>`,
    choices: ['<p style="font-size: 40px; margin-top:5px;">Next</p>']
};

const child_intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<audio id="narration" autoplay>
                <source src="${audio_directory}intro.mp3" type="audio/mpeg">
            </audio>
            <div style="max-width:1000px; margin:0 auto;">
            <p style="font-size: 44px; line-height: 1.3;">
            I'll ask you some questions. You point to the answer each time --
            whatever answer you think is best.
            </p></div>`,
    choices: ['<p style="font-size: 40px; margin-top:5px;">Next</p>']
};

// ----- main CIRCA trials ----------------------------------------

/* The three image choices are constant for the whole session
   (layout is fixed per participant), so they are built once here
   in this participant's randomized left/center/right order. */
const image_choices = [
    `<img src="${images[position_order[0]]}" style="width:30vw; max-width:430px;">`,
    `<img src="${images[position_order[1]]}" style="width:30vw; max-width:430px;">`,
    `<img src="${images[position_order[2]]}" style="width:30vw; max-width:430px;">`
];

const circa_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: jsPsych.timelineVariable('prompt_html'),
    choices: image_choices,
    margin_horizontal: "18px",
    post_trial_gap: 500,
    data: {
        name: 'circa_response',
        question: jsPsych.timelineVariable('q'),
        intended_model: jsPsych.timelineVariable('model')
    },
    on_finish: function(data) {
        // data.response is the clicked button index: 0, 1, or 2
        data.position = ['left', 'center', 'right'][data.response];
        // code the position back to the relational model it held
        data.coded_response = position_order[data.response];
        // whether the child picked the model the question targets
        data.matches_intended = (data.coded_response === data.intended_model);
    }
};

const circa_block = {
    timeline: [circa_trial],
    timeline_variables: questions.map(function(item, i) {
        const audio_file = audio_directory + "q" + String(i + 1).padStart(2, "0") + ".mp3";
        return {
            q: item.q,
            model: item.model,
            prompt_html: `<audio id="narration" autoplay>
                    <source src="${audio_file}" type="audio/mpeg">
                    </audio>
                    <div style="max-width:1100px; margin:0 auto 18px auto;">
                    <p style="font-size: 46px; line-height: 1.3;">${item.q}</p>
                    </div>`
        };
    }),
    randomize_order: true
};

// ----- exit frames ----------------------------------------------

const thanks = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<audio id="narration" autoplay>
                <source src="${audio_directory}thanks.mp3" type="audio/mpeg">
            </audio>
            <p style="font-size: 44px; margin-top:5px; line-height: 1.3;">
            Thank you for playing!
            </p>`,
    choices: ['<p style="font-size: 40px;">Next</p>']
};

const debrief = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p style="padding: 1em; margin-left: 0; margin-bottom: 4%; border: medium solid #87b79f; border-radius: 5px; background-color: #effbf5; clear: both; font-size: 28px; line-height: 1.3;">Thanks to you and your child for participating in our study!<br style="line-height:60px;">Description of study: This study examines how children connect spatial patterns to social relationships. Pictures of overlapping circles, pyramids, and evenly spaced rows correspond to three kinds of relationships: communal sharing (everyone shares and is treated as the same), authority ranking (some people are ranked above others), and equality matching (everyone takes equal turns and equal shares). Older children and adults reliably map these pictures onto these relationship types; we are interested in whether 4-, 5-, and 6-year-olds already do so.<br style="line-height:60px;">Payment: we will send you a $5 gift code using the email you provided. This can take up to two weeks; if you have not received one by then, please let us know.<br style="line-height:60px;">To submit this study, you can click the "Submit" button.</p>`,
    choices: ['<p style="font-size: 40px;">Submit</p>']
};

// ----- study flow -----------------------------------------------

// setup
timeline.push(preload);
timeline.push(enter_fullscreen);
timeline.push(video_config);
timeline.push(video_consent);
timeline.push(start_rec);
timeline.push(transition);

// instructions
timeline.push(parent_instructions);
timeline.push(child_intro);

// 15 CIRCA questions, individually randomized order
timeline.push(circa_block);

// exit
timeline.push(thanks);
timeline.push(stop_rec);
timeline.push(email);
timeline.push(exit_survey);
timeline.push(debrief);

jsPsych.run(timeline);
