const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector("nav ul");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
});

document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

const courses = [
    { name: "CSE 110", category: "cse", credits: 2, completed: true },
    { name: "CSE 111", category: "cse", credits: 2, completed: true },
    { name: "CSE 210", category: "cse", credits: 2, completed: true },
    { name: "WDD 130", category: "wdd", credits: 2, completed: true },
    { name: "WDD 131", category: "wdd", credits: 2, completed: true },
    { name: "WDD 231", category: "wdd", credits: 2, completed: false }
];

const courseList = document.getElementById("course-list");
const courseCount = document.getElementById("course-count");
const buttons = document.querySelectorAll("nav button");

function displayCourses(filter) {
    courseList.innerHTML = "";

    const filtered = filter === "all"
        ? courses
        : courses.filter(course => course.category === filter);

    filtered.forEach(course => {
        const li = document.createElement("li");
        li.textContent = `${course.name} (${course.credits} credits)`;
        li.classList.add(course.completed ? "completed" : "incomplete");
        courseList.appendChild(li);
    });

    const totalCredits = filtered.reduce((sum, course) => sum + course.credits, 0);
    courseCount.textContent = `The total number of courses listed below is ${filtered.length} · Total Credits: ${totalCredits}`;
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        displayCourses(button.dataset.filter);
    });
});

displayCourses("all");