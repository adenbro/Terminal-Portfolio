function help() {
    return `
Available commands:
- commands: Displays this help message.
- about: Learn about my bio and interests.
- projects: Lists my projects.
- contact: Displays my contact information.
- clear: Clears terminal output.
`;
}

function about() {
    return `
Hello! My name is Aden and I'm a current Mechatronics Engineering student at RMIT. I am passionate about technology and its applications in the real world. I have a strong interest in robotics, automation, and programming.

I enjoy working on projects that challenge my skills and allow me to learn new technologies. In my free time, I like to explore new programming languages and frameworks, as well as contribute to open-source projects.

I am always looking for opportunities to collaborate with others and expand my knowledge in the field of engineering and technology.

I have experience in various programming languages including Python, JavaScript, and C++. I am also familiar with web development technologies such as HTML, CSS, and React. My goal is to leverage my skills in engineering and software development to create innovative solutions that can make a positive impact on society.

I am particularly interested in the intersection of robotics and artificial intelligence, and I am excited about the potential of these technologies to revolutionize industries and improve our daily lives.

I am currently seeking internships and co-op opportunities to gain practical experience in the field and apply my knowledge to real-world projects. If you are interested in collaborating or have any opportunities available, please feel free to reach out!
`;
}

function projects() {
    return `
1. Terminal Portfolio: A web application that showcases my portfolio in a unique and fun terminal interface.
   Technologies: HTML, CSS, JavaScript
   Link: [Project One Link]

2. R.I.L.E.Y.: Riley Project is the first big project I worked on personally. It is a personal Artificial Intelligence that is unique to me. It is an application that works on iOS, Android and Web. I utilised APIs from OpenAI and Google to create a unique experience. It is a personal assistant that can help with various tasks and provide information.
It is a work in progress and I am constantly adding new features and improving its functionality. It remembers everything you tell it and can help with various tasks such as setting reminders, providing information, and answering questions. It is a personal assistant that is unique to me and I am excited to continue working on it.
   Technologies: Python, JavaScript, HTML, CSS, PostgreSQL, OpenAI API, Google API,
   Link: [Project Two Link]

3. Project Three: A data visualization tool for analyzing data.
   Technologies: D3.js, Python
   Link: [Project Three Link]
`;
}

function contact() {
    return `
You can reach me at:
Email: abatemanbrowning@gmail.com
LinkedIn: [https://www.linkedin.com/in/aden-bateman-browning/]
GitHub: [https://github.com/adenbro]
Youtube: [https://www.youtube.com/@
`;
}

function clear() {
    return '';
}

export { help, about, projects, contact, clear };