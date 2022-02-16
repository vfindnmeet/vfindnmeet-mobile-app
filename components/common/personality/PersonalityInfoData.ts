const firstLetterLowerCase = (str: string) => !str ? '' : (str.charAt(0).toLowerCase() + str.slice(1));

const generateDescr = (personality: string) => {
  const descr = firstLetterLowerCase(PERSONALITY_SHORT[personality]?.description);
  if (!descr) return '';

  return `What's the ${personality} personality? ${personality} personality types are ${descr}`;
}

export const COLORS = [
  '#4298b4',
  '#e4ae3a',
  '#33a474',
  '#88619a',
];

export const PERSONALITY_TYPES: { [key: string]: string; } = {
  E: 'Extroverted',
  I: 'Introverted',
  S: 'Observent',
  N: 'Intuitive',
  T: 'Thinking',
  F: 'Feeling',
  J: 'Judging',
  P: 'Perceiving',
};

export const PERSONALITY_MEANING: { [key: string]: string; } = {
  E: 'Prefer group activities and get energized by social interaction.',
  I: 'Prefer solitary activities and get exhausted by social interaction.',
  S: 'Highly practical and tend to have strong habits and focus on what is happening or has happened.',
  N: 'Very imaginative and curious. Trying to find hidden meanings and future possibilities.',
  T: 'Focus on objectivity and rationality, prioritizing logic over emotions. They tend to hide their feelings.',
  F: 'Sensitive and emotionally expressive. They are more empathic and less competitive.',
  J: 'Decisive and highly organized. Preferring structure and planning to spontaneity.',
  P: 'Improvising and spotting opportunities. They prefer keeping their options open.',
};

export const PERSONALITIES: string[][] = [
  ['E', 'I'],
  ['S', 'N'],
  ['T', 'F'],
  ['J', 'P'],
];

// https://www.personalitypage.com/html/high-level.html
export const PERSONALITY_SHORT: {
  [key: string]: {
    title: string;
    description: string;
  }
} = {
  INTJ: {
    title: '',
    description: 'Independent, original, analytical, and determined. Have an exceptional ability to turn theories into solid plans of action. Highly value knowledge, competence, and structure. Driven to derive meaning from their visions. Long-range thinkers. Have very high standards for their performance, and the performance of others. Natural leaders, but will follow if they trust existing leaders.'
  },
  INTP: {
    title: '',
    description: 'Logical, original, creative thinkers. Can become very excited about theories and ideas. Exceptionally capable and driven to turn theories into clear understandings. Highly value knowledge, competence and logic. Quiet and reserved, hard to get to know well. Individualistic, having no interest in leading or following others.'
  },
  ENTJ: {
    title: '',
    description: 'Assertive and outspoken - they are driven to lead. Excellent ability to understand difficult organizational problems and create solid solutions. Intelligent and well-informed, they usually excel at public speaking. They value knowledge and competence, and usually have little patience with inefficiency or disorganization.'
  },
  ENTP: {
    title: '',
    description: 'Creative, resourceful, and intellectually quick. Good at a broad range of things. Enjoy debating issues, and may be into "one-up-manship". They get very excited about new ideas and projects, but may neglect the more routine aspects of life. Generally outspoken and assertive. They enjoy people and are stimulating company. Excellent ability to understand concepts and apply logic to find solutions.'
  },
  INFJ: {
    title: '',
    description: 'Quietly forceful, original, and sensitive. Tend to stick to things until they are done. Extremely intuitive about people, and concerned for their feelings. Well-developed value systems which they strictly adhere to. Well-respected for their perserverence in doing the right thing. Likely to be individualistic, rather than leading or following.'
  },
  INFP: {
    title: '',
    description: 'Quiet, reflective, and idealistic. Interested in serving humanity. Well-developed value system, which they strive to live in accordance with. Extremely loyal. Adaptable and laid-back unless a strongly-held value is threatened. Usually talented writers. Mentally quick, and able to see possibilities. Interested in understanding and helping people.'
  },
  ENFJ: {
    title: '',
    description: 'Popular and sensitive, with outstanding people skills. Externally focused, with real concern for how others think and feel. Usually dislike being alone. They see everything from the human angle, and dislike impersonal analysis. Very effective at managing people issues, and leading group discussions. Interested in serving others, and probably place the needs of others over their own needs.'
  },
  ENFP: {
    title: '',
    description: 'Enthusiastic, idealistic, and creative. Able to do almost anything that interests them. Great people skills. Need to live life in accordance with their inner values. Excited by new ideas, but bored with details. Open-minded and flexible, with a broad range of interests and abilities.'
  },
  ISTJ: {
    title: '',
    description: 'Serious and quiet, interested in security and peaceful living. Extremely thorough, responsible, and dependable. Well-developed powers of concentration. Usually interested in supporting and promoting traditions and establishments. Well-organized and hard working, they work steadily towards identified goals. They can usually accomplish any task once they have set their mind to it.'
  },
  ISFJ: {
    title: '',
    description: "Quiet, kind, and conscientious. Can be depended on to follow through. Usually puts the needs of others above their own needs. Stable and practical, they value security and traditions. Well-developed sense of space and function. Rich inner world of observations about people. Extremely perceptive of other's feelings. Interested in serving others."
  },
  ESTJ: {
    title: '',
    description: 'Practical, traditional, and organized. Likely to be athletic. Not interested in theory or abstraction unless they see the practical application. Have clear visions of the way things should be. Loyal and hard-working. Like to be in charge. Exceptionally capable in organizing and running activities. "Good citizens" who value security and peaceful living.'
  },
  ESFJ: {
    title: '',
    description: 'Warm-hearted, popular, and conscientious. Tend to put the needs of others over their own needs. Feel strong sense of responsibility and duty. Value traditions and security. Interested in serving others. Need positive reinforcement to feel good about themselves. Well-developed sense of space and function.'
  },
  ISTP: {
    title: '',
    description: 'Quiet and reserved, interested in how and why things work. Excellent skills with mechanical things. Risk-takers who they live for the moment. Usually interested in and talented at extreme sports. Uncomplicated in their desires. Loyal to their peers and to their internal value systems, but not overly concerned with respecting laws and rules if they get in the way of getting something done. Detached and analytical, they excel at finding solutions to practical problems.'
  },
  ISFP: {
    title: '',
    description: 'Quiet, serious, sensitive and kind. Do not like conflict, and not likely to do things which may generate conflict. Loyal and faithful. Extremely well-developed senses, and aesthetic appreciation for beauty. Not interested in leading or controlling others. Flexible and open-minded. Likely to be original and creative. Enjoy the present moment.'
  },
  ESTP: {
    title: '',
    description: `Friendly, adaptable, action-oriented. "Doers" who are focused on immediate results. Living in the here-and-now, they're risk-takers who live fast-paced lifestyles. Impatient with long explanations. Extremely loyal to their peers, but not usually respectful of laws and rules if they get in the way of getting things done. Great people skills.`
  },
  ESFP: {
    title: '',
    description: 'People-oriented and fun-loving, they make things more fun for others by their enjoyment. Living for the moment, they love new experiences. They dislike theory and impersonal analysis. Interested in serving others. Likely to be the center of attention in social situations. Well-developed common sense and practical ability.'
  }
  // INTJ: 'Independent, original, analytical, and determined. Have an exceptional ability to turn theories into solid plans of action. Highly value knowledge, competence, and structure. Driven to derive meaning from their visions. Long-range thinkers. Have very high standards for their performance, and the performance of others. Natural leaders, but will follow if they trust existing leaders.',
  // INTP: 'Logical, original, creative thinkers. Can become very excited about theories and ideas. Exceptionally capable and driven to turn theories into clear understandings. Highly value knowledge, competence and logic. Quiet and reserved, hard to get to know well. Individualistic, having no interest in leading or following others.',
  // ENTJ: 'Assertive and outspoken - they are driven to lead. Excellent ability to understand difficult organizational problems and create solid solutions. Intelligent and well-informed, they usually excel at public speaking. They value knowledge and competence, and usually have little patience with inefficiency or disorganization.',
  // ENTP: 'Creative, resourceful, and intellectually quick. Good at a broad range of things. Enjoy debating issues, and may be into "one-up-manship". They get very excited about new ideas and projects, but may neglect the more routine aspects of life. Generally outspoken and assertive. They enjoy people and are stimulating company. Excellent ability to understand concepts and apply logic to find solutions.',
  // INFJ: 'Quietly forceful, original, and sensitive. Tend to stick to things until they are done. Extremely intuitive about people, and concerned for their feelings. Well-developed value systems which they strictly adhere to. Well-respected for their perserverence in doing the right thing. Likely to be individualistic, rather than leading or following.',
  // INFP: 'Quiet, reflective, and idealistic. Interested in serving humanity. Well-developed value system, which they strive to live in accordance with. Extremely loyal. Adaptable and laid-back unless a strongly-held value is threatened. Usually talented writers. Mentally quick, and able to see possibilities. Interested in understanding and helping people.',
  // ENFJ: 'Popular and sensitive, with outstanding people skills. Externally focused, with real concern for how others think and feel. Usually dislike being alone. They see everything from the human angle, and dislike impersonal analysis. Very effective at managing people issues, and leading group discussions. Interested in serving others, and probably place the needs of others over their own needs.',
  // ENFP: 'Enthusiastic, idealistic, and creative. Able to do almost anything that interests them. Great people skills. Need to live life in accordance with their inner values. Excited by new ideas, but bored with details. Open-minded and flexible, with a broad range of interests and abilities.',
  // ISTJ: 'Serious and quiet, interested in security and peaceful living. Extremely thorough, responsible, and dependable. Well-developed powers of concentration. Usually interested in supporting and promoting traditions and establishments. Well-organized and hard working, they work steadily towards identified goals. They can usually accomplish any task once they have set their mind to it.',
  // ISFJ: 'Quiet, kind, and conscientious. Can be depended on to follow through. Usually puts the needs of others above their own needs. Stable and practical, they value security and traditions. Well-developed sense of space and function. Rich inner world of observations about people. Extremely perceptive of other\'s feelings. Interested in serving others.',
  // ESTJ: 'Practical, traditional, and organized. Likely to be athletic. Not interested in theory or abstraction unless they see the practical application. Have clear visions of the way things should be. Loyal and hard-working. Like to be in charge. Exceptionally capable in organizing and running activities. "Good citizens" who value security and peaceful living.',
  // ESFJ: 'Warm-hearted, popular, and conscientious. Tend to put the needs of others over their own needs. Feel strong sense of responsibility and duty. Value traditions and security. Interested in serving others. Need positive reinforcement to feel good about themselves. Well-developed sense of space and function.',
  // ISTP: 'Quiet and reserved, interested in how and why things work. Excellent skills with mechanical things. Risk-takers who they live for the moment. Usually interested in and talented at extreme sports. Uncomplicated in their desires. Loyal to their peers and to their internal value systems, but not overly concerned with respecting laws and rules if they get in the way of getting something done. Detached and analytical, they excel at finding solutions to practical problems.',
  // ISFP: 'Quiet, serious, sensitive and kind. Do not like conflict, and not likely to do things which may generate conflict. Loyal and faithful. Extremely well-developed senses, and aesthetic appreciation for beauty. Not interested in leading or controlling others. Flexible and open-minded. Likely to be original and creative. Enjoy the present moment.',
  // ESTP: 'Friendly, adaptable, action-oriented. "Doers" who are focused on immediate results. Living in the here-and-now, they\'re risk-takers who live fast-paced lifestyles. Impatient with long explanations. Extremely loyal to their peers, but not usually respectful of laws and rules if they get in the way of getting things done. Great people skills.',
  // ESFP: 'People-oriented and fun-loving, they make things more fun for others by their enjoyment. Living for the moment, they love new experiences. They dislike theory and impersonal analysis. Interested in serving others. Likely to be the center of attention in social situations. Well-developed common sense and practical ability.',
};

// https://jenniferdurnell.com/2019/05/09/how-you-should-dress-according-to-your-myers-briggs-personality-type/
// https://www.verywellmind.com/the-myers-briggs-type-indicator-2795583
// https://www.dreamsaroundtheworld.com/wp-content/uploads/2017/01/Myers_Briggs_Type_Compatibility_Chart.pdf


// https://www.tolarisd.org/cms/lib3/TX01000982/Centricity/Domain/27/Myers%20Briggs%20Personality%20Test%20Manual.pdf

// https://www.psychologyjunkie.com/the-intp/
// https://www.truity.com/personality-type/INTP
export const PERSONALITY_INFO: { [key: string]: any; } = {
  INTJ: {
    color: COLORS[3],
    title: 'Highly analytical, creative, and logical', // 'Purposful, innovative and structured', // ?
    description: generateDescr('INTJ'),
    // description: [
    //   "What's the INTJ personality? INTJ personality types are highly intelligent, organised, strategic and confident.",
    //   "They have extremely accurate and insightful perceptions about how various plans and concepts could develop over time."
    // ],
    matches: ['ENFP', 'ENTP'],
    strengths: {
      Confident: '',
      Independent: '',
      'Open-minded': '',
      'Hard workers': '',
    },
    weaknesses: {
      Judgemental: '',
      Intolerant: '',
      Arrogant: '',
      'Emotional Distance': '',
    },
  },
  INTP: {
    color: COLORS[3],
    title: 'Logical and objective',
    description: generateDescr('INTP'),
    // description: [
    //   "What's the INTP personality? INTP personality types are very intelligent, curious and have endless thirst for knowledge.",
    //   "They spend much of their time in their own heads: exploring concepts, making connections, and seeking understanding of how things work."
    //   // 'They enjoy spending time alone, thinking about how things work, and coming up with solutions to problems. INTPs have a rich inner world and would rather focus their attention on their internal thoughts rather than the external world. They typically do not have a wide social circle, but they do tend to be close to a select group of people.',
    //   // `They enjoy thinking about theoretical concepts and tend to value intellect over emotion. INTPs are logical and base decisions on objective information rather than subjective feelings.`,
    // ],
    matches: ['ENTJ', 'ESTJ'],
    relationship: [
      // 'INTPs tend to live inside their minds, so they can be quite difficult to get to know. Even in romance, they often hold back until they feel that the other person has proven themselves worthy of hearing these innermost thoughts and feelings.',
      // 'One thing to remember is that while INTPs do enjoy romance in the context of a deeply committed relationship, they do not play games. Be honest and forthright. Because INTPs are not good at understanding the emotional needs of others, you may need to be very direct about what you need and expect in that regard. INTPs also struggle to share their own feelings, so you may need to pay attention to subtle signals that your partner is sending.'
    ],
    strengths: {
      Logical: 'They constantly analyze everything that they come across.',
      Independent: '',
      'Open-Minded': 'Driven by curiosity and an intense desire to learn everything that they can.',
      Curious: 'Always casting about for new pursuits, hobbies, and areas of research. When inspiration strikes, go all in on their newfound interest, learning everything that they can.',
    },
    weaknesses: {
      Insensitive: 'Their focus on ideas and logic, and neglect of personal considerations, can easily offend.',
      Impatient: 'If their conversation partner doesn’t follow along or seem sufficiently interested, Logicians may give up with a dismissive “never mind.”',
      'Absent-minded': 'They easilly get caught up in their own busy minds and can become scattered and disorganized.',
      Perfectionistic: 'At times, they may get so lost in analyzing various options that they never reach a decision.'
    },
    famousPeople: [
      'Albert Einstein',
      'Gandalf',
    ]
    // 'Abstract thinker',
    // 'Independent',
    // 'Loyal and affectionate with loved ones',
    // ],
    // strengths: [
    //   'Logical and objective',
    //   'Abstract thinker',
    //   'Independent',
    //   'Loyal and affectionate with loved ones',
    // ],
    // weaknesses: [
    //   'Difficult to get to know',
    //   'Can be insensitive',
    //   'Prone to self-doubt',
    //   'Struggles to follow rules',
    //   'Has trouble expressing feelings',
    // ],
  },
  ENTJ: {
    color: COLORS[3],
    title: 'Assertive, confident, and outspoken',
    description: generateDescr('ENTJ'),
    // description: [
    //   "What's the ENTJ personality? INTP personality types ",
    // ],
    matches: ['INFP', 'INTP'],
    strengths: {
      Confident: '',
      Efficient: '',
      Inspiring: '',
      Strategic: '',
    },
    weaknesses: {
      Stubborn: '',
      Intolerant: '',
      Arrogant: '',
      Cold: '',
    },
  },
  ENTP: {
    color: COLORS[3],
    title: 'Innovative, clever, and expressive',
    // description: '',
    description: generateDescr('ENTP'),
    matches: ['INFJ', 'INTJ'],
    strengths: {
      Innovative: '',
      Knowledgeable: '',
      Charismatic: '',
      Original: '',
    },
    weaknesses: {
      Impractical: '',
      Procrastination: '',
      Intolerant: '',
      Insensitive: '',
    },
  },

  INFJ: {
    color: COLORS[2],
    title: 'Deep and complex',
    // description: '',
    description: generateDescr('INFJ'),
    matches: ['ENFP', 'ENTP'],
  },
  INFP: {
    color: COLORS[2],
    title: 'Idealistic, creative and principled', // ?
    // description: '',
    description: generateDescr('INFP'),
    matches: ['ENFJ', 'ENTJ'],
  },
  ENFJ: {
    color: COLORS[2],
    title: 'Warm, affectionate, and supportive',
    // description: '',
    description: generateDescr('ENFJ'),
    matches: ['INFP', 'ISFP'],
  },
  ENFP: {
    color: COLORS[2],
    title: 'Enthusiastic, charismatic, and creative',
    // description: '',
    description: generateDescr('ENFP'),
    matches: ['INFJ', 'INTJ'],
  },

  ISTJ: {
    color: COLORS[0],
    title: 'Dependable and trustworthy',
    // description: '',
    description: generateDescr('ISTJ'),
    matches: ['ESFP', 'ESTP'],
  },
  ISFJ: {
    color: COLORS[0],
    title: 'Kind, reliable, and trustworthy',
    // description: '',
    description: generateDescr('ISFJ'),
    matches: ['ESFP', 'ESTP'],
  },
  ESTJ: {
    color: COLORS[0],
    title: 'Stable, committed, and practical',
    // description: '',
    description: generateDescr('ESTJ'),
    matches: ['INTP', 'ISFP', 'ISTP'],
  },
  ESFJ: {
    color: COLORS[0],
    title: 'Warm-hearted, gregarious and empathetic',
    // description: '',
    description: generateDescr('ESFJ'),
    matches: ['ISFP', 'ISTP'],
  },

  ISTP: {
    color: COLORS[1],
    title: 'Quiet and easygoing',
    // description: '',
    description: generateDescr('ISTP'),
    matches: ['ESFJ', 'ESTJ'],
  },
  ISFP: {
    color: COLORS[1],
    title: 'Quiet, easy-going and peaceful',
    // description: '',
    description: generateDescr('ISFP'),
    matches: ['ENFJ', 'ESFJ', 'ESTJ'],
  },
  ESTP: {
    color: COLORS[1],
    title: 'Outgoing, action-oriented, and dramatic',
    // description: '',
    description: generateDescr('ESTP'),
    matches: ['ISFJ', 'ISTJ'],
  },
  ESFP: {
    color: COLORS[1],
    title: 'Warm, kind, and thoughtful',
    // description: '',
    description: generateDescr('ESFP'),
    matches: ['ISFJ', 'ISTJ'],
  },
};
