- (ch) change pass & like buttons design
- (ch) upload image - show error if not valid size & other erros
- (ch) profile edit - height picker & show error message
- (ch) user item gradient
- (ch) likes buttons & count styles
- header top right - open feature modal
- show error messages (on POST request) & validation errors


https://www.cometchat.com/blog/7-best-dating-app-features-that-will-keep-your-users-hooked
Features:
- show most popular profiles - calculated by views + likes (for the day maybe)
    - can boost to be seen there
- ice breakers
    - question game
    - shuffle questions and pick something
    - game 1) 'Would you rather?' pick 2 questions and the other user should choose
    - game 2) '' pick questions to ask
    - game 3) 'Show me something people normally wouldn’t see.' - the other user needs to send a photo
    - game 3) 'Photo game' - pick a question that the other person needs to send an image
        - Show me something people normally wouldn’t see.
        - Show me what you're doing.
    - game 4) 'Most likely to ...' https://www.youtube.com/watch?v=2Adwoe-KiqE
- speed date
    - find people matching search pref and that are verified
    - (maybe):
        - show 2-3 profiles (or swipeable)
        - show all profile info
        - show only blurred profile image. DON'T show other images
        - user cheeses if should do quick call
    - make video call for for 30s or 60s
    - after that rate yes or no
    - if both rated yes - match
- voice and video calling


game workflow:
    - pick game from modal
    - if game is `would you rather ...?`
        - open modal
        <!-- - pick 2 items -->
        <!-- - you can type custom -->
        - pick questions (swipe 'Prev' & 'Next')
        - send { game: 1, questionId, toUserId: ... }

        - persist would_you_rather_games(id, chat_messages_id, question_id, )

        - workflow:
            - u1 & u2 chat
            - u1 propts game
            - (message sent from u1 -> u2 - game prompt)
            - u2 has to choose on 2 ansers (probably click)
                - u2 choses
            - (message sent from u2 -> u1 - answer chosen)
    - if game is `show me ...`
        - open modal
        - pick something from a list that the other person should send you
        - (maybe) type custom text
        - send

        - workflow:
            - u1 & u2 chat
            - u1 propts game
            - (message sent from u1 -> u2 - game prompt)
            - u2 has to type answer
            - (message sent from u2 -> u1 - answer typed)
            - u1 has to type answer in order to see u2 answer
            - (message sent from u1 -> u2 - answer typed)
            - both see their answers
    - if game is `question game`
        - workflow:
            - u1 & u2 chat
            - u1 propts game
            - (message sent from u1 -> u2 - game prompt)
            - u2 has to type answer
            - (message sent from u2 -> u1 - answer typed)
            - u1 has to type answer in order to see u2 answer
            - (message sent from u1 -> u2 - answer typed)
            - both see their answers
    - send workflow is normal chat msg with `game:<number>` prop



https://www.elitesingles.com/mag/online-dating/online-dating-icebreakers
https://datingxp.co/down-brings-icebreakers-photo-challenge/
https://www.elle.com/life-love/sex-relationships/a14461868/dating-app-ice-breakers/


# App features
- search by location
- browse people nearby
- calculated personality type
- profile verification
- realtime messaging - you can send images
- video calls
- icebreakers - play quick games with your matches
- speed date - see some recomended profiles and choose if you want to do quick video call (60sec). At the and say yes/no - both say yes - you match.


https://www.sosyncd.com/
https://www.reddit.com/r/appmarketing/comments/dupyqx/quick_guide_for_successful_mobile_app_marketing/














GAME:
- prompt:
    - gameStage: 1
    - answerOptions: [{...}, {...}]
    - complete
- selected:
    - gameStage: 2
    - selectedAnswerId
    - answerOptions: [{...}, {...}] 






Todo:
- video chat
- (ch) submit feedback
- report user
- (ch) change like buttons styles
- add more translations
- limit likes per 12h
- add your city
- login with Facebook & Google
- share app with friends


Mind    EXTRAVERTED INTROVERTED
Energy  INTUITIVE   OBSERVANT
Our second personality scale includes the Intuitive (N) and Observant (S) styles. These traits describe what people are more likely to do with the information gathered from the world around them. Intuitive personality types rely on imagining the past and future potential of what they see. Those with the Observant style are more interested in observable facts and more straightforward outcomes. They prefer to avoid layering too much interpretation on what they see.

Nature  THINKING    FEELING
Tactics JUDGING     PROSPECTING/PERCEIVING

Identity    ASSERTIVE   TURBULENT

https://en.wikipedia.org/wiki/Myers%E2%80%93Briggs_Type_Indicator#/media/File:MyersBriggsTypes.png
https://www.personalityclub.com/short-personality-test/
https://www.16personalities.com/istp-personality
https://www.16personalities.com/articles/why-finishing-work-tasks-is-harder-for-some-personality-types






Mind    EXTRAVERTED INTROVERTED
<!-- I enjoy being the center of attention     -->
<!-- I avoid being alone -->
<!-- I like to spend my free time alone -->
<!-- I find it challenging to make new friends     -->
<!-- People tell me I am too quiet     -->
<!-- I prefer quiet surroundings     -->
<!-- I make an effort to be popular    -->
<!-- I enjoy chatting with new acquaintances     -->
<!-- I am a private person      -->
<!-- I love to make new friends     -->
<!-- It’s important to me that other people like me     -->
I try not to draw attention to myself
Being around lots of people energizes me
It is easy for me to talk to strangers
I avoid noisy crowds
I would enjoy attending a large party in my honor
I get a thrill out of meeting new people
In my social circle, I'm are often the one who contacts my friends and initiates activities.
At social events, I rarely try to introduce myself to new people and mostly talk to the ones I already know.
After a long and exhausting week, a lively social event is just what I need.
I feel comfortable just walking up to someone I find interesting and striking up a conversation.
I avoid making phone calls.
<!-- You regularly make new friends. -->
<!-- You tend to avoid drawing attention to yourself. -->
<!-- You enjoy participating in group activities. -->
<!-- You avoid leadership roles in group settings. -->
<!-- You usually prefer to be around others rather than on your own. -->
<!-- You feel more drawn to places with busy, bustling atmospheres than quiet, intimate places. -->
<!-- You would love a job that requires you to work alone most of the time. -->


Energy  INTUITIVE   OBSERVANT
<!-- I make sure my work is finished on time     -->
<!-- I like trying out new hobbies     -->
<!-- I am very attentive to deadlines    
I enjoy philosophical discussions     -->
<!-- I am full of new ideas -->
<!-- I like thinking about the mysteries of the universe     -->
I have a vivid imagination
I have a rich fantasy life
It is important to me to understand the bigger picture
I enjoy imagining the future
I make important decisions based on my gut feelings
I enjoy trying to understand complicated ideas
I become bored or lose interest when the discussion gets highly theoretical.
I often spend a lot of time trying to understand views that are very different from your own.
I believe that pondering abstract philosophical questions is a waste of time.
I rarely contemplate the reasons for human existence or the meaning of life.
<!-- You lose patience with people who are not as efficient as you. -->
<!-- You have always been fascinated by the question of what, if anything, happens after death. -->
<!-- You are not too interested in discussing various interpretations and analyses of creative works.
You like books and movies that make you come up with your own interpretation of the ending.
You are definitely not an artistic type of person. -->
<!-- You rarely second-guess the choices that you have made. -->
<!-- You are very intrigued by things labeled as controversial. -->


Nature  THINKING    FEELING
<!-- I give to people who are less fortunate than I     -->
<!-- Emotional people make me uncomfortable     -->
<!-- I am concerned about others     -->
<!-- It is important to me to be of service to others     -->
<!-- I let others know that I care about their feelings     -->
<!-- I think about the needs of others     -->
<!-- I enjoy learning about scientific theories     -->
I wish other people would be more logical
I sympathize with the homeless
It is important to me to make decisions without being swayed by emotions
I am sensitive to the feelings of others
I feel the pain of other people
I think the world would be a better place if people relied more on rationality and less on their feelings.
I am inclined to follow your head than your heart.
I find it easy to empathize with a person whose experiences are very different from yours.
<!-- Your emotions control you more than you control them. -->
<!-- Seeing other people cry can easily make you feel like you want to cry too. -->
<!-- You know at first glance how someone is feeling. -->
<!-- You often have a hard time understanding other people’s feelings. -->

Tactics JUDGING     PROSPECTING/PERCEIVING
<!-- I prefer to follow a schedule     -->
<!-- I like to do things as they were done in the past     -->
<!-- I find it difficult to get down to work     -->
<!-- I carry out my plans     -->
<!-- I have trouble sticking to a routine     -->
<!-- I like to have a detailed plan before starting a task     -->
<!-- I make sure my work is finished on time     -->
<!-- I make plans and stick to them     -->
<!-- I start tasks in advance, so that I have plenty of time to finish     -->
<!-- I finish assignments before they are due     -->
<!-- I have trouble controlling my impulses     -->
<!-- I prefer to follow a clear procedure -->
I would rather go with the flow than have a set schedule    
I like to finish all my chores before I do something fun    
I am easily distracted    
I enjoy having a daily routine    
I jump in and figure things out as I go
I am often unprepared
I usually prefer just doing what I feel like at any given moment instead of planning a particular daily routine.
My personal work style is closer to spontaneous bursts of energy than organized and consistent efforts.
I like to use organizing tools like schedules and lists.
I prefer to completely finish one project before starting another.
<!-- You prefer to do your chores before allowing yourself to relax. -->
<!-- You often make a backup plan for a backup plan. -->
<!-- You usually stay calm, even under a lot of pressure. -->
<!-- You often end up doing things at the last possible moment. -->
<!-- You like to have a to-do list for each day. -->
<!-- You usually postpone finalizing decisions for as long as possible. -->
<!-- You complete things methodically without skipping over any steps. -->
<!-- If your plans are interrupted, your top priority is to get back on track as soon as possible. -->
<!-- You are interested in so many things that you find it difficult to choose what to try next. -->
